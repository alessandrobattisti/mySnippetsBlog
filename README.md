# My SnippetBlog

## BUILD WITH DOCKER-COMPOSE

### INSTALL DOCKER AND DOCKER-COMPOSE
Install docker and docker-compose on your pc.

For ubuntu 16.04 you can follow these steps:
**Docker**

```
sudo apt-get update
```

```
sudo apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
```

```
sudo apt-key adv \
           --keyserver hkp://ha.pool.sks-keyservers.net:80 \
           --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
```

```
echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" | sudo tee /etc/apt/sources.list.d/docker.list
```

```
sudo apt-get update
```

```
apt-cache policy docker-engine
```

```
sudo apt-get install docker-engine
```

**Docker-Compose**

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```
sudo chmod +x /usr/local/bin/docker-compose
```

**Docker without sudo**

Add the docker group if it doesn't already exist:

```
sudo groupadd docker
```

Add the connected user "${USER}" to the docker group:
```
sudo usermod -a -G docker $USER
```

Log out of your account and log back in (if in doubt, reboot!):

Restart the Docker daemon:

```
sudo service docker restart
```

## BEFORE BUILD
Change `g_recaptcha` in `frontEnd/src/components/token.js` with your google
recaptcha public key or let it as is to use the testing key.

Change environment variables in `/docker/.env`

If you change db name you should change it in `docker/postgres/docker-entrypoint-initdb.d/init.sql` too.

You can leave RECAPTCHA_SECRET as is to use testing api key.

Change `server_name` in `/docker/nginx/sites-enabled/webapp.org`

### BUILD

`cd` in `docker` folder

```
docker-compose build
docker-compose up -d
docker-compose restart
```

```
docker exec -it docker_web_1 bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py makemigrations snippets_blog
python3 manage.py migrate
python3 manage.py createsuperuser
```

```
docker-compose restart
```
