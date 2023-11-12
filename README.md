# MERN-Notes App Documentation

## Table of Contents
*	Project Overview
*	Installation and Setup
*	Architecture and Design
*	Features and Functionality
*	API Documentation
*	Configuration
*	Deployment
*	Troubleshooting and FAQ

## Project Overview
The Note Taking App is a web-based application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It allows users to create both public and private notes, tailoring visibility to their needs. Private notes come with password protection, ensuring only authorized individuals can access, edit, or delete sensitive information. CRUD operations enable users to seamlessly create, view, edit, and delete notes, enhancing efficiency in organizing and managing their information. Privacy is ensured through cookie-based authentication, providing secure access to private notes. This app offers a user-friendly interface that adapts to any device.

## Installation and Setup
1.	Clone the repository from GitHub :
   
> git clone https://github.com/kevin21hk/mern-notes.git

---

2.	Install Node.js and MongoDB if not already installed.

---

3.	Navigate to the project directory :

> cd mern-notes

---

4.	Navigate to the project backend :
  
> cd backend

---

5.	Install backend dependencies :
  
> npm install

---

6.	Navigate back to the project directory :

> cd ..

---

7.	Navigate to the project frontend :

> cd frontend

---

8.	Install frontend dependencies :
  
> npm install

---

## Architecture and Design
The Note Taking App follows a client-server architecture, with the frontend built using React and the backend implemented with Express.js. The MongoDB database is used to store notes and other relevant data.
The project structure is organized as follows:
>	frontend/ :
* Contains the frontend React application.
 
---

> frontend/src/components/ :
* All React Components for creating the frontend

---

>	backend/ :
* Contains the backend server code.

---

> backend/routes/ :
* Defines the API routes for note CRUD operations, cookie sessions, generate unique note ID, password and authentication.

---

> backend/models/ :
* Includes the Mongoose schema definitions for notes.

---

> backend/controllers/ :
* Implements the business logic for handling CRUD operations, hashes and sessions.

---

> backend/.env :
* Stores configuration files for the server port, the frontend URL and the MongoDB connection string.

---

> backend/server.js :
* The server.js file handles middleware, establishes the MongoDB connection and listens for route endpoints.

---

## Features and Functionality
1.	***Public or Private Note Creation :*** Users can create notes that can be either public or private.
2.	***Note Textarea Max Length :*** The note textarea has a maximum character limit of 2000 letters.
3.	***Automatic Password Generation :*** The server will automatically generate a random 8-character password using a set of 62 unique characters if the user chooses a private note or password. Alternatively, users can enter their own password.
4.	***Form Validation :*** Input forms are validated to ensure that the provided data meets the required criteria. e.g. Password field minimum 8-characters.
5.	***Unique Note ID :*** Once note created, the server will automatically generate a random unique 5-character ID using a set of 52 unique characters. 
6.	***Toast Alerts :*** Toast alerts are displayed to provide users with notifications or feedback.
7.	***Easily Copy URL and Access Note on Different Devices :*** Users can easily copy the URL of a note and access it from different devices.
8.	***Cookies Stored for 10 Minutes :*** Information stored in cookies is retained for a duration of 10 minutes.
9.	***Authentication for Private Notes :*** Private notes require authentication to access or modify.
10.	***Password Lockout :*** If a user enters the wrong password three times consecutively, the account or access to the note will be locked for a duration of 5 minutes.
11.	***Create, Read, Update, and Delete (CRUD) Notes :*** Users can perform basic CRUD operations.
12.	***Text Editing Capabilities and Note Deletion for Private Notes :*** Users can edit the text content of their private notes and delete them if needed.
13.	***Responsive and User-Friendly Interface :*** The interface is designed to adapt to different screen sizes and provide a user-friendly experience.
14. ***Public Notes :*** Public notes created are displayed throughout the app.

## API Documentation
The Note Taking App exposes the following API endpoints:

---

*	POST
> /api/create-note :

Creates a new note.

---

*	POST
> /api/auth :

Authenticates user.

---

*	GET
> /api/generate-pass :

Auto generates password for note.

---

*	GET

> /api/generate-hash :

Auto generates unique hash for note.

---

* GET
> /api/retrieve-note/:id :

Retrieves note from DB based on ID.

---

* GET
> /api/check-session :

Checks if user is authenticated.

---

*	GET
> /api/get-public-notes :

Retrieves all public notes from DB.

---

*	PUT
> /api/update-note :

Updates a specific note.

---

*	PUT
> /api/update-title :

Updates a specific title of a note.

---

* DELETE

> /api/delete-note/:id :

Deletes a specific note.

---

## Configuration
The Note Taking App uses the following configuration:

*	Axios baseURL :
  > http://localhost:3002/

 (Modify in frontend/src/components/Axios.js)
 
---

*	Backend PORT :
  > 3002

(Modify in backend/.env with PORT)
 
---
 
*	MongoDB connection string :
  > `mongodb+srv://USER:PASS@cluster0.np9x2ra.mongodb.net/notesDB`

(Modify in backend/.env with DB_URL, please enter own Username and Password)

---

*	Secret key for cookie sessions :
> 'secretKey4Note'

---

*	Frontend CLIENT_URL :
  > http://localhost:3000/

 (Modify in backend/.env with CLIENT_URL)

---

*	Frontend PORT :
  > 3000

(Default PORT 3000)

---

Please make sure to update the env files (backend/.env) accordingly before running the app in a production environment and update Axios baseURL (frontend/src/components/axios.js)

## Deployment
To deploy the Note Taking App to a hosting platform, follow these steps:
1.	Set up a MongoDB instance and obtain the connection string.
2.	Set the necessary environment variables for your hosting platform (PORT, CLIENT_URL and DB_URL).
3.	Build the frontend React app : cd frontend && npm run build.
4.	Deploy the backend Express server to your hosting platform (e.g., Heroku, Render, AWS, Azure).
5.	Configure the hosting platform to serve the static files from the frontend/build directory.
For detailed deployment instructions, please refer to the documentation of your chosen hosting platform.

## Troubleshooting and FAQ
***Q: Why can I not create a note?***

A: Please check the following :
1.	Verify information : Ensure correct and complete input, including all required fields.
2.	Data validation : Make sure your input meets any specified rules or constraints.
3.	Database connection : Confirm a successful connection to the database.
4.	IP whitelisting : Check if your application's IP address is added to the MongoDB whitelist.

These steps will help troubleshoot common issues preventing note creation.

---

***Q: How can I customize the app's appearance or add new features?***

A: The frontend code is located in the frontend/src directory. You can modify the React components, styles, or add new components to customize the app's appearance and behavior.


