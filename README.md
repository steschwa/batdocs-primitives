# @batdocs/primitives

## Release process

1. Version each package based on recent changes (use one of the below commands):
    * `yarn version:patch`
    * `yarn version:minor`
    * `yarn version:major`

2. Create a release commit **release: bump version to X.X.X**

3. Build new versions of the packages: `yarn build`

4. Publish new packages to NPM: `yarn publish`

