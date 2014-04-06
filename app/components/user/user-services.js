(function() {
  'use strict';

  angular.module('scceUser.services', ['scCoreEducation.services']).

  /**
   * scceCurrentUserApi - api to access user info.
   *
   * scceCurrentUserApi.get(returnUrl)  Return the user name, id and the
   * the logout url if the user logged in. Return the login url if the
   * user logged off.
   *
   * Note that it returns a promise that resole in either case. If the promise
   * fails, there was either a problem with the optional return url, or
   * there's an unexpected issue with the backend.
   *
   */
  factory('scceCurrentUserApi', ['$location', '$q', 'scceApi',
    function($location, $q, scceApi) {
      return {
        get: function(returnUrl) {
          var params = {
            returnUrl: returnUrl || $location.absUrl()
          };

          return scceApi.one('user').get(params).then(function(data) {
            return data;
          }).catch(function(resp) {
            if (resp.status === 401) {
              return resp.data;
            } else {
              return $q.reject(resp);
            }
          });
        }
      };
    }
  ]);

})();