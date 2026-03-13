# CVWO Assignment – Gossip with Go Forum

## Author

Name:Thazin Pyone
Project: CVWO Assignment – Web Forum Application

## Project Overview

This project is a simple web forum application built for the CVWO Assignment.
The application allows users to discuss topics by creating posts and comments.

Users are able to:

* Register and login
* Create discussion topics
* Create posts within topics
* Comment on posts
* Reply to other comments
* Edit and delete their own content

The system demonstrates a full-stack web application using a Go backend and React + TypeScript frontend.

## Tech Stack

### Backend

* Go
* Gin (Web Framework)
* GORM (ORM)
* MySQL (Relational Database)
* JWT Authentication

### Frontend

* React
* TypeScript
* Material UI (MUI)

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected API routes

### Forum System

* Create Topics
* View Topics
* Create Posts
* Edit Posts
* Delete Posts
* Add Comments
* Reply to Comments
* Edit/Delete Comments

### CRUD Operations

Full CRUD operations are implemented for:

* Topics
* Posts
* Comments

  
## Running the Project

### Backend

Install dependencies:

```
go mod tidy
```

Run the backend server:

```
go run main.go
```

Backend runs on:

```
http://localhost:8080
```

---

### Frontend

Install dependencies:

```
npm install
```

Start the React application:

```
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## AI Usage Declaration

AI tools were used according to the assignment guidelines.

AI was used for:

* Researching technical concepts
* Understanding error messages
* Learning about JWT authentication
* Documentation assistance

AI was not used to generate the core application code.

## Future Improvements

Possible future improvements include:

* Deployment of the application
* Search functionality
* Post voting (likes/dislikes)
* Improved UI/UX design
* Notification system
