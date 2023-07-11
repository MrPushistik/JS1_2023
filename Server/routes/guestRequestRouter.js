const Router = require('express');
const router = new Router();
const guestRequestController = require("../controllers/guestRequestController");
const checkRole = require('../middleware/checkRoleMiddleware')
const testRole = require('../middleware/testRoleMiddleware')

//router.post("/admin/req",checkRole('ADMIN'), guestRequestController.create);
router.post("/volunteer/req", guestRequestController.createRequest);

//router.get("/admin/reqs",checkRole('ADMIN'), guestRequestController.getAll);
//router.get("/volunteer/req",checkRole('VOLUNTEER'), guestRequestController.getAll);

//router.get("/admin/req/:id",checkRole('ADMIN'), guestRequestController.get);
//router.get("/volunteer/req/:id",checkRole('VOLUNTEER'), guestRequestController.get);

//router.put("/admin/req/:id",checkRole('ADMIN'), guestRequestController.update); 
//router.put("/volunteer/req/update/:id",checkRole('VOLUNTEER'), guestRequestController.updateRequest);
router.put("/volunteer/req/updateStatus/:id",testRole(['VOLUNTEER','ADMIN']), guestRequestController.updateStatus); 
router.put("/volunteer/req/updateAssistance/:id",testRole(['VOLUNTEER',"ADMIN"]), guestRequestController.updateAssistance); 

router.delete("/admin/req/:id",checkRole('ADMIN'), guestRequestController.delete);

router.get("/volunteer/forNewApplication", testRole(['VOLUNTEER','ADMIN']), guestRequestController.getAllForNewApplication);
router.get("/volunteer/forWorkApplication",  testRole(['VOLUNTEER','ADMIN']),  guestRequestController.getAllForWorkApplication);
router.get("/volunteer/forCompletedApplication",  testRole(['VOLUNTEER','ADMIN']), guestRequestController.getAllForCompletedApplication);
router.get("/volunteer/forCancelledApplication", testRole(['VOLUNTEER','ADMIN']), guestRequestController.getAllForCanceledApplication);

//router.get("/volunteer/forNewApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForNewApplicationFilter);
//router.get("/volunteer/forWorkApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForWorkApplicationFilter);
//router.get("/volunteer/forCompletedApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForCompletedApplicationFilter);
//router.get("/volunteer/forCancelledApplicationFilter",checkRole('VOLUNTEER'), guestRequestController.getAllForCancelledApplicationFilter);

router.get("/volunteer/fullRequest/:id", testRole(['VOLUNTEER','ADMIN']), guestRequestController.getFullRequest);

router.delete("/admin/req/:id",checkRole('ADMIN'), guestRequestController.deleteGuestRequest);
router.get("/admin/statusStatistics",checkRole('ADMIN'), guestRequestController.requestStatusStatistics);
router.get("/admin/assistanceStatistics",checkRole('ADMIN'), guestRequestController.requestAssistanceStatistics);
router.get("/admin/complexStatistics",checkRole('ADMIN'), guestRequestController.requestComplexStatistics);

module.exports = router;



