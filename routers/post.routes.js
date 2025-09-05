const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { isAuth } = require('../middlewares/auth');
const ctrl = require('../controllers/postController');

// create
router.get('/new', ctrl.createForm);
router.post('/', upload.single('cover'), ctrl.create);


// read
router.get('/:id', isAuth, ctrl.show);

// update
router.get('/:id/edit', ctrl.editForm);
router.post('/:id/edit', upload.single('cover'), ctrl.update);

// delete
router.post('/:id/delete', ctrl.delete);

// social
router.post('/:id/like', ctrl.toggleLike);
router.post('/:id/comments', ctrl.addComment);

module.exports = router;
