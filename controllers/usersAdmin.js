const bcrypt = require('bcryptjs');
const IncorrectData_400 = require('../errors/400-incorrectData');
const NoDate_404 = require('../errors/404-noDate');
const NotAcceptable_406 = require('../errors/406-notAcceptable');
const ConflictData_409 = require('../errors/409-conflictData');
const Questionnaire = require('../models/questionnaire');
const User = require('../models/user');
const Group = require('../models/group');
const Programm = require('../models/programm');
const translit = require('../utils/translit');

const {
  mesErrConflictUser409,
  mesErrNoQuestionnaire404,
  mesErrValidationUser400,
  mesErrNoUser404,
  mesErrIdUser400,
  mesErrConflictUserGroup409,
  mesErrValidationProgramm400,
  mesErrIdProgramm400,
  mesErrNoGroup404,
  mesErrValidationGroup400,
  mesErrIdGroup400,
  mesErrUserEducationPast400,
  mesErrDeleteUser406,
  mesErrNoProgramm404,
  mesErrIdQuestionnaire400,
  mesErrValidationQuestionnaire400,
  mesErrConflictQuestionnaire409,
} = require('../utils/messageServer');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NoDate_404(mesErrNoUser404);
      }
      res.send(users);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { snils } = req.body;
  let userQuestionnaire = {};

  // поиск анкеты по снилсу
  Questionnaire.find({ snils: snils })
    .then((questionnaire) => {
      if (questionnaire === null) {
        throw new NoDate_404(mesErrNoQuestionnaire404);
      }
      // найденная анкета пользователя
      userQuestionnaire = questionnaire[0];
      return userQuestionnaire;
    })
    .then((userQuestionnaire) => {
      // вариант с шифрованием пароля пользователя
      // const pas = String(Math.floor(Math.random() * 100000));

      // bcrypt.hash(pas, 10)
      //   .then((hash) => User.create({
      //     snils: snils,
      //     avatar: '',
      //     name: translit(userQuestionnaire.firstName),
      //     password: hash,
      //     education: []
      //   }))
      // создание пользователя с открытым паролем
      User.find({})
        .then((users)=>{
          const newNameUser = translit(userQuestionnaire.firstName).split('-')[0].trim();
          const usersFilter = users.filter((item)=> item.name.split('-')[0] === newNameUser);
          let numberUser = 0;
          usersFilter.forEach((item) => {
            numberUser < Number(item.name.split('-')[1]) ?
              numberUser = Number(item.name.split('-')[1]) :
              numberUser = numberUser;
          });
          return (usersFilter.length === 0 ? newNameUser : newNameUser + '-' + (numberUser+1));
        })
        .then((nameUser)=>{
          User.create({
            snils: snils,
            avatar: '',
            name: nameUser,
            password: Math.floor(Math.random() * 100000),
            isHash: false,
            isBlocking:false,
            education: [],
          })
            .then((user) => {
              const userRes = {
                snils: user.snils,
                name: user.name,
                password: user.password,
                education: user.education,
              };
              res.send(userRes);
            })
            .catch((err) => {
              console.log(err);

              if (err.name === 'ValidationError') {
                next(new IncorrectData_400(mesErrValidationUser400));
                return;
              }
              if (err.code === 11000) {
                next(new ConflictData_409(mesErrConflictUser409));
                return;
              }
              next(err);
            });

        })
        .catch((err) => {
          console.log(err.name);
          if (err.name === 'CastError') {
            next(new IncorrectData_400(mesErrIdUser400));
            return;
          }
          if (err.name === 'TypeError') {
            next(new NoDate_404(mesErrFixUpdateProgrammUser404));
            return;
          }
          if (err.name === 'ValidationError') {
            return next(new IncorrectData_400(mesErrValidationUser400));
          }
          next(err);
        });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdQuestionnaire400));
        return;
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectData_400(mesErrValidationQuestionnaire400));
      }
      if (err.code === 11000) {
        return next(new ConflictData_409(mesErrConflictQuestionnaire409));
      }
      next(err);
    });
};

module.exports.addGroupUserAdmin = (req, res, next) => {
  const { groupName } = req.body;

  // изменение статуса использования программы при добавлении ее пользователю
  Group.findOneAndUpdate({ name: groupName }, { assigned: true }, { new: true, runValidators: true })
    .then((group) => {
      if (group === null) {
        throw new NoDate_404(mesErrNoGroup404);
      }
      // поиск программы по id программы из добавляемой группы
      Programm.findById(group.programm)
        .then((programm) => {
          if (programm === null) {
            throw new NoDate_404(mesErrNoProgramm404);
          }
          User.findById(req.params._id)
            .then((user) => {
              if (user === null) {
                throw new NoDate_404(mesErrNoUser404);
              }
              // проверка повторного включения в группу
              user.education.forEach((item) => {
                if (String(item.group) === String(group._id)) {
                  throw new ConflictData_409(mesErrConflictUserGroup409);
                }
              });
              //
              // включение пользователя в группу
              User.findByIdAndUpdate(
                req.params._id,
                {
                  education: [...user.education, { group, programm: programm }],
                },
                { new: true, runValidators: true }
              )
                .then((user) => {
                  if (user === null) {
                    throw new NoDate_404(mesErrNoUser404);
                  }
                  res.send(user);
                })
                .catch((err) => {
                  console.log(err.name);
                  if (err.name === 'CastError') {
                    next(new IncorrectData_400(mesErrIdUser400));
                    return;
                  }
                  if (err.name === 'ValidationError') {
                    next(new IncorrectData_400(mesErrValidationUser400));
                    return;
                  }
                  next(err);
                });
              //
            })
            .catch((err) => {
              console.log(err.name);
              if (err.name === 'CastError') {
                next(new IncorrectData_400(mesErrIdUser400));
                return;
              }
              if (err.name === 'ValidationError') {
                next(new IncorrectData_400(mesErrValidationUser400));
                return;
              }
              next(err);
            });
        })
        .catch((err) => {
          console.log(err.name);
          if (err.name === 'CastError') {
            next(new IncorrectData_400(mesErrIdProgramm400));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new IncorrectData_400(mesErrValidationProgramm400));
            return;
          }
          next(err);
        });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdGroup400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrNoGroup404));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new IncorrectData_400(mesErrValidationGroup400));
        return;
      }
      next(err);
    });
};

