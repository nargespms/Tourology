# Tourology

Tourology is a mobile application that connects Tour Guides and Travelers. Tour Guides can showcase their services and expertise, and Travelers can browse and book tours all around the world.

## Backend Structure

```
.
├── server
│   ├── src
│       ├── config
│       ├── controllers
│       ├── middlewares
│       ├── models
│       ├── routes
│       ├── app.js
│       ├── package.json
│

```

## Getting Started

### Prerequisites

- **Node.js** (v14+ recommended)
- **npm**
- **MongoDB** (running locally)

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

   2. Install & Start the server:

      ```bash
        npm install
        npm run start
      ```
