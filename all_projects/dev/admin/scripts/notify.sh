#!/bin/bash
NEW_BUILD_NUMBER=$(git rev-parse --short=10 HEAD);

curl --location --request POST 'https://chat.googleapis.com/v1/spaces/AAAAyM2kdPg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=yRLH5r7Y4Jr2G6tf4ckwlkIFS1V77E1yEFMGlQPCsdw%3D' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "cards": [
      {
        "header": {
          "title": "Admin Bot",
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
                          "url": "https://bitbucket.org/bitbucket_pretaa/admin/commits/'$NEW_BUILD_NUMBER'"
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
                          "url": "https://pretaa.atlassian.net/jira/software/c/projects/PRTA/boards/11"
                        }
                      }
                    }
                  }
                }
              },
              {
                "keyValue": {
                  "content": "Dev Build",
                  "contentMultiline": "false",
                  "icon": "TICKET",
                  "button": {
                    "textButton": {
                      "text": "Netlify link",
                      "onClick": {
                        "openLink": {
                          "url": "https://pretaa-staging.netlify.app"
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
