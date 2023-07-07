const Router = require('express');
const router = new Router();
const CredentialController = require("../controllers/credentialController");
const checkRole = require('../middleware/checkRoleMiddleware')

router.post("/",checkRole('ADMIN'), CredentialController.create); //!!! -CHECKROLE
router.get("/",checkRole('ADMIN'), CredentialController.getAll); //!!! -CHECKROLE
router.get("/:id",checkRole('ADMIN'), CredentialController.get); //!!! -CHECKROLE
router.put("/:id",checkRole('ADMIN'), CredentialController.update); //!!! -CHECKROLE
router.delete("/:id",checkRole('ADMIN'), CredentialController.delete); //!!! -CHECKROLE

module.exports = router;