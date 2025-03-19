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
podman create --name mongodb \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=mongo \
-p 27017:27017 \
-v mongo:/data/db \
docker.io/library/postgres
#########
podman start mongodb

# Executar migrations e seeds após essas etapas