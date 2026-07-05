// const IncorrectData_400 = require('../errors/400-incorrectData');
// const NoDate_404 = require('../errors/404-noDate');
// const NotAcceptable_406 = require('../errors/406-notAcceptable');
// const ConflictData_409 = require('../errors/409-conflictData');
// const Programm = require('../models/programm');

// const {
//   mesErrValidationProgramm400,
//   mesErrCreateProgramm406,
//   mesErrConflictProgramm409,
//   mesErrIdProgramm400,
//   mesErrNoProgramm404,
//   mesErrDeleteProgramm406,
// } = require('../utils/messageServer');

const crypto = require('crypto');
const axios = require('axios');
const IncorrectData_400 = require('../errors/400-incorrectData');
const { mesErrAmountDonat400, mesErrNoUrlDonat400, mesErrDonat400 } = require('../utils/messageServer');

// тестирование на локальном сервере
// const TERMINAL_KEY = process.env.TERMINAL_KEY_TEST;
const ORDER_URL = process.env.ORDER_URL_PROD;
// const PASSWORD = process.env.PASSWORD_TEST;

// тестирование в проде
const TERMINAL_KEY = process.env.TERMINAL_KEY_PROD;
// const ORDER_URL = process.env.ORDER_URL_TEST;
const PASSWORD = process.env.PASSWORD_PROD;


const createDonationOrder = async (req, res, next) => {
  const { amount, email } = req.body;

  // валидация входных данных
  if (!amount || typeof amount !== 'number' || amount <= 1) {
    return next(new IncorrectData_400(mesErrAmountDonat400));
  };

  const numAmountKopecks = Number(amount)*100;

  const orderId = `donate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const params = {
    "TerminalKey": TERMINAL_KEY,
    "Amount": numAmountKopecks,
    "OrderId": orderId,
    "Description": `Донат ${amount} руб. на развитие проекта`,
  };
  // формирование Token: сортировка ключей по алфавиту + Password в конце
  const paramsToken = { ...params, Password: PASSWORD };
  const sortedKeys = Object.keys(paramsToken).sort();
  const baseString = sortedKeys.map(k => paramsToken[k]).join('');

  // Для отладки: логируем отсортированные ключи и начало строки (пароль не показываем)
  // console.log('DEBUG sortedKeys:', sortedKeys);
  // console.log('DEBUG baseString (первые 200 символов):', baseString.substring(0, 200));

  const token = crypto.createHash('sha256').update(baseString, 'utf8').digest('hex');
  // console.log('token:' + ' ' + token)
  params.Token = token;


  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: ORDER_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: params,
  };
  try {
    // console.log(config)
    const response = await axios.request(config)

    const data = response.data;

    if (!data.Success) {
      console.error('Эквайринг ошибка:', data);
      return next(new IncorrectData_400(mesErrDonat400));
    }

    if (!data.PaymentURL) {
      console.error('Нет PaymentURL в ответе эквайринга', data);
      return next(new IncorrectData_400(mesErrNoUrlDonat400));

    }
    return res.send(data.PaymentURL);

  } catch (err) {
    console.log(err.name);
    // console.error('Ошибка запроса к эквайрингу:', err.response?.data, err.message);
    next(err);
  }
};

module.exports = { createDonationOrder };
