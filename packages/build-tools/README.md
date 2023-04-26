# Build Tools

This package contains build scripts for building bundled lambda handlers. Each
consumer package with lambda entrypoint need to configure a `lambda-build.json`
in the root of the package with configuration to define their entrypoints.

```json
{
  "handlers": [
    {
      "entrypoint": "./src/handlers/lambda-a.ts"
    },
    {
      "entrypoint": "./src/handlers/lambda-b.ts"
    }
  ]
}
```

The `yarn build-tools:build-lambdas --bundle` command could be called from the
lambda's package to build the zip bundle.

Output:

```txt
Created bundle packages/lambda/dist/lambda-a.js.zip
Created bundle packages/lambda/dist/lambda-b.js.zip
```
