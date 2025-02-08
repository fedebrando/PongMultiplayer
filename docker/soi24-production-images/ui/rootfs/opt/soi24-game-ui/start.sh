#!/bin/sh

apachectl -S && exec httpd-foreground
