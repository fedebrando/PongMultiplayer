#!/bin/sh -xe

exec mvn spring-boot:run \
    -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:8000"
