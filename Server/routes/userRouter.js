const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration',checkRole('ADMIN'),userController.registration); //!!! -CHECKROLE
//router.post('/registration',userController.registration);
router.post('/login',userController.login);
router.get('/auth',authMiddleware,userController.check); //!!! -CHECKROLE
router.delete("/:id",checkRole('ADMIN'), userController.delete); //!!! -CHECKROLE
router.get("/admin/req",checkRole('ADMIN'), userController.getAll); //!!! -CHECKROLE
router.get("/admin/req/:id",checkRole('ADMIN'), userController.get); //!!! -CHECKROLE

module.exports = router;