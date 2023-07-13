const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration',checkRole('ADMIN'),userController.registration); 
router.post('/login',userController.login);
router.get('/auth',authMiddleware,userController.check); 
router.delete("/:id",checkRole('ADMIN'), userController.delete); 
router.get("/admin/req",checkRole('ADMIN'), userController.getAll); 
//router.get("/admin/req/:id",checkRole('ADMIN'), userController.get); 
router.get("/admin/req/:id",checkRole('ADMIN'), userController.getFullUserInfo); 
router.put("/:id",checkRole('ADMIN'), userController.update); 

module.exports = router;