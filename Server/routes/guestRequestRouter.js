const Router = require('express');
const router = new Router();
const guestRequestController = require("../controllers/guestRequestController");
const checkRole = require('../middleware/checkRoleMiddleware')
const testRole = require('../middleware/testRoleMiddleware')

router.post("/admin/req",checkRole('ADMIN'), guestRequestController.create); //!!! -CHECKROLE
router.post("/volunteer/req",checkRole('VOLUNTEER'), guestRequestController.createRequest); //!!! -CHECKROLE

router.get("/admin/reqs",checkRole('ADMIN'), guestRequestController.getAll); //!!! -CHECKROLE
router.get("/volunteer/req",checkRole('VOLUNTEER'), guestRequestController.getAll); //!!! -CHECKROLE

router.get("/admin/req/:id",checkRole('ADMIN'), guestRequestController.get); //!!! -CHECKROLE
router.get("/volunteer/req/:id",checkRole('VOLUNTEER'), guestRequestController.get); //!!! -CHECKROLE

router.put("/admin/req/:id",checkRole('ADMIN'), guestRequestController.update); //!!! -CHECKROLE
router.put("/volunteer/req/update/:id",checkRole('VOLUNTEER'), guestRequestController.updateRequest); //!!! -CHECKROLE
router.put("/volunteer/req/updateStatus/:id",checkRole('VOLUNTEER'), guestRequestController.updateStatus); //!!! -CHECKROLE
router.put("/volunteer/req/updateAssistance/:id",checkRole('VOLUNTEER'), guestRequestController.updateAssistance); //!!! -CHECKROLE


router.delete("/admin/req/:id",checkRole('ADMIN'), guestRequestController.delete); //!!! -CHECKROLE

router.get("/volunteer/forNewApplication", testRole(['VOLUNTEER','ADMIN']), guestRequestController.getAllForNewApplication);
router.get("/volunteer/forWorkApplication",  testRole(['VOLUNTEER','ADMIN']),  guestRequestController.getAllForWorkApplication);
router.get("/volunteer/forCompletedApplication",  testRole(['VOLUNTEER','ADMIN']), guestRequestController.getAllForCompletedApplication);
router.get("/volunteer/forCancelledApplication", testRole(['VOLUNTEER','ADMIN']), guestRequestController.getAllForCanceledApplication);

router.get("/volunteer/forNewApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForNewApplicationFilter);
router.get("/volunteer/forWorkApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForWorkApplicationFilter);
router.get("/volunteer/forCompletedApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForCompletedApplicationFilter);
router.get("/volunteer/forCancelledApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForCancelledApplicationFilter);

router.get("/volunteer/fullRequest/:id", checkRole('VOLUNTEER'), guestRequestController.getFullRequest);


router.delete("/admin/req/:id",checkRole('ADMIN'), guestRequestController.deleteGuestRequest);//!!! -CHECKROLE
router.get("/admin/statusStatistics",checkRole('ADMIN'), guestRequestController.requestStatusStatistics);//!!! -CHECKROLE
router.get("/admin/assistanceStatistics",checkRole('ADMIN'), guestRequestController.requestAssistanceStatistics);//!!! -CHECKROLE
router.get("/admin/complexStatistics",checkRole('ADMIN'), guestRequestController.requestComplexStatistics); //!!! -CHECKROLE

module.exports = router;



