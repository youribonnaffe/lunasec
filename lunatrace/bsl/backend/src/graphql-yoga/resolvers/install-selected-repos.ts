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
import { GraphQLYogaError } from '@graphql-yoga/node';

import { getInstallationsFromUser } from '../../github/actions/get-installations-from-user';
import { installProjectsFromGithub } from '../../github/actions/install-projects-from-github';
import { GithubRepositoryInfo } from '../../types/github';
import { log } from '../../utils/log';
import { Context } from '../context';
import { MutationResolvers, OrgsWithReposInput } from '../generated-resolver-types';
import { getGithubUserToken, throwIfUnauthenticated } from '../helpers/auth-helpers';

type InstallSelectedReposType = NonNullable<MutationResolvers['installSelectedRepos']>;

interface OrgWithRepos {
  organizationName: string;
  installationId: number;
  repos: GithubRepositoryInfo[];
}
/**
 * Installs the repos the user selected in the GUI
 */
export const installSelectedReposResolver: InstallSelectedReposType = async (parent, args, ctx, _info) => {
  throwIfUnauthenticated(ctx);

  const orgs = args.orgs;
  if (!orgs) {
    throw new GraphQLYogaError('No array of orgs provided');
  }
  if (orgs.length === 0) {
    return { success: true };
  }
  await throwIfInstallationsUnauthenticated(orgs, ctx);

  // Go through each org and add the repos from it
  await Promise.all(
    orgs.map(async (org) => {
      log.info('Attempting to upsert selected repos from org ', { org });
      const result = await installProjectsFromGithub(org.installationId, org.repos);
      if (result.error) {
        log.error('Failure during project installation', result.msg);
        throw new GraphQLYogaError(`Failed to install repos from organization: ${result.msg}`);
      }
    })
  );
  return { success: true };
};

// TODO: Not sure if this security check is necessary
// Without this it MIGHT be possible for someone to trigger installs for repos and orgs they don't own, although not gain access to them. Not sure.
async function throwIfInstallationsUnauthenticated(orgs: OrgsWithReposInput[], ctx: Context) {
  const userToken = await getGithubUserToken(ctx);
  const installations = await getInstallationsFromUser(userToken);

  const anyInstallationsUnauthenticated = orgs.some((org) => {
    return !installations.some((installation) => {
      return installation.id === org.installationId;
    });
  });

  if (anyInstallationsUnauthenticated) {
    log.error(
      'A user attempted to install from an installation they didnt have access to, most likely a hacking attempt.',
      orgs,
      installations
    );
    throw new GraphQLYogaError('User not authenticated to install from this organization, this event has been logged.');
  }
}