/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */

(function() {
  'use strict';

  describe('scceStudents.services', function() {
    var $httpBackend, scope, $, fix;

    beforeEach(module('scceStudents.services', 'scCoreEducationMocked.fixtures'));

    beforeEach(inject(function(_$httpBackend_, $rootScope, $window, SC_CORE_EDUCATION_FIXTURES) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $ = $window.jQuery;
      fix = SC_CORE_EDUCATION_FIXTURES;
    }));

    describe('scceStudentsApi', function() {
      var studentsApi, studentsList;

      beforeEach(inject(function(scceStudentsApi) {
        studentsApi = scceStudentsApi;
        studentsList = Object.keys(fix.data.userList).filter(function(id) {
          return fix.data.userList[id].isStudent;
        }).map(function(id) {
          return fix.data.userList[id];
        });
      }));

      it('should query the server for the list of students', function() {
        var students;

        $httpBackend.expectGET('/api/v1/students').respond(
          JSON.stringify({
            type: 'users',
            users: studentsList,
            cursor: 'foo'
          })
        );

        studentsApi.all().then(function(_students) {
          students = _students;
        });

        $httpBackend.flush();
        expect(students.length).toBe(studentsList.length);
        expect(students[0].id).toEqual(studentsList[0].id);
        expect(students[1].id).toEqual(studentsList[1].id);
        expect(students.cursor).toBe('foo');
      });

    });


  });

})();