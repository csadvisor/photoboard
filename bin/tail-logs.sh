#!/bin/sh
~/Documents/photoboard/node_modules/forever/bin/forever logs | grep bin\/www | sed -e "s/^.*bin\/www[^\/]*\(.*\.log\).*$/\1/" | xargs tail -f