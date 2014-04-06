angular.module('scCoreEducation.templates', ['views/sccoreeducation/home.html', 'views/sccoreeducation/stafflist.html', 'views/sccoreeducation/studentlist.html', 'views/sccoreeducation/user/form.html', 'views/sccoreeducation/user/grid.html']);

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
    "<scce-user-form scce-user-type=\"staff\" scce-user-handler=\"submitNewStaff\"></scce-user-form>\n" +
    "");
}]);

angular.module("views/sccoreeducation/studentlist.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/studentlist.html",
    "<h1>Student list</h1>\n" +
    "\n" +
    "<scce-user-grid scce-users=\"students\" scce-user-type=\"students\"></scce-user-grid>\n" +
    "\n" +
    "<scce-user-form scce-user-type=\"student\" scce-user-handler=\"submitNewStudent\"></scce-user-form>\n" +
    "");
}]);

angular.module("views/sccoreeducation/user/form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/user/form.html",
    "<form name=\"newUserForm\" class=\"form-horizontal\">\n" +
    "  <fieldset>\n" +
    "    <legend>New {{userType}}</legend>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"user_id\" class=\"col-sm-2 control-label\">{{userType}} ID</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input type=\"text\"\n" +
    "          ng-model=\"newUser.id\"\n" +
    "          id=\"user_id\"\n" +
    "          name=\"userId\"\n" +
    "          required=\"true\"\n" +
    "          ng-attr-placeholder=\"{{userType}} ID\"\n" +
    "          class=\"form-control\"\n" +
    "        />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"user_firstname\" class=\"col-sm-2 control-label\">First name</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input type=\"text\"\n" +
    "          ng-model=\"newUser.firstName\"\n" +
    "          id=\"user_firstname\"\n" +
    "          name=\"userFirstName\"\n" +
    "          required=\"true\"\n" +
    "          ng-attr-placeholder=\"{{userType}} first name\"\n" +
    "          class=\"form-control\"\n" +
    "        />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"user_lastname\" class=\"col-sm-2 control-label\">Last name</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input type=\"text\"\n" +
    "          ng-model=\"newUser.lastName\"\n" +
    "          id=\"user_lastname\"\n" +
    "          name=\"userLastName\"\n" +
    "          required=\"true\"\n" +
    "          ng-attr-placeholder=\"{{userType}} last name\"\n" +
    "          class=\"form-control\"\n" +
    "        />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"user_email\" class=\"col-sm-2 control-label\">Email</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input type=\"email\"\n" +
    "          ng-model=\"newUser.email\"\n" +
    "          id=\"user_email\"\n" +
    "          name=\"userEmail\"\n" +
    "          required=\"true\"\n" +
    "          ng-attr-placeholder=\"{{userType}} email\"\n" +
    "          class=\"form-control\"\n" +
    "        />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"user_photo\" class=\"col-sm-2 control-label\">Photo url</label>\n" +
    "      <div class=\"col-sm-8\">\n" +
    "        <input type=\"url\"\n" +
    "          ng-model=\"newUser.photo\"\n" +
    "          id=\"user_photo\"\n" +
    "          name=\"userPhoto\"\n" +
    "          ng-attr-placeholder=\"{{userType}} photo url\"\n" +
    "          class=\"form-control\"\n" +
    "        />\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-8\">\n" +
    "        <button type=\"submit\"\n" +
    "          id=\"submitButton\"\n" +
    "          ng-click=\"submitNewUser(newUser)\"\n" +
    "          ng-disabled=\"!newUserForm.$valid || disableForm\"\n" +
    "          class=\"btn btn-default\"\n" +
    "        >Add new {{userType}}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </fieldset>\n" +
    "</form>");
}]);

angular.module("views/sccoreeducation/user/grid.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/sccoreeducation/user/grid.html",
    "<table class=\"table table-striped\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th>id</th>\n" +
    "      <th>First name</th>\n" +
    "      <th>Last name</th>\n" +
    "      <th>Photo</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"user in users track by user.id\">\n" +
    "      <td>{{user.id}}</td>\n" +
    "      <td>{{user.firstName}}</td>\n" +
    "      <td>{{user.lastName}}</td>\n" +
    "      <td>{{user.photo}}</td>\n" +
    "    </tr>\n" +
    "    <tr ng-if=\"users.length == 0\">\n" +
    "      <td colspan=\"4\">No {{userType}}</td>\n" +
    "    </tr>\n" +
    "    <tr ng-if=\"users == null\">\n" +
    "      <td colspan=\"4\">Loading {{userType}}</td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>");
}]);
