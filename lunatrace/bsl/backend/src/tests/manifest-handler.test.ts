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
import fs from 'fs';
import path from 'path';

import sbomS3EventSqsMessageFixture from '../fixtures/upload-manifest-sqs-message.json';
import { callLunatrace, handleGenerateSbom } from '../sqs-handlers/generateSbom';
import { S3ObjectMetadata } from '../types/s3';

const objectMetadata: S3ObjectMetadata = {
  key: '64ce049e-7dac-49a9-b9cb-0e3a53c23e37/2022/2/5/13/9c20ac11-556d-4c2a-886e-00dc12b81ab4',
  bucketName: 'test-manifest-bucket-one',
  region: 'us-west-2',
};

jest.setTimeout(30000);

describe('manifest handler', () => {
  it.only('should do full manifest processing flow', async () => {
    await handleGenerateSbom(objectMetadata);
  });

  it('should call lunatrace cli', (done) => {
    const fileContents = fs.createReadStream(path.resolve(__dirname, '../fixtures/package-lock.json'));
    const spawnedCommand = callLunatrace(fileContents, 'package-lock.json');

    const stdoutDataCallback = jest.fn();
    spawnedCommand.stdout.on('data', stdoutDataCallback);
    spawnedCommand.on('close', () => {
      expect(stdoutDataCallback).toBeCalled();
      console.log('command finished');
      done();
    });
  });
});