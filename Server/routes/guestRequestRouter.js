const Router = require('express');
const router = new Router();
const guestRequestController = require("../controllers/guestRequestController");

router.post("/", guestRequestController.create);
router.get("/", guestRequestController.getAll);
router.get("/:id", guestRequestController.get);
router.put("/:id", guestRequestController.update);
router.delete("/:id", guestRequestController.delete);

module.exports = router;