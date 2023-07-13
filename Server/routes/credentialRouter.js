const Router = require('express');
const router = new Router();
const CredentialController = require("../controllers/credentialController");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/",checkRole('ADMIN'), CredentialController.create);
router.get("/",checkRole('ADMIN'), CredentialController.getAll);
router.get("/:id",checkRole('ADMIN'), CredentialController.get);
router.put("/:id",checkRole('ADMIN'), CredentialController.update);
router.delete("/:id",checkRole('ADMIN'), CredentialController.delete);
router.put("/password/:id",checkRole('ADMIN'), CredentialController.updatePassword); 

module.exports = router;