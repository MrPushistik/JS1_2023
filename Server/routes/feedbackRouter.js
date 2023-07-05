const Router = require('express');
const router = new Router();
const FeedbackController = require("../controllers/feedbackController");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/",checkRole('VOLUNTEER'), FeedbackController.create);
router.get("/", FeedbackController.getAll);
router.get("/:id", FeedbackController.get);
router.put("/:id",checkRole('VOLUNTEER'), FeedbackController.update);
router.delete("/:id",checkRole('ADMIN'), FeedbackController.delete);
router.post("/req",checkRole('VOLUNTEER'), FeedbackController.createFeedback);


module.exports = router