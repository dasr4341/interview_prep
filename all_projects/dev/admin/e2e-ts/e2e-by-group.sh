rm -rf ~/Library/Application\ Support/Cypress/cy 
rm -rf e2e-ts/cypress/videos
rm -rf e2e-ts/cypress/screenshots
npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser chrome 

# ## Users
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser chrome --spec 'cypress/e2e/user/login/**/*' 

# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/user/companies/**/*' 
# # create-edit-delete-note.spec.js: Not Stable

# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser chrome --spec 'cypress/e2e/user/events/**/*' 
# # Failed
# # event-notes.spec.js
# # search-events.spec.js

# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/user/feedback/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/user/settings/**/*' 

# ## Super Admin
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/super-admin/auth/**/*' 

# ## Admin
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/companies/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/data-object/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/groups/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/roleManagement/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/templates/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/useCases/**/*' 
# npm run cypress -- run  --env --config-file=cypress.ci.config.js envFile=cypress.env.json --browser firefox --spec 'cypress/e2e/admin/users/**/*' 