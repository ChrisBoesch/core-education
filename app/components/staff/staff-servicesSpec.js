/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */

(function() {
  'use strict';

  describe('scceStaff.services', function() {
    var $httpBackend, scope, $, fix;

    beforeEach(module('scceStaff.services', 'scCoreEducationMocked.fixtures'));

    beforeEach(inject(function(_$httpBackend_, $rootScope, $window, SC_CORE_EDUCATION_FIXTURES) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $ = $window.jQuery;
      fix = SC_CORE_EDUCATION_FIXTURES;
    }));

    describe('scceStaffApi', function() {
      var staffApi, staffList = [];

      beforeEach(inject(function(scceStaffApi) {
        staffApi = scceStaffApi;
        staffList = Object.keys(fix.data.userList).filter(function(id) {
          return fix.data.userList[id].isStaff;
        }).map(function(id) {
          return fix.data.userList[id];
        });
      }));

      it('should query the server for the list of staff', function() {
        var staff;

        $httpBackend.expectGET('/api/v1/staff').respond(
          JSON.stringify({
            type: 'users',
            users: staffList,
            cursor: 'foo'
          })
        );

        staffApi.all().then(function(_staff) {
          staff = _staff;
        });

        $httpBackend.flush();
        expect(staff.length).toBe(staffList.length);
        expect(staff[0].id).toEqual(staffList[0].id);
        expect(staff.cursor).toBe('foo');
      });

      it('should add new staff', function() {
        $httpBackend.expectPUT('/api/v1/staff/12345').respond({});
        staffApi.add('12345').then();
        $httpBackend.flush();
      });

    });


  });

})();