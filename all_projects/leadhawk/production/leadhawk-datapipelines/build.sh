# sudo docker image build --no-cache -t leadhwak-ec2:Latest .
# sudo docker container stop leadhwak-ec2-container
# sudo docker container prune
# sudo docker run -p 3000:5000 --env-file .env --restart unless-stopped --name leadhwak-ec2-container leadhwak-ec2:Latest 
# docker logs leadhwak-ec2-container
# ---------------------- to build docker image and run it ^^^^^ ------------------

sudo docker container prune
sudo docker-compose up

# look how to pass arg to a bash file ?

#!/usr/bin/bash 
# if [[ $1 == 'prod' ]] 
# then 
#     echo $1 ' :: Production build in progress ...' 
#     sudo docker container prune
#     sudo NODE_ENV=production docker-compose up
# elif [[ $1 == 'dev' ]] 
# then 
#     echo $1 ' :: Development build in progress ...' 
#     sudo docker container prune
#     sudo NODE_ENV=dev  docker-compose up
# else 
#     echo $1 ' :: Faild to build' 
# fi 
