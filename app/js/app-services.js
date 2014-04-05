(function() {
  'use strict';

  var interceptor = function(data, operation, what) {
    var resp;

    if (operation === 'getList') {
      resp = data[what] ? data[what] : [];
      resp.cursor = data.cursor ? data.cursor : null;
    } else {
      resp = data;
    }
    return resp;
  };

  angular.module('scCoreEducation.services', ['restangular', 'scCoreEducation.config']).

  service('scceApi', ['Restangular', 'SCCE_API_BASE',
    function(Restangular, SCCE_API_BASE) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(SCCE_API_BASE);
        RestangularConfigurer.addResponseInterceptor(interceptor);
      });
    }
  ])

  ;
})();