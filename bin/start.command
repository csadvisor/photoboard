#!/bin/bash

cd /Users/sing/Documents/photoboard
osascript bin/close-chrome.scpt
npm run-script forever
sleep 5
osascript bin/calibrate-touch-screen.scpt
sleep 5
osascript bin/full-screen-chrome.scpt
bin/MouseTools -x 100 -y 400