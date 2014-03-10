'use strict';

<%= scriptModuleName %>.filter('<%= cameledName %>', function () {
    return function (input) {
      return '<%= cameledName %> filter: ' + input;
    };
  });
