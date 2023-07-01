const Router = require('express');
const router = new Router();
const guestRequestController = require("../controllers/guestRequestController");

router.post("/", guestRequestController.create);
router.post("/req", guestRequestController.createRequest);

router.get("/req", guestRequestController.getAll);
router.get("/req/:id", guestRequestController.get);

router.put("/:id", guestRequestController.update);
router.put("req/:id", guestRequestController.updateRequest);

router.delete("/:id", guestRequestController.delete);



router.get("/volunteerForNewApplication", guestRequestController.getAllForNewApplication);
router.get("/volunteerForWorkApplication", guestRequestController.getAllForWorkApplication);
router.get("/volunteerForCompletedApplication", guestRequestController.getAllForCompletedApplication);
router.get("/volunteerForCancelledApplication", guestRequestController.getAllForCanceledApplication);
router.get("/volunteerForNewApplicationFilter", guestRequestController.getAllForNewApplicationFilter);
router.get("/volunteerForWorkApplicationFilter", guestRequestController.getAllForWorkApplicationFilter);
router.get("/volunteerForCompletedApplicationFilter", guestRequestController.getAllForCompletedApplicationFilter);
router.get("/volunteerForCancelledApplicationFilter", guestRequestController.getAllForCancelledApplicationFilter);


router.delete("/admin/:id", guestRequestController.deleteGuestRequest);
router.get("/admin/statusStatistics", guestRequestController.requestStatusStatistics);
router.get("/admin/assistanceStatistics", guestRequestController.requestAssistanceStatistics);
router.get("/admin/complexStatistics", guestRequestController.requestComplexStatistics);

module.exports = router;