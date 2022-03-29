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
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { AiFillCode, AiFillDiff, AiFillGithub } from 'react-icons/ai';

export const ScanTypesExplanation: React.FC = () => {
  return (
    <>
      <Row className="justify-content-center">
        <h4 className="text-center mt-3">Types of LunaTrace Scan</h4>
        <Col md="4">
          <Card style={{ height: '100%' }}>
            <Card.Body>
              <Card.Title className="text-center">
                <AiFillGithub className="m-3" size="40px" />

                <h3>GitHub Automatic Scan</h3>
              </Card.Title>
              <span>
                If this project was imported from github, PRs will automatically be scanned. Configure or disable this
                in settings.
              </span>
            </Card.Body>
          </Card>
        </Col>
        <Col md="4">
          <Card style={{ height: '100%' }}>
            <Card.Body>
              <Card.Title className="text-center">
                <AiFillCode size="40px" className="m-3" />

                <h3>LunaTrace CLI Scan</h3>
              </Card.Title>
              <span>
                Use the LunaTrace CLI LINK to upload snapshots from the command line. This is particularly useful for
                built artifacts such as .jar files, docker containers, and anything you want to scan that isn&apos;t
                committed to the repository. Typically done as part of a build job.
              </span>
            </Card.Body>
          </Card>
        </Col>
        <Col md="4">
          <Card style={{ height: '100%' }}>
            <Card.Body>
              <Card.Title className="text-center">
                <AiFillDiff className="m-3" size="40px" />
                <h3>Drag and Drop Scan</h3>
              </Card.Title>

              <span>
                Use the drag and drop box to do a one-off snapshot of an artifact. Works on everything from manifest
                files (such as package-lock.json) to built artifacts (like .jars) to zip files of your entire repo.
              </span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};