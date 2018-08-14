FROM ubuntu:16.04
RUN apt-get update && apt-get -y install locales
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8


RUN apt-get update && apt-get -y upgrade

RUN apt-get install npm -y
RUN npm install -g npm@latest

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

WORKDIR /webapp/frontEnd
COPY package.json package.json
RUN npm install
RUN npm install npm-run-all
