FROM localhost/soi24/debian-dev:1 AS debian-dev

# Build project sources
COPY --from=src / /soi24-game-web-server
RUN . /etc/profile.d/zzz-custom.sh \
    && cd /soi24-game-web-server \
    && mvn clean package

FROM debian:12

# Copy JDK from dev base image
COPY --from=debian-dev /opt/jdk /opt/jdk

# Copy build artifact
COPY --from=debian-dev \
    /soi24-game-web-server/target/soi24-game-web-server-1.0.0-SNAPSHOT.jar \
    /opt/soi24-game-web-server/

# Copy source filesystem
COPY ["rootfs", "/"]

# Set current working directory
WORKDIR /opt/soi24-game-web-server/

# Start service as default command
CMD ["/bin/sh", "start.sh"]
