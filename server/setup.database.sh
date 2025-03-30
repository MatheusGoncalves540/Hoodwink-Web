podman create --name postgresdb \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=hoodwink \
-p 5432:5432 \
-v ./postgres:/data/db \
docker.io/library/postgres
#########
podman start postgres
#########

#########
podman network create redis-network
#########
podman create --name redisdb \
  -p 6379:6379 \
  -e REDIS_PASSWORD=redis \
  --network redis-network \
  docker.io/library/redis
#########
podman start redisdb
#########
podman run --name redis-commander \
  --network redis-network \
  -d -p 8081:8081 \
  -e REDIS_HOST=redisdb \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=redis \
  docker.io/rediscommander/redis-commander
#########
http://localhost:8081 #acessar redis-commander
# Executar migrations e seeds após essas etapas