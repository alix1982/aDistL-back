const IncorrectData_400 = require("../errors/400-incorrectData");
// const ConflictData_409 = require("../errors/409-conflictData");
const Feedback = require("../models/feedback");
const { mesErrValidationFeedback400, mesCreateFeedback, mesErrLimitFeedback400 } = require("../utils/messageServer");
// const { mesCreateFeedback, mesErrConflictProgramm409, mesErrValidationProgramm400 } = require("../utils/messageServer");

module.exports.createFeedback = (req, res, next) => {
  // User.findById(req.user._id)
  //   .then((user) => {
  //     if (user === null) {
  //       throw new NoDate_404(mesErrNoUser404);
  //     }
  //     res.send(user);
  //   })
  //   .catch(next);
  const { type, user, content } = req.body;
  const dateActually = Date.now();

  Feedback.findOne().sort({ date: -1 })
    .then((feedback) => {
      // console.log(feedback)
      if (feedback && Number(dateActually) - Number(feedback?.date) <= 10000) {
        throw new IncorrectData_400(mesErrLimitFeedback400);
      }

      Feedback.create({
        type: type ? type : 'default',
        user: user === '' ? null : user,
        date: dateActually,
        content: content,
      })
        .then((feedback) => {
          // console.log(feedback)
          res.send({message: mesCreateFeedback});
        })
        .catch((err) => {
          console.error(err.name);
          if (err.name === 'ValidationError') {
            next(new IncorrectData_400(mesErrValidationFeedback400));
            return;
          }
          // if (err.code === 11000) {
          //   next(new ConflictData_409(mesErrConflictFeedback409));
          //   return;
          // }
          next(err);
        });
    })
    .catch((err) => {
      console.error(err.name);
      next(err);
    });
};
