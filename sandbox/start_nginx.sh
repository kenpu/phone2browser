mkdir -p log
cat > log/nginx.conf << ____

worker_processes 4;

error_log $PWD/log/error.log;
pid $PWD/log/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include $PWD/mime.types;
    access_log $PWD/log/access.log;
    sendfile on;
    keepalive_timeout 60;

    server {
        listen 8000;

        location ~ ^/http-bind/ {
            proxy_pass http://localhost:5280;
        }

        location / {
            root $PWD/www;
            autoindex on;
        }
    }
}

____

killall nginx

nginx -c $PWD/log/nginx.conf 2>&1 | grep -v '[alert]'
