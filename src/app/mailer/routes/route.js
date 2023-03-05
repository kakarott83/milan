const router = require("express").Router();

const { signUp, getBill, strato } = require("../controller/appController");

/*Http Request*/
router.post("/user/signup", signUp);
router.post("/products/getBill", getBill);
router.post("/products/strato", strato);

module.exports = router;
