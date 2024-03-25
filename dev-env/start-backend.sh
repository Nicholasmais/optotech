docker stop $(docker ps --filter name=backend -q) 
docker rm $(docker ps --filter name=backend -q) 
docker rmi $(docker images --filter name=backend -q) 

docker stop $(docker ps --filter name=postgres -q)
docker rm $(docker ps --filter name=postgres -q) 
docker rmi $(docker images --filter name=postgres -q)

docker stop $(docker ps --filter name=mongo -q)
docker rm $(docker ps --filter name=mongo -q)
docker rmi $(docker images --filter name=mongo -q)

