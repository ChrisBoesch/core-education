/* jshint camelcase: false*/
/* global describe, beforeEach, it, inject, expect */

(function() {
  'use strict';

  describe('scceStaff.services', function() {
    var $httpBackend, scope, $;

    beforeEach(module('scceStaff.services'));

    beforeEach(inject(function(_$httpBackend_, $rootScope, $window) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      $ = $window.jQuery;
    }));

    describe('scceStaffApi', function() {
      var staffApi, staffList = [{
          firstName: 'Alice',
          lastName: 'Smith',
          id: 'x1'
        }, {
          firstName: 'Bob',
          lastName: 'Taylor',
          id: 'x2'
        }];

      beforeEach(inject(function(scceStaffApi) {
        staffApi = scceStaffApi;
      }));

      it('should query the server for the list of staff', function() {
        var staff;

        $httpBackend.expectGET('/api/v1/staff').respond(
          JSON.stringify({staff: staffList, cursor: 'foo'})
        );

        staffApi.all().then(function(_staff) {
          staff = _staff;
        });

        $httpBackend.flush();
        expect(staff.length).toBe(2);
        expect(staff[0].id).toEqual(staffList[0].id);
        expect(staff[1].id).toEqual(staffList[1].id);
        expect(staff.cursor).toBe('foo');
      });

      it('should add new staff', function() {
        var postData, member;

        $httpBackend.expectPOST('/api/v1/staff').respond(function(meth, url, rawData) {
          postData = JSON.parse(rawData);
          return [200, JSON.stringify(staffList[0])];
        });

        staffApi.add(staffList[0]).then(function(data) {
          member = data;
        });

        $httpBackend.flush();
        expect(postData).toEqual(staffList[0]);
        expect(member.id).toBe('x1');
      });

      it('should update new staff', function() {
        var postData;

        $httpBackend.expectPUT('/api/v1/staff/x1').respond(function(meth, url, rawData) {
          postData = JSON.parse(rawData);
          return [200, ''];
        });

        staffApi.edit('x1', {photo: 'http://example.com/photo'});

        $httpBackend.flush();
        expect(postData).toEqual({photo: 'http://example.com/photo'});
      });

    });


  });

})();