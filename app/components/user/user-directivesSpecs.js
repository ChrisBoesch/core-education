/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */
(function() {
  'use strict';

  describe('scceUser.directives', function() {
    var $compile, $scope, $httpBackend, elem, fix;


    beforeEach(module(
      'scceUser.directives',
      'views/sccoreeducation/user/grid.html',
      'views/sccoreeducation/user/login.html',
      'scCoreEducationMocked.fixtures'
    ));

    beforeEach(inject(function(_$compile_, _$rootScope_, SC_CORE_EDUCATION_FIXTURES, _$httpBackend_) {
      $compile = _$compile_;
      $scope = _$rootScope_;
      fix = SC_CORE_EDUCATION_FIXTURES;
      $httpBackend = _$httpBackend_;
    }));


    describe('scceUserLogin', function() {

      beforeEach(function() {
        elem = $compile('<scce-user-login></scce-user-login>')($scope);
      });

      it('should initially show loading message', function() {
        $httpBackend.whenGET(fix.urls.login).respond(fix.data.user);
        $scope.$digest();
        expect(elem.find('li:eq(0) p').text()).toBe('Loading current user info...');
      });

      it('should initially show the user name if he\'s logged in', function() {
        $httpBackend.whenGET(fix.urls.login).respond(fix.data.user);
        $scope.$digest();
        $httpBackend.flush();
        expect(elem.find('li:eq(0) p').text()).toBe('Signed in as Damien Lebrun');
      });

      it('should initially show the logout url if the user is logged in', function() {
        $httpBackend.whenGET(fix.urls.login).respond(fix.data.user);
        $scope.$digest();
        $httpBackend.flush();
        expect(elem.find('li:eq(1) a').text().trim()).toBe('logout');
        expect(elem.find('li:eq(1) a').prop('href')).toBeTruthy();
      });

      it('should initially show the login url if the user is logged out', function() {
        $httpBackend.whenGET(fix.urls.login).respond(fix.data.loginError);
        $scope.$digest();
        $httpBackend.flush();
        expect(elem.find('li:eq(1) a').text().trim()).toBe('login');
        expect(elem.find('li:eq(1) a').prop('href')).toBeTruthy();
      });

    });


    describe('scceUserGrid', function() {

      beforeEach(function() {
        elem = $compile('<scce-user-grid scce-users="students" scce-user-type="students"></scce-user-grid>')($scope);
        $scope.$digest();
      });

      it('should initialy be loading', function() {
        expect(elem.find('table').length).toBe(1);
        expect(elem.find('thead tr').length).toBe(1);
        expect(elem.find('tbody tr').length).toBe(1);
        expect(elem.find('tbody tr td').text()).toBe('Loading students');
      });

      it('should show the the grid as empty when users is an empty grid', function() {
        $scope.students = [];
        $scope.$digest();
        expect(elem.find('tbody tr').length).toBe(1);
        expect(elem.find('tbody tr td').text()).toBe('No students');
      });

      it('should display users infos', function() {
        $scope.students = Object.keys(fix.data.userList).filter(function(id) {
          return fix.data.userList[id].isStudent;
        }).map(function(id) {
          return fix.data.userList[id];
        });
        $scope.$digest();

        expect(elem.find('tbody tr').length).toBe($scope.students.length);
        expect(elem.find('tbody tr td').length).toBe(3 * $scope.students.length);

        $scope.students.pop();
        $scope.$digest();
        expect(elem.find('tbody tr').length).toBe($scope.students.length);
      });

      it('should show the the grid as loading if user is reset to null', function() {
        $scope.students = [];
        $scope.$digest();
        $scope.students = null;
        $scope.$digest();
        expect(elem.find('tbody tr').length).toBe(1);
        expect(elem.find('tbody tr td').text()).toBe('Loading students');
      });
    });

  });

})();