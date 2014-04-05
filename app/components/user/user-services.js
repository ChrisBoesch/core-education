(function() {
  'use strict';

  angular.module('scceUser.services', ['scCoreEducation.services']).

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