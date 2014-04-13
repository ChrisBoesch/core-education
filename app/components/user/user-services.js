(function() {
  'use strict';
  var api;

  angular.module('scceUser.services', ['scCoreEducation.services', 'scceUser.config']).

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
   * TODO: handle lose of authentication.
   *
   */
  factory('scceCurrentUserApi', ['$location', '$q', 'scceApi', 'scceUserConfig',
    function($location, $q, scceApi, scceUserConfig) {
      api = {
        info: null,
        loading: null,

        _get: function(returnUrl) {
          var params = {
            returnUrl: (
              returnUrl ||
              scceUserConfig.defaultReturnUrl ||
              $location.absUrl()
            )
          };

          return scceApi.one('user').get(params).then(function(data) {
            return data;
          });
        },

        auth: function(returnUrl) {

          if (api.info) {
            return $q.when(api.info);
          }

          if (api.loading) {
            return api.loading;
          }


          api.loading = api._get(returnUrl).then(function(user) {
            api.info = user;
            return user;
          })['finally'](function() {
            api.loading = null;
          });

          return api.loading;
        },

        reset: function(loginUrl, msg) {
          var currentLoginUrl = api.info && api.info.loginUrl || null;

          loginUrl = loginUrl || currentLoginUrl;
          if (loginUrl) {
            api.info = {loginUrl: loginUrl, error: msg};
          } else {
            api.info = null;
          }
        }
      };

      return api;
    }
  ]).

  /**
   * Intercept http response error to reset scceCurrentUserApi on http
   * 401 response.
   *
   */
  factory('scceCurrentHttpInterceptor', ['$q', '$location',
    function($q, $location) {
      var httpPattern = /https?:\/\//,
        thisDomainPattern = new RegExp(
          'https?://' + $location.host().replace('.', '\\.')
        );

      function isSameDomain(url) {
        return !httpPattern.test(url) || thisDomainPattern.test(url);
      }

      return {
        responseError: function(resp) {
          if (
            resp.status === 401 &&
            isSameDomain(resp.config.url)
          ) {
            api.reset(resp.data.loginUrl, resp.data.error);
          }

          return $q.reject(resp);
        }
      };
    }
  ]).

  config(['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('scceCurrentHttpInterceptor');
    }
  ])

  ;

})();