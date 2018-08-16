#FROM tutum/nginx
FROM nginx:latest
#RUN rm /etc/nginx/sites-enabled/default
ADD sites-enabled/ /etc/nginx/sites-enabled
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir /acme-challenge

