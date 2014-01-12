'use strict';

var <%= scriptAppName %> = angular.module('<%= scriptAppName %>', [<%= angularModules %>]);

<% if (ngRoute) { %>
<%= scriptAppName %>.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })<% } %>;
