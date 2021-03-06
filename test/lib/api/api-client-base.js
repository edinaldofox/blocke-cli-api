/*
Copyright (C) 2017 BikBikBikBikBik

This file is part of blocke.

blocke is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

blocke is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with blocke.  If not, see <http://www.gnu.org/licenses/>.
*/
const ApiClientBase = require('../../../lib/api/api-client-base');
const apiResources = require('../../../lib/api/resources');
const assert = require('../../chai-setup');
const nock = require('nock');
const random = require('../../random-generator');

describe('lib/api/api-client-base', function() {
	/*
	 *
	 *  constructor
	 *
	 */
	describe('constructor', function() {
		it('should save the apiBaseAddress internally', function() {
			const apiBaseAddress = random.generateRandomHashString(16, '4e5u6htgb');
			const apiClient = new ApiClientBase(apiBaseAddress);
			
			assert.equal(apiClient._apiBaseAddress, apiBaseAddress);
		});
	});
	
	/*
	 *
	 *  executeRequest
	 *
	 */
	describe('executeRequest', function() {
		it('should return resolved promise', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '435trthdf')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const mockResponseData = random.generateRandomHashString(48, '67tyed');
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, '34rehg')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).reply(200, mockResponseData);
			
			apiClient.executeRequest(uriSuffix, random.generateRandomHashString(4)).should.eventually.deep.equal(mockResponseData).and.notify(done);
		});
		
		it('should return rejected promise (Connection timeout)', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '43rtds')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, '3425ytdf')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).replyWithError({ code: 'ETIMEDOUT', connect: true });
			
			apiClient.executeRequest(uriSuffix, random.generateRandomHashString(4)).should.eventually.be.rejectedWith(apiResources.connectionTimeoutMessage).and.notify(done);
		});
		
		it('should return rejected promise (HTTP 400 response)', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '8756rtsd')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const objectName = random.generateRandomHashString(4, '4sherwtdfv');
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, 'ikryujtdh')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).reply(400, {success: false});
			
			apiClient.executeRequest(uriSuffix, objectName).should.eventually.be.rejectedWith(apiResources.generateObjectNotFoundMessage(objectName)).and.notify(done);
		});
		
		it('should return rejected promise (HTTP 404 response)', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '697t8iyujt')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const objectName = random.generateRandomHashString(4, '34etsr');
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, 'ejsrgfd')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).reply(404, {success: false});
			
			apiClient.executeRequest(uriSuffix, objectName).should.eventually.be.rejectedWith(apiResources.generateObjectNotFoundMessage(objectName)).and.notify(done);
		});
		
		it('should return rejected promise (HTTP 429 response)', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '45367yr')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, '8i5e74')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).reply(429, {success: false});
			
			apiClient.executeRequest(uriSuffix, random.generateRandomHashString(4)).should.eventually.be.rejectedWith(apiResources.tooManyRequestsMessage).and.notify(done);
		});
		
		it('should return rejected promise (HTTP 500 response)', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '1q432wet')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const objectName = random.generateRandomHashString(4, '654rytdg');
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, '23wsre')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).reply(500, {success: false});
			
			apiClient.executeRequest(uriSuffix, objectName).should.eventually.be.rejectedWith(apiResources.generateGenericObjectErrorMessage(objectName)).and.notify(done);
		});
		
		it('should return rejected promise (Read timeout)', function(done) {
			const apiBaseAddress = `https://${random.generateRandomHashString(16, '34tsrdf')}.com`;
			const apiClient = new ApiClientBase(apiBaseAddress);
			const uriSuffix = `/api/get/${random.generateRandomHashString(16, '234tserdf')}`;
			
			nock(apiBaseAddress).get(`${uriSuffix}`).replyWithError({ code: 'ESOCKETTIMEDOUT', connect: false });
			
			apiClient.executeRequest(uriSuffix, random.generateRandomHashString(4)).should.eventually.be.rejectedWith(apiResources.readTimeoutMessage).and.notify(done);
		});
	});
});