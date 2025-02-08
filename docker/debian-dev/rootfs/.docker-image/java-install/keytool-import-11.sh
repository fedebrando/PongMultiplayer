#!/bin/sh -xe

# Import CA certificates

for cert in /usr/local/share/ca-certificates/* ; do
    cert_alias=$(basename ${cert})
    keytool -importcert -noprompt -cacerts \
        -storepass changeit \
        -alias "${cert_alias}" \
        -file "${cert}"
done
