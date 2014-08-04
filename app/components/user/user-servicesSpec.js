/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect, _ */

(function() {
  'use strict';

  describe('scceUser.services', function() {
    var $httpBackend, scope, $http, fix;

    beforeEach(module('scceUser.services', 'scCoreEducationMocked.fixtures'));

    beforeEach(inject(function(_$httpBackend_, $rootScope, _$http_, SC_CORE_EDUCATION_FIXTURES) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $http = _$http_;
      fix = SC_CORE_EDUCATION_FIXTURES;
    }));

    describe('scceCurrentUserApi', function() {
      var currentUserApi, user;

      beforeEach(inject(function(scceCurrentUserApi) {
        currentUserApi = scceCurrentUserApi;
        user = _.assign({}, fix.data.user);
      }));

      it('query the server for the current user', function() {
        var info;

        $httpBackend.expectGET(/\/api\/v1\/user\?returnUrl=.*/).respond(user);

        currentUserApi.auth().then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.displayName).toBeDefined();
        expect(info.displayName).toBe(fix.data.user.displayName);

      });

      it('query the server for the current user and the logout url', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(user);

        currentUserApi.auth('/foo').then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.displayName).toBeDefined();
        expect(info.displayName).toBe(fix.data.user.displayName);

      });

      it('return the log in url for logged off users', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(fix.data.loginError);

        currentUserApi.auth('/foo').then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.loginUrl).toBe(fix.data.loginError.loginUrl);

      });

      it('should fail if the server failed to return the login info', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(function() {
          return [500, 'Server error'];
        });

        currentUserApi.auth('/foo').
        catch(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.data).toBe('Server error');
        expect(info.status).toBe(500);

      });

      it('should merge concurrent requests', function() {
        var callCount = 0,
          users = [];

        $httpBackend.whenGET(/\/api\/v1\/user/).respond(function() {
          callCount++;
          return [200, user];
        });

        function saveUser(user) {
          users.push(user);
          return user;
        }

        currentUserApi.auth().then(saveUser);
        currentUserApi.auth().then(saveUser);

        $httpBackend.flush();
        expect(callCount).toBe(1);

        expect(users.length).toBe(2);
        expect(users[0].displayName).toEqual(fix.data.user.displayName);
        expect(users[1].displayName).toEqual(fix.data.user.displayName);
        expect(users[0]).toBe(users[1]);
      });

      it('should not fetch user data again if already fetch', function() {
        var callCount = 0,
          users = [];

        $httpBackend.whenGET(/\/api\/v1\/user/).respond(function() {
          callCount++;
          return [200, user];
        });

        function saveUser(user) {
          users.push(user);
          return user;
        }

        currentUserApi.auth().then(saveUser);
        $httpBackend.flush();
        currentUserApi.auth().then(saveUser);
        scope.$digest();
        expect(callCount).toBe(1);

        expect(users.length).toBe(2);
        expect(users[0].displayName).toEqual(fix.data.user.displayName);
        expect(users[1].displayName).toEqual(fix.data.user.displayName);
        expect(users[0]).toEqual(users[1]);
      });

      it('should reset user after 401 resp to relative url', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond(user);
        currentUserApi.auth();
        $httpBackend.flush();

        $httpBackend.whenGET('/api/v1/foo/').respond(function() {
          return [401, {}];
        });

        $http.get('/api/v1/foo/');
        $httpBackend.flush();

        expect(currentUserApi.info).toEqual(
          {'loginUrl': fix.data.user.loginUrl, 'error': undefined}
        );
      });

      it('should reset user after 401 resp to a url to same domain', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond(user);
        currentUserApi.auth();
        $httpBackend.flush();

        $httpBackend.whenGET(/http:\/\//).respond(function() {
          return [401, {}];
        });

        expect(currentUserApi.info.displayName).toEqual(fix.data.user.displayName);

        $http.get('http://server/foo/');
        $httpBackend.flush();

        expect(currentUserApi.info).toEqual(
          {'loginUrl': fix.data.user.loginUrl, 'error': undefined}
        );
      });

      it('should not reset user after 401 resp to other domain', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond(user);
        currentUserApi.auth();
        $httpBackend.flush();

        $httpBackend.whenGET(/http:\/\//).respond(function() {
          return [401, {}];
        });

        expect(currentUserApi.info.displayName).toEqual(fix.data.user.displayName);

        $http.get('http://example.com/api');
        $httpBackend.flush();

        expect(currentUserApi.info.displayName).toEqual(fix.data.user.displayName);
      });

      it('should keep user.loginUrl after 401 resp', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond({
          loginUrl: '/login'
        });
        currentUserApi.auth();
        $httpBackend.flush();

        expect(currentUserApi.info.loginUrl).toEqual('/login');

        $httpBackend.whenGET('/api/v1/foo/').respond(function() {
          return [401, {}];
        });

        $http.get('/api/v1/foo/');
        $httpBackend.flush();

        expect(currentUserApi.info.loginUrl).toEqual('/login');
      });

    });

  });

})();