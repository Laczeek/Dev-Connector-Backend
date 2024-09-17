# Dev-Connector Backend

> Express application including serving static files and api endpoints.
>
> > [Live demo](https://dev-connector-drab.vercel.app/)

## Built with

- express framework
- mongoose ODM
- bcrypt
- jsonwebtoken
- multer & sharp
- uuid
- cors (only for development)
- typescript

## Features

- api endpoints
- static files serving
- authentication & authorization
- mongodb server connection
- error handling middleware
- image uploads to imgbb (unfortunately, free vercel hosting does not allow to upload files to file system)
- getting details about users github account

## Things that should be added
- pagination
- better authentication based on access token and refresh token (http cookie)
- email sending
- possibility to update user data
