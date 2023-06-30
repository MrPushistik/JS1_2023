const Router = require('express');
const router = new Router();
const CredentialController = require("../controllers/credentialController");

router.post("/", CredentialController.create);
router.get("/", CredentialController.getAll);
router.get("/:id", CredentialController.get);
router.put("/:id", CredentialController.update);
router.delete("/:id", CredentialController.delete);

module.exports = router;