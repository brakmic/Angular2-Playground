'use strict';
var Hapi                 = require('hapi');
var path                 = require('path');
var server               = new Hapi.Server();
var Inert                = require('inert');

server.connection({ port: 8080 });

server.register(Inert, function () {});

server.route({
      path: '/dist/app/{filename*}',
      method: 'GET',
      handler: {
        directory: {
            path: 'dist/app',
            listing: false
        }
    }
});

server.route({
      path: '/styles/{filename*}',
      method: 'GET',
      handler: {
        directory: {
            path: 'dist/styles',
            listing: false
        }
    }
});

server.route({
      path: '/templates/{filename*}',
      method: 'GET',
      handler: {
        directory: {
            path: 'dist/app/templates',
            listing: false
        }
    }
});

server.route({
      path: '/node_modules/{p*}',
      method: 'GET',
      handler: {
        directory: {
            path: 'node_modules',
            listing: false
        }
    }
});

server.route({
      path: '/libs/{filename*}',
      method: 'GET',
      handler: {
        directory: {
            path: 'dist/libs',
            listing: false
        }
    }
});

server.route({
      path: '/system.config.js',
      method: 'GET',
      handler: function(request, reply) {
        reply.file('system.config.js');
      }
});
server.route({
      path: '/{p*}',
      method: 'GET',
      handler: {
        directory: {
            path: 'dist',
            listing: false
        }
    }
});

/* start server */
module.exports = (function(){
  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
}());
