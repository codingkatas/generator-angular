'use strict';

<%= scriptModuleName %>.config(function ($provide) {
        $provide.decorator('<%= cameledName %>', function ($delegate) {
            // decorate the $delegate
            return $delegate;
        });
    });
