#!/bin/bash

echo $1 $2
echo "PACKAGE VERSION: $(jq -r .version package.json)"

BUILD=${2:0:7};
echo "$BUILD $2"

echo "$(jq --arg key $1 '.[$key]+=1' src/version.json )" > src/version.json
if [ "$1" = "major" ] || [ "$1" = "minor" ] || [ "$1" = "patch" ]
then
   echo "Updating semantic key: $1" 1>&2
else
   echo "Expected semantic version key. Found: $1" 1>&2
   exit 64
fi

echo "CHECK START: $(jq . src/version.json )"

if [ $1 = 'major' ]
then
   echo "$(jq '.minor=0 | .patch=0' src/version.json )" > src/version.json
fi
if [ $1 = 'minor' ]
then
   echo "$(jq '.patch=0' src/version.json )" > src/version.json
fi

echo "CHECK END: $(jq . src/version.json )"

# debug
echo "VERSION START: $(jq .version src/version.json )"

echo "$(jq -c '.version=(.major|tostring)+"."+(.minor|tostring)+"."+(.patch|tostring)' src/version.json)" > src/version.json

echo "VERSION END: $(jq .version src/version.json )"

echo "BUILD START: $(jq .build src/version.json )"

echo "$(jq -c --arg buildNumber ${2:0:7} '.build=$buildNumber' src/version.json)" > src/version.json

echo "BUILD END: $(jq .build src/version.json )"

echo "VERSION START 2: $(jq .version src/version.json )"
VERSION="$(jq -r .version src/version.json)"
echo "VERSION END 2: $(jq .version src/version.json )"

echo "$(jq --arg version $VERSION '.version=$version' package.json)" > package.json

echo "PACKAGE VERSION: $(jq -r .version package.json)"

echo $(git --version)
git add .
git commit -am "ci: Version bump" --author="version Bump <ankit@itobuz.com> --no-verify"
git tag v$VERSION
git push --all
