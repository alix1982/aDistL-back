const router = require('express').Router();

const {
  validationRouterCreateGroup,
  validationRouterDeleteGroup,
  validationRouterGroupUserData,
} = require('../validations/validationRouter');

const { getGroups, createGroup, deleteGroup, getGroupUserData } = require('../controllers/group');
const { createDonationOrder } = require('../controllers/translation');

// router.get('/translation', getGroups);

// router.get('/translation/:_id', validationRouterGroupUserData, getGroupUserData);

router.post('/translation', createDonationOrder);

// router.delete('/translation/:_id', validationRouterDeleteGroup, deleteGroup);

module.exports = router;
