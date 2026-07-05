module.exports = {
  // общие сообщения ошибок сервера
  mesErr500: 'На сервере произошла ошибка',
  mesErrRouterErrors404: 'Не верный путь',

  // сообщения celebrate
  mesErrCelebratePhone400: 'Телефон не корректен',

  //сообщения мидлвар (авторизации)
  mesErrAuth401: 'Необходима авторизация',

  //сообщения роута авторизации
  mesErrLogin401: 'Пользователь с таким логином и паролем не найден',
  mesErrLoginSnils401: 'Неправильный снилс',
  mesLoginUser: 'Всё верно!',
  mesLoginAdmin: 'That right!',

  // сообщения роута noAutorization и утилит
  mesErrNoEmailSending400: 'Нет почты для отправки анкеты',
  // mesErrEmailSending400: 'Анкета создана. Ошибка отправки письма', // реквизитов отправителя
  mesErrEmailSending400: 'Анкета создана!', // реквизитов отправителя

  mesErrEmailSendingQuestion400: 'Ошибка отправки письма', // реквизитов отправителя
  mesQuestionAndEmail: 'Анкета создана, письмо отправлено',
  mesQuestionnaire: 'Анкета создана',
  mesErrNoQuestion: 'Анкета не найдена',
  mesQuestion: 'Письмо отправлено', // + в утилитах

  // сообщения роута анкет админа и утилит
  mesErrValidationQuestionnaire400: 'Ошибка валидации модели анкеты', // + в утилитах
  mesErrConflictQuestionnaire409: 'Анкета с таким снилсом уже существует', // + в утилитах
  mesErrIdQuestionnaire400: 'Некорректный id анкеты',
  mesFixQuestionnaire: 'Анкета изменена',
  mesModerationQuestionnaireCompleted: 'Модерация анкеты пройдена',
  mesModerationQuestionnaireCancelled: 'Модерация анкеты отменена',
  mesErrQuestionnaire404: 'Ошибка типа модели анкеты',

  //сообщения роута пользователя
  mesAddProgrammUserCompleted: 'Программы успешно добавлены',
  mesErrFixUpdateProgrammUser404: 'Ошибка измения программы пользователя',
  mesErrNoKeyFixProgrammUser400: 'Неизвестный ключ изменения программ пользователя',
  mesErrNoDataFixProgrammUser400: 'Некорректные данные для изменения программ пользователя',

  //сообщения роута пользователей админа
  mesErrConflictUserGroup409: 'Группа с таким именем уже назначена пользователю',
  mesErrDeleteUser406: 'Ошибка! Удаление пользователя включенного в группы',
  mesErrUserEducationPast400: 'Удаление группы проходящей(закончившей) обучение',

  //сообщения роута программ
  mesErrCreateProgramm406: 'Ошибка! Длина массива тем не соответствует количеству блоков',
  mesErrDeleteProgramm406: 'Ошибка! Удаление используемой программы',

  //сообщения роута групп
  mesErrDeleteGroup406: 'Ошибка! Удаление используемой группы',
  mesErrConflictGroup409: 'Группа с таким именем уже существует',
  mesErrNoUsers404: 'Пользователи не найдены',
  mesErrNoUsersInGroup404: 'В заданной группе пользователей не найдено (проверьте состав группы или id группы)',

  //сообщения роута пользователя и роута пользователей админа
  mesErrNoUser404: 'Пользователь не найден',
  mesErrValidationUser400: 'Ошибка валидации модели пользователя',
  mesErrIdUser400: 'Некорректный id пользователя',

  // сообщения в роутах пользователей админа и групп
  mesErrIdGroup400: 'Некорректный id группы',
  mesErrValidationGroup400: 'Ошибка валидации модели групп',

  //сообщения роута групп, программ и пользователя админа
  mesErrIdProgramm400: 'Некорректный id программы',
  mesErrValidationProgramm400: 'Ошибка валидации модели программ',
  mesErrNoProgramm404: 'Программа не найдена',

  // сообщения в разных роутах
  mesErrNoQuestionnaire404: 'Анкета не найдена', // в роутах анкет админа, пользователя админа и пользователя
  mesErrConflictUser409: 'Пользователь с таким снилсом уже существует', // в роутах пользователей админа и авторизации
  mesErrNoGroup404: 'Группы не найдены', // в роутах пользователей, пользователей админа и групп
  mesErrConflictProgramm409: 'Программа с таким именем уже существует', // в роутах программ и групп

    // сообщения роута donat
  mesCreateFeedback: 'Отзыв сохранен',
  mesErrDonat400: 'Не удалось создать платёж',
  mesErrNoUrlDonat400: 'В ответе платёжной системы отсутствует ссылка на оплату',
  mesErrValidationDonat400: 'Ошибка валидации модели доната',
  mesErrAmountDonat400: 'Некорректная сумма доната',
  mesErrConflictFeedback409: 'Отзыв уже существует',

  // сообщения роута feedback
  mesCreateFeedback: 'Отзыв сохранен',
  mesErrLimitFeedback400: 'Большое количество отзывов, попробуйте позже.',
  mesErrValidationFeedback400: 'Ошибка валидации модели отзывов',
  // mesErrConflictFeedback409: 'Отзыв уже существует',
};
