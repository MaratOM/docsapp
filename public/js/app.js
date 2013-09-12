require.config({
		baseUrl: "../js",
    paths:{
				'jquery': 'lib/jquery-min',
        'underscore': 'lib/underscore-min',
        'backbone': 'lib/backbone-min',
        'backbone-localstorage': 'lib/backbone.localstorage'
    },
  shim: {
        'underscore': {
            exports: '_'
        },
        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"  
        },
        "backbone-localstorage": {
            deps: ["underscore", "jquery", "backbone"],
            exports: "bl"  
        }
  }
});

require(["router"], function(router) {
    new router();
    Backbone.history.start();
});	
