/*
 * Copyright 2021 by LunaSec (owned by Refinery Labs, Inc)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/// <reference types="cypress" />
import 'cypress-iframe'
// Cypress.Commands.add('iframe', (iframeSelector, elSelector) => {
//     return cy
//       .get(iframeSelector, { timeout: 10000 })
//       .should($iframe => {
//         expect($iframe.contents().find(elSelector||'body')).to.exist
//       })
//       .then($iframe => {
//         return cy.wrap($iframe.contents().find('body'))
//       })
//   })

import 'cypress-file-upload'