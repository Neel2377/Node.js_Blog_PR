const express = require('express');
const homeRouter = require('./home.routes');
const postRouter = require('./post.routes');
const userRouter = require('./user.routes');
const router = express.Router();

router.use('/',homeRouter);
router.use('/posts',postRouter);
router.use('/users', userRouter);

module.exports = router;
