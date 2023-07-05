const Router = require('express');
const router = new Router();
const guestRequestController = require("../controllers/guestRequestController");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/",checkRole('ADMIN'), guestRequestController.create);
router.post("/req",checkRole('VOLUNTEER'), guestRequestController.createRequest);

router.get("/",checkRole('ADMIN'), guestRequestController.getAll);
router.get("/req",checkRole('VOLUNTEER'), guestRequestController.getAll);

router.get("/:id",checkRole('ADMIN'), guestRequestController.get);
router.get("/req/:id",checkRole('VOLUNTEER'), guestRequestController.get);

router.put("/:id",checkRole('ADMIN'), guestRequestController.update);
router.put("req/:id",checkRole('VOLUNTEER'), guestRequestController.updateRequest);

router.delete("/:id",checkRole('ADMIN'), guestRequestController.delete);



router.get("/volunteerForNewApplication",checkRole('VOLUNTEER'), guestRequestController.getAllForNewApplication);
router.get("/volunteerForWorkApplication",checkRole('VOLUNTEER'), guestRequestController.getAllForWorkApplication);
router.get("/volunteerForCompletedApplication",checkRole('VOLUNTEER'), guestRequestController.getAllForCompletedApplication);
router.get("/volunteerForCancelledApplication",checkRole('VOLUNTEER'), guestRequestController.getAllForCanceledApplication);
router.get("/volunteerForNewApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForNewApplicationFilter);
router.get("/volunteerForWorkApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForWorkApplicationFilter);
router.get("/volunteerForCompletedApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForCompletedApplicationFilter);
router.get("/volunteerForCancelledApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForCancelledApplicationFilter);

router.get("/fullRequest/:id",checkRole("VOLUNTEER"), guestRequestController.getFullRequest);


router.delete("/admin/:id",checkRole('ADMIN'), guestRequestController.deleteGuestRequest);
router.get("/admin/statusStatistics",checkRole('ADMIN'), guestRequestController.requestStatusStatistics);
router.get("/admin/assistanceStatistics",checkRole('ADMIN'), guestRequestController.requestAssistanceStatistics);
router.get("/admin/complexStatistics",checkRole('ADMIN'), guestRequestController.requestComplexStatistics);

module.exports = router;



