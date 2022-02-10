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
import React, { MouseEventHandler } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

import { prettyDate } from '../../../utils/pretty-date';
import { BuildInfo } from '../types';

interface BuildListItemProps {
  build: BuildInfo;
  onClick: (_e: unknown) => void;
}

export const BuildListItem: React.FunctionComponent<BuildListItemProps> = ({ build, onClick }) => {
  const uploadDate = prettyDate(new Date(build.created_at as string));
  const lastScannedDate = build.scans[0] ? prettyDate(new Date(build.scans[0].created_at as string)) : 'Never';

  return (
    <Card onClick={onClick} className="flex-fill w-100 build build-card clickable-card">
      <Card.Header>
        <Container fluid>
          <Row>
            <Col sm="6">
              <Card.Title>
                <h3>
                  <span className="darker">Build # </span>
                  {build.build_number}{' '}
                </h3>
              </Card.Title>
              <Card.Subtitle className="darker">Uploaded {uploadDate}</Card.Subtitle>
            </Col>
            <Col sm={{ span: 6 }}>
              <div style={{ float: 'right', textAlign: 'right' }}>
                <Card.Title>
                  <h3 style={{ display: 'inline' }}>{build.critical_packages.aggregate?.count}</h3>
                  <span className="text-right darker"> critical packages</span>
                </Card.Title>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body className="d-flex">
        <Container fluid>
          <Row>
            <Col xs="12" sm={{ order: 'last', span: 5, offset: 4 }}>
              <h6 style={{ textAlign: 'right' }}>
                <span className="darker"> Last scanned:</span> {lastScannedDate}
              </h6>
              <h6 style={{ textAlign: 'right' }}>
                <span className="darker">
                  Scanned {build.scans_aggregate.aggregate?.count} time
                  {build.scans_aggregate.aggregate?.count !== 1 ? 's' : ''}
                </span>
              </h6>
            </Col>
            <Col xs="12" sm="3">
              <div className="build-git-info">
                <h6>
                  <span className="darker">Branch: </span> master
                </h6>
                <h6>
                  <span className="darker">Commit: </span> 1231adf... ↪
                </h6>
              </div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};