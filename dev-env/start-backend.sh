sudo docker stop $(docker ps --filter name=backend -q) 
sudo docker rm $(docker ps --filter name=backend -q) 
sudo docker rmi $(docker images --filter name=backend -q) 

sudo docker stop $(docker ps --filter name=postgres -q)
sudo docker rm $(docker ps --filter name=postgres -q) 
sudo docker rmi $(docker images --filter name=postgres -q)

sudo docker stop $(docker ps --filter name=mongo -q)
sudo docker rm $(docker ps --filter name=mongo -q)
sudo docker rmi $(docker images --filter name=mongo -q)

sudo docker-compose -f backend-compose.yaml up -d
