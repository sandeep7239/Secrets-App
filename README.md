# Secrets-App
Secrets App

This is a web application that allows users to register, login, and share secrets. Users can create an account using a local username and password or sign in with their Google account using OAuth2 authentication.
Technologies Used

    Express.js: A web application framework for Node.js
    Passport.js: An authentication middleware for Node.js
    MongoDB: A NoSQL database used with Mongoose for data storage
    EJS: A templating engine for rendering dynamic HTML pages
    bcrypt: A library for password hashing and verification
    express-session: A middleware for session management
    dotenv: A module for loading environment variables from a .env file
    passport-local: A Passport strategy for username and password authentication
    passport-local-mongoose: A Mongoose plugin for simplifying Passport-local configuration
    passport-google-oauth20: A Passport strategy for Google OAuth2 authentication
    mongoose-findorcreate: A plugin for finding or creating a user in MongoDB using Mongoose

Installation

    Clone the repository:

    shell

git clone <repository-url>

Install the dependencies:

shell

npm install

Set up environment variables:

    Create a .env file in the project root directory.
    Add the following variables to the .env file:

    plaintext

    CLIENT_ID=<your-google-client-id>
    CLIENT_SECRET=<your-google-client-secret>

Start the application:

shell

    npm start

    Open your browser and navigate to http://localhost:3000

Usage

    Register a new account by providing a username and password or sign in with your Google account.
    Once logged in, you can share your secrets on the "Submit" page.
    View secrets shared by other users on the "Secrets" page.

Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.
