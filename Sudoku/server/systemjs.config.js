/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      app: 'out',
      // other libraries
      'chai': 'npm:chai/chai.js',
      'ts-md5': 'npm:ts-md5',
      'socket.io': 'npm:socket.io/lib/socket'
      
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      "controllers": {
        defaultExtension: "js"
      },
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      "ts-md5": {
        defaultExtension: 'js'
      },
      "socket.io": {
        defaultExtension: 'js'
      }
    }
  });
})(this);