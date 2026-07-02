const router = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');
const noAutorizationRouter = require('./noAutorization');
const authAdmin = require('../middlewares/authAdmin');
const userRouterAdmin = require('./usersAdmin');
const questionnaireRouterAdmin = require('./questionnaireAdmin');
const programmRouterAdmin = require('./programm');
const groupRouterAdmin = require('./group');
const translation = require('./translation');

const errorRouter = require('./errors');
const auth = require('../middlewares/auth');
const cors = require('../middlewares/cors');

router.use(cors);

router.use(noAutorizationRouter);
router.use(translation);
router.use(authRouter);
router.use(auth);
router.use(userRouter);
router.use(authAdmin);
router.use(questionnaireRouterAdmin);
router.use(userRouterAdmin);
router.use(programmRouterAdmin);
router.use(groupRouterAdmin);

router.use(errorRouter);

module.exports = router;
