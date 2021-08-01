const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6105bbc34a24dc565dd8025d',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрошенный роут не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
