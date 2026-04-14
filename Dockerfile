FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY svg/ /usr/share/nginx/html/svg/
COPY svg-list.json /usr/share/nginx/html/

EXPOSE 80
