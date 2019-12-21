let config = '';

const makeTSConfig = function () {

    config = `{
        "compilerOptions": {
          // "watch": true,
          // "strict": true,
          "forceConsistentCasingInFileNames": true,
          "noUnusedLocals": false,
          "noUnusedParameters": false,
          "alwaysStrict": false,
      
          "strict": false,
          "pretty": true,
          "module": "commonjs",
          "lib": [
            "es2016",
            "dom"
          ],
          "target": "es5",
          "sourceMap": true,
          "outDir": "build",
          "baseUrl": ".",
          "paths": {
            "*": [
              "node_modules/*",
              "src/types/*"
            ]
          },
          "experimentalDecorators": true,
          "emitDecoratorMetadata": true
        },
        "compileOnSave": true,
        "include": [
          "src/**/*"
        ],
        "exclude": [
          "node_modules"
        ]
      }
  `;

    return config;
};

module.exports = makeTSConfig;
