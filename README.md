This is an app for a touch-screen photo-board in Gates

The scripts in bin should make it start up automatically. The app also uses forever to monitor the app and restart it if it crashes.

Here are some useful commands to run from the base photoboard directory:
    
    npm run-script logs // display the logfile for the photoboard
    npm run-script kill // kill the running process
    npm run-script forever // if you need to manually start up the server
    npm start //  starts a server instance with no forever monitoring (useful for debugging)
    npm run-script tail // tails the active logs interactively
