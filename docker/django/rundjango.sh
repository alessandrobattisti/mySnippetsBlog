#!/bin/bash
# Prepare log files and start outputting logs to stdout
mkdir /webapp/logs
touch /webapp/logs/gunicorn.log
touch /webapp/logs/access.log
tail -n 0 -f /webapp/logs/*.log &
DJANGODIR=/webapp/backEnd
cd $DJANGODIR
# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn snippetApi.wsgi:application \
    --name snippetApi \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --log-level=info \
    --log-file=/webapp/logs/gunicorn.log \
    --limit-request-line=0 \
    --timeout=90 \
    --graceful-timeout=10 \
    --error-logfile=/webapp/logs/gunicorn_error.log \
    #--access-logfile=/webapp/logs/access.log \
    "$@"
