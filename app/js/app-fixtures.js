/* jshint bitwise: false*/

(function() {
  'use strict';

  angular.module('scCoreEducationMocked.fixtures', []).

  constant('SC_CORE_EDUCATION_FIXTURES', {
    urls: {
      login: /\/api\/v1\/user/,
      students: '/api/v1/students',
      staff: '/api/v1/staff'
    },
    data: {
      user: {
        isAdmin: true,
        isStaff: false,
        logoutUrl: '/logout',
        isStudent: false,
        name: 'test@example.com'
      },
      loginError: {
        loginUrl: '/login',
        error: 'You are not logged in.'
      },
      students: {
        x1: {
          'firstName': 'Alice',
          'lastName': 'Smith',
          'id': 'x1'
        },
        x2: {
          'firstName': 'Bob',
          'lastName': 'Taylor',
          'id': 'x2'
        }
      }
    }
  })

  ;

})();