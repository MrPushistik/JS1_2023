const Router = require('express');
const router = new Router();
const FeedbackController = require("../controllers/feedbackController");

router.post("/", FeedbackController.create);
router.get("/", FeedbackController.getAll);
router.get("/:id", FeedbackController.get);
router.put("/:id", FeedbackController.update);
router.delete("/:id", FeedbackController.delete);


module.exports = router