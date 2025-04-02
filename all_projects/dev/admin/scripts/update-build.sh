#!/bin/bash
NEW_BUILD_NUMBER=$(git rev-parse --short=10 HEAD);
echo "$(jq -c --arg NEW_BUILD_NUMBER ${NEW_BUILD_NUMBER} '.build=$NEW_BUILD_NUMBER' src/version.json)" > src/version.json
