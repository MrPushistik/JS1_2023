const Router = require('express');
const router = new Router();
const CommentingApplicationController = require("../controllers/commentingApplicationController");
const checkRole = require('../middleware/checkRoleMiddleware')
const testRole = require('../middleware/testRoleMiddleware')

router.post("/", testRole(["ADMIN", "VOLUNTEER"]), CommentingApplicationController.create);
router.get("/", testRole(["ADMIN", "VOLUNTEER"]), CommentingApplicationController.getAll);
router.get("/:id", testRole(["ADMIN", "VOLUNTEER"]), CommentingApplicationController.get);
//router.put("/:id", CommentingApplicationController.update);
//router.delete("/:id",checkRole('ADMIN'), CommentingApplicationController.delete);

module.exports = router
