# JWT User Authentication Passportjs
JWT based user authentication using passportjs, passport-local, passport-jwt, mongodb, angular

Be aware this is application comes from an old github repository.
It needs to be updated, changed and upgraded :
- to latest version of Angular
- to latest version of Express
- upgrade all necessary packages
- add MySQL and MariaDB integration
- needs forgot your password
- etc...


#### Express Server

- /users/login - passport-local strategy parse the login form and check the exist of user in mongodb,  then the login middleware sign the user as jwt and send the token

- /users/signup - passport-local strategy parse the signup form and add the user in the db, then the signup middleware sign the user as jwt and send the token.

- /users - protected by passport-jwt strategy, which parse the jwt token from header


#### Angular App

- / or /home - protected by CanActivate as AuthGuard, which allows only loggedin

- /login and /register - get the token from server and save it in local storage and loggedin



Angular build file is stored under public/dist

In Express app, to server the ui, static file ie. index.html is configured from path "public/dist/browser"


#### Setup
Clone the repo
`cd server`
`npm install`
`npm run secrets` *Generate the public, private key for JWT*
`npm start`


##### Screenshots
Home:
![Home page](./screenshot/Home%20Page.png)

Login:
![Login Page](./screenshot/Login%20Page.png)

Register:
![Register](./screenshot/Register%20Page.png)

PageNotFound:
![PageNotFound](./screenshot/Page%20Not%20Found.png)

Install MongoDB locally
Community version : https://www.mongodb.com/try/download/community

Configure MongoDB
Look in the ".env"-file in the "server" folder, use this exact url for your MongoDB configuration