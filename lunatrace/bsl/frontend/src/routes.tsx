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
import { RouteObject } from 'react-router';

import MainLayout from './layouts/Main';
import { OrganizationsList, VulnerabilitiesMain } from './pages';
import { ProjectMain } from './pages/project/Main';
import { BuildDetails } from './pages/project/builds/BuildDetails';
import { Builds } from './pages/project/builds/Builds';
import { VulnerabilityDetail } from './pages/vulnerabilities/Detail';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'vulnerabilities',
        children: [
          {
            path: '',
            element: <VulnerabilitiesMain />,
          },
          {
            path: ':vulnerability_id',
            element: <VulnerabilityDetail />,
          },
        ],
      },
      {
        path: 'organization',
        children: [
          {
            path: '',
            element: <OrganizationsList />,
          },
          {
            path: ':organization_id',
            // element: <Organization />,
          },
        ],
      },
      {
        path: 'project',
        children: [
          {
            path: ':project_id',
            element: <ProjectMain />,
            children: [
              {
                path: '', // the default
                element: <Builds />,
              },
              {
                path: 'build/:build_id',
                element: <BuildDetails />,
              },
            ],
          },
        ],
      },
      {
        element: <p>404</p>, //doesnt work
      },
    ],
  },
];