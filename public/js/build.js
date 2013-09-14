({
    //baseUrl: "../../",
    paths:{
        'requireLib': 'lib/require',
        'domready': 'lib/domready',
				'jquery': 'lib/jquery-min',
        'underscore': 'lib/underscore-min',
        'backbone': 'lib/backbone-min',
        'backbone-localstorage': 'lib/backbone.localstorage'
    },
    include: 'requireLib',
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
    },
    name: "app.js",
    out: "app-built.js",
    preserveLicenseComments: false
})
