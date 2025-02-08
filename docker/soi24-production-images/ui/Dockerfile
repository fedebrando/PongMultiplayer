FROM localhost/soi24/debian-dev:1 AS debian-dev

# Build project sources
COPY --from=src / /soi24-game-ui
RUN . /etc/profile.d/zzz-custom.sh \
    && cd /soi24-game-ui \
    && npm install \
    && npm run test \
    && npm run build

FROM httpd:2.4-alpine

# Copy build artifact
COPY --from=debian-dev \
    /soi24-game-ui/dist/soi24-game-ui/* \
    /usr/local/apache2/htdocs/

# Copy source filesystem
COPY ["rootfs", "/"]

# Configure web server
RUN echo "Include conf.d/*.conf" >> /usr/local/apache2/conf/httpd.conf

# Set current working directory
WORKDIR /opt/soi24-game-ui

# Start service as default command
CMD ["/bin/sh", "start.sh"]
