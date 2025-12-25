const express = require('express');
const AppError = require('./utils/AppError');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ data: 'working' });
});

const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

const testRoutes = require('./routes/test.routes');
app.use('/api', testRoutes);

const postRoutes = require('./routes/post.routes');
app.use('/api/posts' , postRoutes);

const commentRouted  = require('./routes/comment.routes');
app.use('/api' , commentRouted)

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});


app.use(errorMiddleware)

module.exports = app;

