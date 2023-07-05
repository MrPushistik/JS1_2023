const Router = require('express');
const router = new Router();
const CommentingApplicationController = require("../controllers/commentingApplicationController");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/", CommentingApplicationController.create);
router.get("/", CommentingApplicationController.getAll);
router.get("/:id", CommentingApplicationController.get);
router.put("/:id", CommentingApplicationController.update);
router.delete("/:id",checkRole('ADMIN'), CommentingApplicationController.delete);

module.exports = router
