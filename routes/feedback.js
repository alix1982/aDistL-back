const router = require('express').Router();

// const {
//   validationRouterCreateGroup,
//   validationRouterDeleteGroup,
//   validationRouterGroupUserData,
// } = require('../validations/validationRouter');

const { createFeedback } = require('../controllers/feedback');

// router.get('/feedback', getGroups);

// router.get('/group/:_id', validationRouterGroupUserData, getGroupUserData);

router.post('/feedback', createFeedback);

// router.delete('/group/:_id', deleteGroup);

module.exports = router;
