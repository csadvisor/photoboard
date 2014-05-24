#!/bin/bash

cd /Users/sing/Documents/photoboard
npm run-script forever
sleep 10
osascript bincalibrate-touch-screen.scpt
sleep 10
osascript bin/full-screen-chrome.scpt
