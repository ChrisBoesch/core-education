/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */
(function() {
  'use strict';

  describe('scceUser.directives', function() {
    var $compile, $scope, $httpBackend, elem, fix;


    beforeEach(module(
      'scceUser.directives',
      'views/sccoreeducation/user/grid.html',
      'views/sccoreeducation/user/form.html',
      'views/sccoreeducation/user/login.html',
      'scCoreEducationMocked.fixtures'
    ));

    beforeEach(inject(function(_$compile_, _$rootScope_, SC_CORE_EDUCATION_FIXTURES, _$httpBackend_) {
      $compile = _$compile_;
      $scope = _$rootScope_;
      fix = SC_CORE_EDUCATION_FIXTURES;
      $httpBackend = _$httpBackend_;
    }));


    describe('scceUserLogin', function(){

      beforeEach(function(){
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
        expect(elem.find('li:eq(0) p').text()).toBe('Signed in as test@example.com');
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
        $scope.students = [fix.data.students.x1];
        $scope.$digest();

        expect(elem.find('tbody tr').length).toBe(1);
        expect(elem.find('tbody tr td').length).toBe(4);

        $scope.students.push(fix.data.students.x2);
        $scope.$digest();
        expect(elem.find('tbody tr').length).toBe(2);
      });

      it('should show the the grid as loading is user is reset to null', function() {
        $scope.students = [];
        $scope.$digest();
        $scope.students = null;
        $scope.$digest();
        expect(elem.find('tbody tr').length).toBe(1);
        expect(elem.find('tbody tr td').text()).toBe('Loading students');
      });
    });


    describe('scceUserForm', function() {
      var form, saveDeferred, newStudent;

      beforeEach(inject(function($q) {
        saveDeferred = $q.defer();
        $scope.newStudent = {};
        $scope.saveStudent = function(student) {
          newStudent = student;
          return saveDeferred.promise;
        };
        elem = $compile(
          '<scce-user-form ' +
          'scce-user-type="student"' +
          'scce-user-handler="saveStudent"' +
          '></scce-user-form>'
        )($scope);
        $scope.$digest();
        form = $scope.$$childHead.newUserForm;
      }));

      it('should create a form', function() {
        expect(elem.find('form').length).toBe(1);
        expect(elem.find('form input#user_id').length).toBe(1);
        expect(elem.find('form input#user_email').length).toBe(1);
        expect(elem.find('form input#user_firstname').length).toBe(1);
        expect(elem.find('form input#user_lastname').length).toBe(1);
        expect(elem.find('form input#user_photo').length).toBe(1);
        expect(form.$valid).toBe(false);
      });

      it('should be valid when id names and email are provided', function() {
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(true);
      });

      it('should be valid with a missing photo', function() {
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        // form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(true);
      });

      it('should be invalid with a missing email', function() {
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        // form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(false);
      });

      it('should be invalid with a missing id', function() {
        // form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(false);
      });

      it('should be invalid with a missing first name', function() {
        form.userId.$setViewValue('x3');
        // form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(false);
      });

      it('should be invalid with a missing last name', function() {
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        // form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(false);
      });

      it('should be invalid with an invalid email', function() {
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        expect(form.$valid).toBe(false);
      });

      it('should be invalid with an invalid photo url', function() {
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin');
        form.userPhoto.$setViewValue('example.com/image.jpg');
        expect(form.$valid).toBe(false);
      });

      it('should trigger onSubmit when the form is submitted', function(){
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        elem.find('button#submitButton').click();

        expect(newStudent).toEqual({
          id: 'x3',
          firstName: 'Martin',
          lastName: 'Wright',
          email: 'martin@example.com',
          photo: 'http://example.com/image.jpg'
        });
      });

      it('should disable the form after submit', function(){
        var button = elem.find('button#submitButton');

        // Before filling the form
        // the button is disabled
        expect(button.prop('disabled')).toBe(true);
        form.userId.$setViewValue('x3');
        form.userFirstName.$setViewValue('Martin');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('martin@example.com');
        form.userPhoto.$setViewValue('http://example.com/image.jpg');
        $scope.$digest();
        // the form should be valid,
        // the button should enabled
        expect(button.prop('disabled')).toBe(false);

        button.click();
        $scope.$digest();
        // The button should be disabled while saving
        expect(button.prop('disabled')).toBe(true);

        saveDeferred.resolve('done');
        $scope.$digest();
        // The form is reset, the button be disbaled
        expect(button.prop('disabled')).toBe(true);

        form.userId.$setViewValue('x4');
        form.userFirstName.$setViewValue('David');
        form.userLastName.$setViewValue('Wright');
        form.userEmail.$setViewValue('david@example.com');

        // the form should be valid,
        // the button should enabled
        $scope.$digest();
        expect(button.prop('disabled')).toBe(false);

      });

    });
  });

})();