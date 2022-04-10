/*
 * Copyright by LunaSec (owned by Refinery Labs, Inc)
 *
 * Licensed under the Business Source License v1.1
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 * https://github.com/lunasec-io/lunasec/blob/master/licenses/BSL-LunaTrace.txt
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { filterFindingsByIgnored, Finding, groupByPackage, VulnerablePackage } from '@lunatrace/lunatrace-common';
import markdownTable from 'markdown-table';

import { hasura } from '../hasura-api';
import { InsertedScan } from '../models/scan';

import { getInstallationAccessToken } from './auth';

import { generateGithubGraphqlClient } from './index';

function formatLocationText(finding: VulnerablePackage<Finding>) {
  if (finding.locations.length === 0) {
    return 'Unknown';
  }

  return `${finding.locations.length} location${finding.locations.length > 1 ? 's' : ''}`;
}

function generatePullRequestCommentFromReport(projectId: string, scan: InsertedScan) {
  const messageParts = [
    process.env.NODE_ENV === 'production' ? null : 'DEV MODE WORKER',
    '## Build Snapshot Complete',
    '',
    `\n[View Full Report](https://lunatrace.lunasec.io/project/${projectId}/build/${scan.build_id})`,
  ];

  const unignoredFindings = filterFindingsByIgnored(scan.findings);

  if (!unignoredFindings) {
    return messageParts.join('\n');
  }

  const groupedFindings = groupByPackage(projectId, unignoredFindings);
  const filteredFindings = Object.values(groupedFindings).filter(
    // TODO: Make the severity filter configurable.
    (finding) => finding.severity !== 'Unknown' && finding.severity === 'Critical'
  );

  const tableData: string[][] = filteredFindings.map((finding): string[] => {
    return [
      finding.package_name,
      finding.version || 'Unknown Version',
      finding.severity,
      formatLocationText(finding),
      `[Dismiss](https://lunatrace.lunasec.io/project/${projectId}/build/${scan.build_id})`,
    ] as string[];
  });

  messageParts.push('### Security Scan Findings');
  messageParts.push(`Showing ${tableData.length} results.\n`);
  messageParts.push(markdownTable([['Package Name', 'Versions', 'Severity', 'Locations', ''], ...tableData]));

  return messageParts.join('\n');
}

export async function commentOnPrIfExists(buildId: string, scanReport: InsertedScan) {
  const buildLookup = await hasura.GetScanReportNotifyInfoForBuild({
    build_id: buildId,
  });

  if (
    !buildLookup.builds_by_pk ||
    !buildLookup.builds_by_pk.project ||
    !buildLookup.builds_by_pk.project.organization
  ) {
    console.error(`unable to get required scan notify information for buildId: ${buildId}`);
    return;
  }

  const projectId = buildLookup.builds_by_pk.project.id;
  const installationId = buildLookup.builds_by_pk.project.organization.installation_id;
  const pullRequestId = buildLookup.builds_by_pk.pull_request_id;

  if (!installationId) {
    console.log(
      `installation id is not defined for the organization linked to build: ${buildId}, skipping github PR comment`
    );
    return;
  }

  if (!pullRequestId) {
    console.log(
      `pull request id is not defined for buildId: ${buildId}, skipping comment because this build did not come from a PR`
    );
    return;
  }

  const installationToken = await getInstallationAccessToken(installationId);

  const github = generateGithubGraphqlClient(installationToken);

  const body = generatePullRequestCommentFromReport(projectId, scanReport);

  if (body === null) {
    console.error(`generated scan report is null`, {
      projectId,
      installationId,
      pullRequestId,
    });
    return;
  }

  await github.AddComment({
    subjectId: pullRequestId.toString(),
    body,
  });
}