#!/bin/bash
NEW_BUILD_NUMBER=$(git rev-parse --short=10 HEAD);

curl --location --request POST 'https://chat.googleapis.com/v1/spaces/AAAAyM2kdPg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=T-5E2JFtOk6E5H-vTIqLlo5k0DEOotu8e2JGOpjQT7k%3D' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "cards": [
      {
        "header": {
          "title": "Pretaa Health Admin Bot",
          "subtitle": "New changes deployed",
          "imageUrl": "https://img.icons8.com/ios-glyphs/344/link--v1.png",
          "imageStyle": "IMAGE"
        },
        "sections": [
          {
            "widgets": [
              {
                "keyValue": {
                  "topLabel": "Version",
                  "content": "'$NEW_BUILD_NUMBER'",
                  "contentMultiline": "false",
                  "icon": "CONFIRMATION_NUMBER_ICON",
                 "button": {
                    "textButton": {
                      "text": "View Code",
                      "onClick": {
                        "openLink": {
                          "url": "https://bitbucket.org/bitbucket_pretaa/health-admin/commits/'$NEW_BUILD_NUMBER'"
                        }
                      }
                    }
                  }
                }
              },
              {
                "keyValue": {
                  "content": "JIRA",
                  "contentMultiline": "false",
                  "icon": "TICKET",
                  "button": {
                    "textButton": {
                      "text": "Current Sprint",
                      "onClick": {
                        "openLink": {
                          "url": "https://pretaa.atlassian.net/jira/software/c/projects/PRTH/boards/19"
                        }
                      }
                    }
                  }
                }
              },
              {
                "keyValue": {
                  "content": "'$BITBUCKET_BRANCH' Build",
                  "contentMultiline": "false",
                  "icon": "TICKET",
                  "button": {
                    "textButton": {
                      "text": "Netlify link",
                      "onClick": {
                        "openLink": {
                          "url": "https://pretaa-health-staging.netlify.app"
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }'
