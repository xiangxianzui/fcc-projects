fcc-node-voting
===================

This is a **FreeCodeCamp** Back End Development [project](https://www.freecodecamp.com/challenges/build-a-voting-app).
The app is hosted on this great cloud platform --- [Heroku](https://www.heroku.com).
The data is all stored in [mLab](https://mlab.com).
This app can be accessed [here](https://rocky-reaches-39900.herokuapp.com/).

----------


Run app in your local machine
-------------
**Clone repository**

- Open your working directory, clone this git repo to your machine.
`git clone https://github.com/xiangxianzui/fcc-node-voting.git` and `cd fcc-node-voting`

**Create an OAuth application in [Github](https://github.com/settings/developers)**

 - Click "Register a new application" button on the right-top corner
 - Give your application a name and set **both** "Homepage URL" and "Authorization callback URL" to `http://localhost:5000/`, then click register button
 - Once registered, you will get a **Client ID** and **Client Secret**
 - Open .env file in your directory, replace the GITHUB_KEY and GITHUB_SECRET with your ID and Secret respectively
 - Still in .env file, change APP_URL to `http://localhost:5000/`
 - In addition, you can change your mongodb store either by creating a local mongodb store, or by hosting data on your own mLab database. This [wiki](https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/Using-MongoDB-And-Deploying-To-Heroku) is helpful.
 
**Run this app**

 - In your directory `fcc-node-voting`, install dependencies by typing `npm install`
 - Start the server by `node server.js`
 - Open you favourite browser and type `http://localhost:5000/`