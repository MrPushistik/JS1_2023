const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');

router.post('/registration',userController.registration);
router.post('/login',userController.login);
router.get('/auth',userController.check);
router.delete("/:id", userController.delete);

module.exports = router;