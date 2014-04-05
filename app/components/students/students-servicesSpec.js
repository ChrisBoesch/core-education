/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */

(function() {
  'use strict';

  describe('scceStudents.services', function() {
    var $httpBackend, scope, $;

    beforeEach(module('scceStudents.services'));

    beforeEach(inject(function(_$httpBackend_, $rootScope, $window) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $ = $window.jQuery;
    }));

    describe('scceStudentsApi', function() {
      var studentsApi, studentsList = [{
          firstName: 'Alice',
          lastName: 'Smith',
          id: 'x1'
        }, {
          firstName: 'Bob',
          lastName: 'Taylor',
          id: 'x2'
        }];

      beforeEach(inject(function(scceStudentsApi) {
        studentsApi = scceStudentsApi;
      }));

      it('should query the server for the list of students', function() {
        var students;

        $httpBackend.expectGET('/api/v1/students').respond(
          JSON.stringify({students: studentsList, cursor: 'foo'})
        );

        studentsApi.all().then(function(_students) {
          students = _students;
        });

        $httpBackend.flush();
        expect(students.length).toBe(2);
        expect(students[0].id).toEqual(studentsList[0].id);
        expect(students[1].id).toEqual(studentsList[1].id);
        expect(students.cursor).toBe('foo');
      });

      it('should add new students', function() {
        var postData, student;

        $httpBackend.expectPOST('/api/v1/students').respond(function(meth, url, rawData) {
          postData = JSON.parse(rawData);
          return [200, JSON.stringify(studentsList[0])];
        });

        studentsApi.add(studentsList[0]).then(function(data) {
          student = data;
        });

        $httpBackend.flush();
        expect(postData).toEqual(studentsList[0]);
        expect(student.id).toBe('x1');
      });

      it('should update new students', function() {
        var postData;

        $httpBackend.expectPUT('/api/v1/students/x1').respond(function(meth, url, rawData) {
          postData = JSON.parse(rawData);
          return [200, ''];
        });

        studentsApi.edit('x1', {photo: 'http://example.com/photo'});

        $httpBackend.flush();
        expect(postData).toEqual({photo: 'http://example.com/photo'});
      });

    });


  });

})();