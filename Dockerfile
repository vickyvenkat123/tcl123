FROM nginx:alpine

#ENV DIRPATH /usr/share/nginx/html
#WORKDIR $DIRPATH/
#COPY healthcheck.sh code/build/ $DIRPATH/
# Install app dependencies
#RUN chmod +x healthcheck.sh
# Health check
#HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD $DIRPATH/healthcheck.sh || exit 1
#CMD ["nginx", "-g", "daemon off;"]

COPY swa/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]