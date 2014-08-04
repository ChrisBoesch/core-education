angular.module('scCoreEducation.templates', ['views/sccoreeducation/home.html', 'views/sccoreeducation/stafflist.html', 'views/sccoreeducation/studentlist.html', 'views/sccoreeducation/user/grid.html', 'views/sccoreeducation/user/login.html']);

angular.module("views/sccoreeducation/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/home.html",
    "<h1>Hello world</h1>");
}]);

angular.module("views/sccoreeducation/stafflist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/stafflist.html",
    "<h1>Staff list</h1>\n" +
    "\n" +
    "<scce-user-grid scce-users=\"staff\" scce-user-type=\"staff\"></scce-user-grid>\n" +
    "\n" +
    "");
}]);

angular.module("views/sccoreeducation/studentlist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/studentlist.html",
    "<h1>Student list</h1>\n" +
    "\n" +
    "<scce-user-grid scce-users=\"students\" scce-user-type=\"students\"></scce-user-grid>\n" +
    "");
}]);

angular.module("views/sccoreeducation/user/grid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/user/grid.html",
    "<table class=\"table table-striped\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th>First name</th>\n" +
    "      <th>Last name</th>\n" +
    "      <th>Photo</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"user in users track by user.id\">\n" +
    "      <td>{{user.name.givenName}}</td>\n" +
    "      <td>{{user.name.familyName}}</td>\n" +
    "      <td><img ng-src=\"{{user.image.url}}\"/></td>\n" +
    "    </tr>\n" +
    "    <tr ng-if=\"users.length == 0\">\n" +
    "      <td colspan=\"3\">No {{userType}}</td>\n" +
    "    </tr>\n" +
    "    <tr ng-if=\"users == null\">\n" +
    "      <td colspan=\"3\">Loading {{userType}}</td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>");
}]);

angular.module("views/sccoreeducation/user/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/user/login.html",
    "<ul class=\"nav navbar-nav navbar-right\">\n" +
    "  <li>\n" +
    "    <p class=\"navbar-text\" ng-if=\"user.loading\">Loading current user info...</p>\n" +
    "    <p class=\"navbar-text\" ng-if=\"user.info.name\">Signed in as {{user.info.displayName}}</p>\n" +
    "  </li>\n" +
    "  <li ng-if=\"user.info\">\n" +
    "    <a ng-href=\"{{user.info.loginUrl}}\" ng-if=\"!user.info.isLoggedIn &amp;&amp; user.info.loginUrl\">\n" +
    "      <i class=\"glyphicon glyphicon-off\"></i> login\n" +
    "    </a>\n" +
    "    <a ng-href=\"{{user.info.logoutUrl}}\" ng-if=\"user.info.isLoggedIn &amp;&amp; user.info.logoutUrl\">\n" +
    "      <i class=\"glyphicon glyphicon-off\"></i> logout\n" +
    "    </a>\n" +
    "  </li>\n" +
    "</ul>");
}]);
