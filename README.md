A full-featured Ecommerce RESTful API built with Node.js, Express, and MongoDB. It supports user authentication, admin roles, CRUD operations on products, categories, and orders, and includes secure JWT-based authentication, image uploads, and modular MVC architecture.
Now deployed on an AWS EC2 instance using Docker and an automated CI/CD pipeline via GitHub Actions.
Tech Stack

    Backend: Node.js, Express.js

    Database: MongoDB, Mongoose

    Authentication: JWT, express-jwt

    File Uploads: Multer

    Security: bcrypt (password hashing), dotenv (environment management)

    Others: CORS, Morgan (logging)

    Deployment: Docker, AWS EC2, GitHub Actions (CI/CD)

Features

    User registration, login, and role-based authorization (Admin/User)

    Product, Category, and Order management with full CRUD operations

    Image upload and management using Multer

    Secure password hashing using bcrypt

    Cross-origin request handling using CORS

    Environment variable protection using dotenv

    API request logging using Morgan

    Organized project structure using MVC architecture

    Nodemon for automatic server reloads during development

    Automated build and deployment to AWS EC2 via Docker & GitHub Actions

Installation (Local Development)

# Clone the repository
git clone https://github.com/your-username/ecommerce-api.git

# Navigate into the project folder
cd ecommerce-api

# Install dependencies
npm install

# Create a .env file with the following variables:
API_URL=your_api_url
PORT=5000
JWT_SECRET=your_jwt_secret

# Run the server
npm run dev

Deployment (Docker + AWS EC2)

The project is set up with a CI/CD pipeline using GitHub Actions:

    On every push to the main branch, the pipeline builds a Docker image, pushes it to the EC2 instance, and starts the container.

    Ensure Docker is installed and running on your EC2 instance.

Authentication

    JWT tokens are issued at user login.

    Protected routes are accessible based on user roles (Admin or User).

Notes

    Make sure MongoDB is accessible from your EC2 instance (either local installation or a cloud database like MongoDB Atlas).

    Update .env variables both locally and on the EC2 instance.
