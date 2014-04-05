/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */

(function() {
  'use strict';

  describe('scceUser.services', function() {
    var $httpBackend, scope;

    beforeEach(module('scceUser.services'));

    beforeEach(inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
    }));

    describe('scceCurrentUserApi', function() {
      var currentUserApi;

      beforeEach(inject(function(scceCurrentUserApi) {
        currentUserApi = scceCurrentUserApi;
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

        currentUserApi.get().then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.name).toBe('bob');

      });

      it('query the server for the current user and the logout url', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond({
          'name': 'bob',
          'isAdmin': true,
          'isStaff': false,
          'isStudent': false,
          'logoutUrl': '/logout',
        });

        currentUserApi.get('/foo').then(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.name).toBe('bob');

      });

      it('return the log in url for logged off users', function() {
        var info;

        $httpBackend.expectGET('/api/v1/user?returnUrl=%2Ffoo').respond(function() {
          return [401, {'error': 'No user logged in', 'loginUrl': '/login'}];
        });

        currentUserApi.get('/foo').then(function(_info) {
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

        currentUserApi.get('/foo').catch(function(_info) {
          info = _info;
        });
        $httpBackend.flush();
        expect(info.data).toBe('Server error');
        expect(info.status).toBe(500);

      });

    });

  });

})();