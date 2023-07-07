const Router = require('express');
const router = new Router();
const FeedbackController = require("../controllers/feedbackController");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/",checkRole('VOLUNTEER'), FeedbackController.create); //!!! -CHECKROLE
router.get("/", FeedbackController.getAll);
router.get("/:id", FeedbackController.get);
router.put("/:id",checkRole('VOLUNTEER'), FeedbackController.update); //!!! -CHECKROLE
router.delete("/:id",checkRole('ADMIN'), FeedbackController.delete); //!!! -CHECKROLE
router.post("/req",checkRole('VOLUNTEER'), FeedbackController.createFeedback); //!!! -CHECKROLE


module.exports = router