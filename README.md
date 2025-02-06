# Tourology

Tourology is a mobile application that connects Tour Guides and Travelers. Tour Guides can showcase their services and expertise, and Travelers can browse and book tours all around the world.

This repository contains two main directories:

1. **server** (the backend)
2. **client** (the frontend)

---

## Table of Contents

- [Tourology](#tourology)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
    - [Features](#features)
  - [Technologies](#technologies)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the App](#running-the-app)

---

## About the Project

Tourology is designed to make booking and hosting tours effortless. Users can sign up as Tour Guides, providing detailed profiles with photos, while Travelers can create reservations, browse tours by location, and more.

### Features

- **File Upload**: Upload profile pictures using Expo ImagePicker on the frontend and Multer on the backend.
- **JWT Authentication**: Secure routes with JSON Web Tokens.
- **Role-Based**: Different dashboards for Tour Guides and Travelers.
- **Global State**: Manage user authentication state with React Context.
- **Scan QRCode**: Travelers can scan the QR code of the tour guide to get the information of the tour guide.

---

## Technologies

- **Frontend**: React Native (Expo)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer

---

## Project Structure

```
.
├── client
│   ├── app
│       ├── api
│       ├── components
│       ├── contexts
│       ├── hooks
│       ├── screens
│   ├── assets
│   ├── navigation
│   ├── theme
│   ├── App.tsx
│   └── ... (other configs)
├── server
│   ├── src
│       ├── config
│       ├── controllers
│       ├── middlewares
│       ├── models
│       ├── routes
│       ├── app.js
│   └── ... (other configs)
└── README.md
```

1. **client**

   - **assets**: Images and other static resources
   - **components**: Reusable UI components
   - **contexts**: React Context providers for global state
   - **hooks**: Custom React hooks
   - **screens**: Individual screen pages for different routes
   - **App.js**: Entry point for the React Native application

2. **server**
   - **controllers**: Logic for handling routes
   - **middlewares**: Express middlewares
   - **models**: database schemas/models
   - **routes**: Express route definitions
   - **server.js**: Main file that starts the Express server and connects to the database

---

## Getting Started

### Prerequisites

- **Node.js** (v14+ recommended)
- **npm**
- **MongoDB** (running locally)
- **Expo** (for running the React Native app)

### Installation

1. **Clone** the repository:
   ```bash
   git clone https://github.com/nargespms/Tourology.git
   cd tourology
   ```
2. **Install** server dependencies:
   ```bash
    cd Server
    npm install
   ```
3. **Install** client dependencies:
   ```bash
    cd Client
    npm install
   ```

### Running the App

1. Running the server:

   1. Create a .env file in the server directory with the following environment variables:

      ```bash
          PORT=4000
          MONGO_URI=mongodb://localhost:27017
          MONGO_USER=root
          MONGO_PASS=pass
          MONGO_DB=tourology
      ```

   2. Start the server:

      ```bash
      npm run start
      ```

2. Running the client:
   From the Client directory, run the following command:

   ```bash
    npm run start
   ```

- This will open the Expo Dev Tools in your console.
- Use an iOS or Android emulator, or scan the QR code with the Expo app on your device to run on a physical device.
