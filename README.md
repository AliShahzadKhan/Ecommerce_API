A full-featured Ecommerce RESTful API built with Node.js, Express, and MongoDB.
It supports user authentication, admin roles, CRUD operations on products, categories, and orders,
and includes secure JWT-based authentication, image uploads, and modular MVC architecture.


Tech Stack:
Node.js
Express.js
MongoDB and Mongoose
JWT and express-jwt
Multer (file uploads)
bcrypt (password hashing)
dotenv (environment management)
CORS
Morgan (logging)


Features:
User registration, login, and role-based authorization (Admin/User)
Product, Category, and Order management with full CRUD operations
Image upload and management using Multer
Secure password hashing using bcrypt
Cross-origin request handling using CORS
Environment variable protection using dotenv
API request logging using Morgan
Organized project structure using MVC architecture
Nodemon for automatic server reloads during development


Installation:
//Clone the repository
git clone https://github.com/your-username/ecommerce-api.git

//Navigate into the project folder
cd ecommerce-api

//Install dependencies
npm install

//Run the server
npm run dev


Authentication:
JWT tokens are issued at user login.
Protected routes are accessible based on user roles (Admin or User).

Notes:
Create a .env file and set the following environment variables:
API_URL
PORT 
JWT_SECRET 

