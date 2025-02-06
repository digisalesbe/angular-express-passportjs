# JWT User Authentication Passportjs
JWT based user authentication using passportjs, passport-local, passport-jwt, angular with a choosen database

Be aware this is application comes from an old githu
b repository.
It needs to be updated, changed and upgraded :
- ✅ to latest version of Angular
- ✅ to latest version of Express
- ✅ upgrade all necessary packages
- ✅ check vulnerabilities for frontend and backend
- ⬜ change auth.guard.ts - can't go to main page or /home
- ✅ only show "login"- and "register"-link when not logged in
- ⬜ if already logged in, can't register nor re-login ( neither with a different user ), also hide these links
- ✅ if already logged out, can't logout, also hide this link
- ✅ add header, footer and sidebar pages
- ✅ add members/dashboard, members/profile and about pages
- ⬜ add MySQL integration
- ⬜ add MariaDB integration
- ✅ easy configuration for chosen database
- ⬜ if username already exists, redirect to login page with filled in username
- ⬜ needs "forgot your password"-functionality
- ⬜ Rate limiting in users.js and app.js
- ⬜ only show console logs and errors in debug mode
- ⬜ needs simple responsive login / register & lost password layouts
- ⬜ codeQL configuration need to be corrected to work in GitHub ( with checks for pull request )
- etc...

Extra help is always welcome ! ( to make this application solid, full of features and documentation )

#### Express Server

- /auth/login - passport-local strategy parse the login form and check the exist of user in mongodb,  then the login middleware sign the user as jwt and send the token

- /auth/signup - passport-local strategy parse the signup form and add the user in the db, then the signup middleware sign the user as jwt and send the token.

- /auth - protected by passport-jwt strategy, which parse the jwt token from header


#### Angular App

- / or /home - protected by CanActivate as AuthGuard, which allows only loggedin

- /login and /register - get the token from server and save it in local storage and loggedin



Angular build file is stored under public/dist

In Express app, to server the ui, static file ie. index.html is configured from path "public/dist/browser"


#### Setup
Clone the repo locally
`cd server`
`npm install`
`npm run secrets` *Generate the public, private key for JWT*
`npm start`

Install MongoDB locally
Community version : https://www.mongodb.com/try/download/community

Configure MongoDB
Look in the ".env"-file in the "server" folder, use this exact url for your MongoDB configuration

##### Screenshots
Home:
![Home page](./screenshot/Home%20Page.png)

Login:
![Login Page](./screenshot/Login%20Page.png)

Register:
![Register](./screenshot/Register%20Page.png)

PageNotFound:
![PageNotFound](./screenshot/Page%20Not%20Found.png)
