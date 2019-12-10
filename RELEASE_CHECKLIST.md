## **Release Checklist**

### Pre-release Checklist

-  [ ] test `dev` branch after all merges have been made

### Release Checklist

-  [ ] create `release` branch following the naming scheme: `release-vX.X.X` \*

-  [ ] final release related changes:

   -  [ ] update `CHANGELOG.md` \*\*
   -  [ ] update `package.json` version property
   -  [ ] update `manifest.json` version property

-  [ ] commit changes to `release` branch
-  [ ] push finalized `release` branch to github
-  [ ] merge `release` branch into `master` via github PR using `--no-ff` (githubs default merge method)

### Post-release Checklist

-  [ ] pull the updated `master` locally
-  [ ] create tag from master follow the naming scheme: `vX.X.X` and push to github.
-  [ ] merge `release` branch back into the `dev` branch
-  [ ] delete `release` branch
-  [ ] build master to `/dist`
-  [ ] create a release on github
   -  [ ] insert corresponding changes from `CHANGELOG.md`
   -  [ ] add packaged source via `web-ext` using `web-ext build` or `web-ext build --no-config-discovery --verbose --source-dir=dist --artifacts-dir=zips --overwrite-dest` \*\*\*

> \* follow [git-flow](https://nvie.com/posts/a-successful-git-branching-model/#release-branches) release branching strategy and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

> \*\* The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

> \*\*\* [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext) documentation
