const express = require('express');
require('dotenv').config();
const app = express();

const userRouter = require('routes/users');
const bookRouter = require('routes/books');
const cartRouter = require('routes/carts');
const likeRouter = require('routes/likes');
const orderRouter = require('routes/orders');
const categoryRouter = require('routes/category');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/carts', cartRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);
app.use('/category', categoryRouter);

app.listen(process.env.PORT);
