const Router = require('express');
const router = new Router();
const CommentingApplicationController = require("../controllers/commentingApplicationController");

router.post("/", CommentingApplicationController.create);
router.get("/", CommentingApplicationController.getAll);
router.get("/:id", CommentingApplicationController.get);
router.put("/:id", CommentingApplicationController.update);
router.delete("/:id", CommentingApplicationController.delete);

module.exports = router