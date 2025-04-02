# Setup instructions 
- npm i 
- run dockerize mysql with 'docker-compose up -d'
- npx sequelize db:migrate
- npx sequelize db:seed:all
- npm run start:dev