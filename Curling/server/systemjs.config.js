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
      // other libraries
      'cors': 'npm:cors',
      'ts-md5': 'npm:ts-md5',
      'mongoose':'npm:mongoose',
      // our app is within the out folder
      app: 'out/'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js',
      },
      'cors': {
        defaultExtension: 'js'
      },
      'ts-md5':{
        defaultExtension : 'js'
      },
      'mongoose':
      {
        defaultExtension : 'js'
      }
    }
  });
})(this);