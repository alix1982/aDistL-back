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

// тестирование на локальном сервере
// const TERMINAL_KEY = process.env.TERMINAL_KEY_TEST;
// const ORDER_URL = process.env.ORDER_URL_PROD;
// const PASSWORD = process.env.PASSWORD_TEST;

// тестирование в проде
const TERMINAL_KEY = process.env.TERMINAL_KEY_PROD;
const ORDER_URL = process.env.ORDER_URL_TEST;
const PASSWORD = process.env.PASSWORD_PROD;


const createDonationOrder = async (req, res, next) => {
  const { amount, email } = req.body;


  // валидация входных данных
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Некорректная сумма доната' });
  }

  const amountKopecks = Math.round(amount * 100);
  const orderId = `donate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  let params = {
    "TerminalKey": TERMINAL_KEY,
    "Amount": amount*100,
    "OrderId": orderId,
    "Description": `Донат ${amount} руб. на развитие проекта`,
    // "Description": `Донат`,
  };
  let paramsToken = {
    "TerminalKey": TERMINAL_KEY,
    "Amount": amount*100,
    "OrderId": orderId,
    // "Description": `Донат ${amount} руб. на развитие проекта`,
    "Description": `Донат`,
    "Password": PASSWORD,
  };
  // формирование Token: сортировка ключей по алфавиту + Password в конце
  const sortedKeys = Object.keys(paramsToken).sort();
  // const baseString = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + PASSWORD;
  const baseString = sortedKeys.map(k => paramsToken[k]).join('');

  // Для отладки: логируем отсортированные ключи и начало строки (пароль не показываем)
  // console.log('DEBUG sortedKeys:', sortedKeys);
  // console.log('DEBUG baseString (первые 200 символов):', baseString.substring(0, 200));

  const token = crypto.createHash('sha256').update(baseString, 'utf8').digest('hex');
  // console.log('tok:' + ' ' + token)
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
    // const response = await axios.post(CREATE_ORDER_URL, params, {
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // console.log(config)
    const response = await axios.request(config)
      // .then((response) => {
      //   console.log(JSON.stringify(response.data));
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
    // const dataError = await response.json().catch(() => {
    //     throw new Error('Не удалось распарсить JSON ответ от эквайринга');
    //   });

    // console.log('DEBUG эквайринг ответ:', dataError);

    const data = response.data;
    // console.log(data);
    // console.log(response);

    if (!data.Success || !data.PaymentURL) {
      // можно сохранить заказ в БД со статусом «ошибка создания»
      return res.status(500).json({
        error: 'Не удалось создать платёж',
        details: data,
      });
    }

    // редирект пользователя на платёжную форму Т‑Банка
    return res.send(data.PaymentURL);

  } catch (err) {
    // console.log(err)
    // console.error('Ошибка запроса к эквайрингу:', err.response?.data, err.message);
    // return res.status(502).json({ error: 'Ошибка взаимодействия с платёжной системой' });
    return res.status(502).json({ error: err.message });
  }
};

module.exports = { createDonationOrder };
