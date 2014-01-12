'use strict';

<%= scriptAppName %>.filter('<%= cameledName %>', function () {
    return function (input) {
      return '<%= cameledName %> filter: ' + input;
    };
  });
