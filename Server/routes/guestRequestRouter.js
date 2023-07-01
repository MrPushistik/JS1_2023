const Router = require('express');
const router = new Router();
const guestRequestController = require("../controllers/guestRequestController");

router.post("/", guestRequestController.create);
router.get("/", guestRequestController.getAll);
router.get("/:id", guestRequestController.get);
router.put("/:id", guestRequestController.update);
router.delete("/:id", guestRequestController.delete);
router.post("/req", guestRequestController.createRequest);
router.get("/volunteerForNewApplication", guestRequestController.getAllForNewApplication);
router.get("/volunteerForWorkApplication", guestRequestController.getAllForWorkApplication);
router.get("/volunteerForCompletedApplication", guestRequestController.getAllForCompletedApplication);
router.get("/volunteerForCanceledApplication", guestRequestController.getAllForCanceledApplication);

module.exports = router;