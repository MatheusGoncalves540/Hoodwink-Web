#################################################################
## RODAR DENTRO DO TERMINAL DO WSL CASO ESTEJA NO WINDOWS!     ##
## NÃO EXECUTE ESSE ARQUIVO, APENAS COPIE E RODE OS COMANDOS!  ##
#################################################################

mkdir ./postgres:
podman create --name postgresdb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=hoodwink \
  -p 5432:5432 \
  -v ./postgres:/data/db \
  docker.io/library/postgres
podman start postgresdb

podman network create redis-network
echo 'requirepass redis
appendonly yes
appendfsync everysec
loadmodule /opt/redis-stack/lib/redisearch.so MAXSEARCHRESULTS 10000 MAXAGGREGATERESULTS 10000
loadmodule /opt/redis-stack/lib/rediscompat.so
loadmodule /opt/redis-stack/lib/redisbloom.so
loadmodule /opt/redis-stack/lib/redistimeseries.so
loadmodule /opt/redis-stack/lib/redisgears.so v8-plugin-path /opt/redis-stack/lib/libredisgears_v8_plugin.so
loadmodule /opt/redis-stack/lib/rejson.so' > redis.conf
podman create --name redisdb \
  -p 6379:6379 \
  --network redis-network \
  -v $(pwd)/redis.conf:/etc/redis.conf:ro \
  docker.io/redis/redis-stack-server:latest \
  redis-server /etc/redis.conf
podman start redisdb
podman run --name redis-commander \
  --network redis-network \
  -d -p 8081:8081 \
  -e REDIS_HOST=redisdb \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=redis \
  docker.io/rediscommander/redis-commander

#http://localhost:8081 #acessar redis-commander

# Executar migrations e seeds após essas etapas