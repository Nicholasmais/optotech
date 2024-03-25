sudo docker stop $(docker ps -q) | true
sudo docker rm -f $(docker ps --filter status=exited -q) | true
sudo docker rmi -f $(docker images -q) | true

sudo docker-compose up -d