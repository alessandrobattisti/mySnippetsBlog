Get certificate

```
sudo docker run -it --rm \
-v certs:/etc/letsencrypt \
-v certs-data:/data/letsencrypt \
certbot/certbot \
certonly \
--webroot --webroot-path=/data/letsencrypt \
-d www.mysnippetsblog.eu -d mysnippetsblog.eu
```

Crontab renew:

```
0 0 */15 * * docker run -t --rm -v certs:/etc/letsencrypt -v certs-data:/data/letsencrypt -v /var/log/letsencrypt:/var/log/letsencrypt deliverous/certbot renew --webroot --webroot-path=/data/letsencrypt && docker kill -s HUP nginx >/dev/null 2>&1
```

[Source](https://miki725.github.io/docker/crypto/2017/01/29/docker+nginx+letsencrypt.html)
