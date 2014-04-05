(function() {
  'use strict';

  function echo(m, u, body) {
    var data = JSON.parse(body);
    return [200, data];
  }


  angular.module(
    'scCoreEducationMocked', ['scCoreEducation', 'ngMockE2E', 'scCoreEducationMocked.fixtures']
  ).


  run(function($httpBackend, SC_CORE_EDUCATION_FIXTURES){
    var fix = SC_CORE_EDUCATION_FIXTURES,
      students = fix.data.students;

    $httpBackend.whenGET(fix.urls.login).respond(fix.data.user);

    $httpBackend.whenGET(fix.urls.students).respond({
      students: Object.keys(students).map(function(id) {
        return students[id];
      }),
      cursor: null
    });
    $httpBackend.whenPOST(fix.urls.students).respond(echo);


    $httpBackend.whenGET(fix.urls.staff).respond({
      students: [],
      cursor: null
    });
    $httpBackend.whenPOST(fix.urls.staff).respond(echo);

    $httpBackend.whenGET(/.*/).passThrough();

  })

  ;

})();