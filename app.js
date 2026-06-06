const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const routes = require('./routes/index');
const { centralErrors } = require('./controllers/centralErrors');

const { PORT, NODE_ENV, MONGO_URL } = process.env; // для локального хоста

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(requestLogger);
app.use(cors);
app.use('/api', routes);
// app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(centralErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
