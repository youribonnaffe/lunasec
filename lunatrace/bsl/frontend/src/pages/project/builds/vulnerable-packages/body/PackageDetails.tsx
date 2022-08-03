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
import { severityOrder, VulnerablePackage } from '@lunatrace/lunatrace-common';
import compareVersions from 'compare-versions';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

import { pluralizeIfMultiple } from '../../../../../utils/string-utils';
import { DepTree } from '../../types';
import { Finding } from '../types';

import { TreeInfo } from './TreeInfo';
interface PackageDetailsProps {
  pkg: VulnerablePackage<Finding>;
  depTree: DepTree | null;
}

export const PackageDetails: React.FunctionComponent<PackageDetailsProps> = ({ pkg, depTree }) => {
  const fixVersions = [...pkg.fix_versions];
  const pkgLocations = pkg.locations.join(', ');
  const recommendVersion = fixVersions.sort(compareVersions).reverse()[0];

  return (
    <div className="mb-3">
      {pkg.fix_state === 'fixed' && (
        <Row>
          <h5>
            <span className="darker">Recommended version: </span>
            {recommendVersion}
          </h5>
        </Row>
      )}
      <Row>
        <Col xl={6} lg={12}>
          <h5>
            <span className="darker">Language: </span>
            <span className="text-capitalize">{pkg.language}</span>
          </h5>
          <h5>
            <span className="darker">{pluralizeIfMultiple(pkg.locations.length, 'Path') + ': '}</span>
            <span className="lighter mx-1">{pkgLocations}</span>
          </h5>
        </Col>
        <Col xl="auto" lg={12} className="justify-content-xl-end d-flex">
          <TreeInfo pkg={pkg} depTree={depTree} />
        </Col>
      </Row>
    </div>
  );
};