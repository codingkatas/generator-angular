'use strict';

var <%= scriptModuleName %> = angular.module('<%= appname %>', [<%= angularModules %>]);

<% if (ngRoute) { %>
<%= scriptModuleName %>.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })<% } %>;
