
<!-- ------------------------------------------------------------- -->
<!-- docker commands -->
<!-- ------------------------------------------------------------- -->

<!-- CONTAINERS -->

# list docker containers

docker ps -a

# Stop the container (if it is running):

docker stop <container_id_or_name>

# Remove the container:

docker container rm <container_id_or_name>

# Deleting Multiple Containers

docker container rm <container_id_or_name1> <container_id_or_name2>

# Removing All Stopped Containers

docker container prune

docker container attach container_ID

<!-- ------------------------------------------------------------- -->

<!-- IMAGES -->

# Dangling

Suppose you build an image from a Dockerfile, and then make some changes to the Dockerfile and rebuild the image. The new build might create new layers for the changes. The layers from the previous build that are no longer needed become dangling images.

# Cleaning Up Dangling Images

docker image prune

# Identifying Dangling Images

docker images -f "dangling=true"

<!-- BUILD -->

sudo docker image build --no-cache -t leadhwak-ec2:Latest .

<!-- PASS ENV -->

docker run -d -p 3000:5000 --name my-container --env-file .env my-image

sudo yum install docker

sudo systemctl status docker
sudo systemctl start docker

sudo docker --version
sudo docker images

