# core-education

Common education components:

- login service and directives.

TODO: add a notification service.


## usage

Install with bower
```
bower install git@github.com:ChrisBoesch/core-education.git --save
```

Add the script and its dependencies to your page:
```
<script src="path/to/bower_components/jquery/dist/jquery.js"></script>
<script src="path/to/bower_components/lodash/dist/lodash.js"></script>
<script src="path/to/bower_components/angular/angular.js"></script>
<script src="path/to/bower_components/angular-route/angular-route.js"></script>
<script src="path/to/bower_components/restangular/dist/restangular.js"></script>
<script src="path/to/bower_components/core-education/app-build/js/app.js"></script>

<!-- Add template module if you need to use the directive of controller -->
<script src="path/to/bower_components/core-education/app-build/js/app-templates.js"></script>
```

### User api

#### scceCurrentUserApi

Module: `scceUser.services`

`scceCurrentUserApi.auth` returns a promise that resolves to an object
with either a logoutUrl or loginUrl properties depending if the user
is logged in or not.

It also returns [additional info](http://development.nextucloud.appspot.com/swagger/#!/user/isloggedIn_get_0)
if the user is logged in.

```
(function() {
  'use strict';

  angular.module('myApp', ['scceUser.services']).

  controller('MyCtrl', function($scope, scceCurrentUserApi) {
    $scope.user = scceCurrentUserApi;
    // $scope.user.info == null (no info available)
    scceCurrentUserApi.auth().then(function(user){
      // log in/out infos are available.
      // $scope.user.info === user
      if (user.name) {
        return queryMoreService();
      } else {
        alert('logging 1st please')
      }
    });
  });

})();
```

In the template, you


## Development

### setup

Fork [Upstream](https://github.com/ChrisBoesch/core-education) and clone it:
```
git clone git@github.com:you-user-name/core-education.git
cd core-education/
git remote add upstream git@github.com:ChrisBoesch/core-education.git
```

install dependencies
```
npm install -g grunt-cli
npm install
```


### build

To run the development server:
```
grunt dev
```

To run the tests continously:
```
grunt autotest
```