module.exports.deleteGroupUserAdmin = (req, res, next) => {
  const { groupId } = req.body;

  //поиск пользователя для проверки id
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        throw new NoDate_404(mesErrNoUser404);
      }
      //поиск группы для сравнения с группами пользователя
      Group.findById(groupId)
        .then((group) => {
          if (group === null) {
            throw new NoDate_404(mesErrNoGroup404);
          }
          // поиск индекса группы в списке групп пользователя
          const groupDelNumber = user.education.findIndex((item) => String(item.group) === String(groupId));
          // если группа не найдена
          if (groupDelNumber < 0) {
            throw new NoDate_404(mesErrNoGroup404);
          }
          // ошибка при удалении группы обучение которой уже закончено или уже идет
          if (group.dateStart < new Date().getTime()) {
            throw new IncorrectData_400(mesErrUserEducationPast400);
          }

          const education = user.education;
          education.splice(groupDelNumber, 1);

          // удаление группы из списка групп пользователя
          User.findByIdAndUpdate(req.params._id, { education: education }, { new: true, runValidators: true })
            .then((userUpdate) => {
              if (user === null) {
                throw new NoDate_404(mesErrNoUser404);
              }
              // поиск всех пользователей для проверки наличия группы у всех пользователей и если ее нет смены статуса assigned у группы
              User.find({})
                .then((users) => {
                  if (users.length === 0) {
                    throw new NoDate_404(mesErrNoUser404);
                  }
                  let usersGroup = [];
                  users.map((user) =>
                    user.education.map((item) => String(item.group) === groupId && (usersGroup = [...usersGroup, user]))
                  );
                  if (usersGroup.length <= 0) {
                    // изменение статуса assigned у группы если она никому не назначена
                    Group.findByIdAndUpdate(groupId, { assigned: false }, { new: true, runValidators: true })
                      .then((group) => {
                        if (group === null) {
                          throw new NoDate_404(mesErrNoGroup404);
                        }
                        res.send(userUpdate);
                      })
                      .catch((err) => {
                        console.log(err.name);
                        if (err.name === 'CastError') {
                          next(new IncorrectData_400(mesErrIdGroup400));
                          return;
                        }
                        if (err.name === 'TypeError') {
                          next(new NoDate_404(mesErrNoGroup404));
                          return;
                        }
                        if (err.name === 'ValidationError') {
                          next(new IncorrectData_400(mesErrValidationGroup400));
                          return;
                        }
                        next(err);
                      });
                  } else {
                    res.send(userUpdate);
                  }
                })
                .catch((err) => {
                  console.log(err.name);
                  if (err.name === 'CastError') {
                    next(new IncorrectData_400(mesErrIdUser400));
                    return;
                  }
                  if (err.name === 'TypeError') {
                    next(new NoDate_404(mesErrNoUser404));
                    return;
                  }
                  if (err.name === 'ValidationError') {
                    next(new IncorrectData_400(mesErrValidationUser400));
                    return;
                  }
                  next(err);
                });
            })
            .catch((err) => {
              console.log(err.name);
              if (err.name === 'CastError') {
                next(new IncorrectData_400(mesErrIdUser400));
                return;
              }
              if (err.name === 'TypeError') {
                next(new NoDate_404(mesErrNoUser404));
                return;
              }
              if (err.name === 'ValidationError') {
                next(new IncorrectData_400(mesErrValidationUser400));
                return;
              }
              next(err);
            });
        })
        .catch((err) => {
          console.log(err.name);
          if (err.name === 'CastError') {
            next(new IncorrectData_400(mesErrIdGroup400));
            return;
          }
          if (err.name === 'TypeError') {
            next(new NoDate_404(mesErrNoGroup404));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new IncorrectData_400(mesErrValidationGroup400));
            return;
          }
          next(err);
        });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdUser400));
        return;
      }
      if (err.name === 'TypeError') {
        next(new NoDate_404(mesErrNoUser404));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new IncorrectData_400(mesErrValidationUser400));
        return;
      }
      next(err);
    });
};

module.exports.deleteUserAdmin = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        throw new NoDate_404(mesErrNoUser404);
      }
      // запрет удаления пользователя с назначенным обучением
      if (user.education.length > 0) {
        throw new NotAcceptable_406(mesErrDeleteUser406);
      }
      return user.remove();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new IncorrectData_400(mesErrIdUser400));
        return;
      }
      next(err);
    });
};
