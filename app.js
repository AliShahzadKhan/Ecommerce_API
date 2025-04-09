const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/orders');
require('dotenv').config();

app.use(cors());
// app.options('/*', cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//routes
app.use(`${process.env.API_URL}/products`, productsRouter);
app.use(`${process.env.API_URL}/categories`, categoriesRouter);
app.use(`${process.env.API_URL}/users`, userRouter);
app.use(`${process.env.API_URL}/orders`, orderRouter);


//database connection
mongoose.connect(process.env.MONGOOSE_CONNECTION_LINK)
.then(()=>{
    console.log('Connection with mongoose success!');
}).catch((error)=>{
    console.log(error);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on Port: ${process.env.PORT}`);
});
