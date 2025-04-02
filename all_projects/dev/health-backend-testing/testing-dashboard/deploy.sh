# echo "Backend deployment in progress"
cd backend 
npm run build 
ssh itobuz-development 'rm -rf /home/ubuntu/pretaa-health-testing-dashboard/backend/dist'
scp -r dist itobuz-development:/home/ubuntu/pretaa-health-testing-dashboard/backend/
ssh itobuz-development 'ls -la /home/ubuntu/pretaa-health-testing-dashboard/backend/dist/'
scp package.json itobuz-development:/home/ubuntu/pretaa-health-testing-dashboard/backend
# npm i - needed inside backend dir
ssh itobuz-development 'source ~/.nvm/nvm.sh && cd /home/ubuntu/pretaa-health-testing-dashboard/backend/dist/ &&  pm2 stop pretaa-health-testing-dashboard-backend && pm2 delete pretaa-health-testing-dashboard-backend && pm2 start npm --name "pretaa-health-testing-dashboard-backend" -- run serve && pm2 ls'

scp .env itobuz-development:/home/ubuntu/pretaa-health-testing-dashboard/backend/.env
cd ..
echo "Backend deployment Success"


echo "Frontend deployment in progress"
cd frontend 
pwd
npm run build 
ssh itobuz-development 'rm -rf /var/www/html/pretaa-health-testing-dashboard/**/*.*'
scp -r build/* itobuz-development:/var/www/html/pretaa-health-testing-dashboard
cd ..
scp -r .htaccess itobuz-development:/var/www/html/pretaa-health-testing-dashboard
ssh itobuz-development 'ls -la /var/www/html/pretaa-health-testing-dashboard'

echo "Frontend deployment Success"

