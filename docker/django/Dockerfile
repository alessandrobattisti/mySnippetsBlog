FROM ubuntu:16.04
RUN apt-get update && apt-get -y install locales
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8


RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y python3 python3-pip
RUN apt-get install python-psycopg2 libpq-dev python3-dev -y

# Install Python dependencies
RUN pip3 install --upgrade pip

COPY requirements.txt /

RUN pip3 install -r requirements.txt

# Port to expose
EXPOSE 8000

WORKDIR /webapp/backEnd

# Entrypoint
COPY rundjango.sh /rundjango.sh
RUN chmod 755 /rundjango.sh
#ENTRYPOINT ["/rundjango.sh"]
