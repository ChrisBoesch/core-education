/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */

(function() {
  'use strict';

  describe('scceUser.services', function() {
    var $httpBackend, scope, $http;

    beforeEach(module('scceUser.services'));

    beforeEach(inject(function(_$httpBackend_, $rootScope, _$http_) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $http = _$http_;
    }));

    describe('scceCurrentUserApi', function() {
      var currentUserApi, bob;

      beforeEach(inject(function(scceCurrentUserApi) {
        currentUserApi = scceCurrentUserApi;
        bob = {
          'name': 'bob',
          'isAdmin': true,
          'isStaff': false,
          'isStudent': false,
          'logoutUrl': '/logout',
        };
      }));

      it('query the server for the current user', function() {
        var info;

        $httpBackend.expectGET(/\/api\/v1\/user\?returnUrl=.*/).respond({
          'name': 'bob',
          'isAdmin': true,
          'isStaff': false,
          'isStudent': false,
          'logoutUrl': '/logout',
        });

        currentUserApi.auth().then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.name).toBe('bob');

      });

      it('query the server for the current user and the logout url', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(bob);

        currentUserApi.auth('/foo').then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.name).toBe('bob');

      });

      it('return the log in url for logged off users', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(function() {
          return [401, {
            'error': 'No user logged in',
            'loginUrl': '/login'
          }];
        });

        currentUserApi.auth('/foo').then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.loginUrl).toBe('/login');

      });

      it('should fail if the server failed to return the login info', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(function() {
          return [500, 'Server error'];
        });

        currentUserApi.auth('/foo').
        catch (function(_info) {
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
          return [200, bob];
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
        expect(users[0].name).toEqual('bob');
        expect(users[1].name).toEqual('bob');
        expect(users[0]).toBe(users[1]);
      });

      it('should an user data if already fetch', function() {
        var callCount = 0,
          users = [];

        $httpBackend.whenGET(/\/api\/v1\/user/).respond(function() {
          callCount++;
          return [200, bob];
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
        expect(users[0].name).toEqual('bob');
        expect(users[1].name).toEqual('bob');
        expect(users[0]).toBe(users[1]);
      });

      it('should reset user after 401 resp to relative url', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond(bob);
        currentUserApi.auth();
        $httpBackend.flush();

        $httpBackend.whenGET('/api/v1/foo/').respond(function() {
          return [401, {}];
        });

        expect(currentUserApi.info.name).toEqual('bob');

        $http.get('/api/v1/foo/');
        $httpBackend.flush();

        expect(currentUserApi.info).toBe(null);
      });

      it('should reset user after 401 resp to relative url', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond(bob);
        currentUserApi.auth();
        $httpBackend.flush();

        $httpBackend.whenGET(/http:\/\//).respond(function() {
          return [401, {}];
        });

        expect(currentUserApi.info.name).toEqual('bob');

        $http.get('http://server/foo/');
        $httpBackend.flush();

        expect(currentUserApi.info).toBe(null);
      });

      it('should reset user after 401 resp to other domain', function() {
        $httpBackend.whenGET(/\/api\/v1\/user/).respond(bob);
        currentUserApi.auth();
        $httpBackend.flush();

        $httpBackend.whenGET(/http:\/\//).respond(function() {
          return [401, {}];
        });

        expect(currentUserApi.info.name).toEqual('bob');

        $http.get('http://example.com/api');
        $httpBackend.flush();

        expect(currentUserApi.info.name).toEqual('bob');
      });

    });

  });

})();