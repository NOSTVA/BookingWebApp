const express = require("express");
const router = express.Router();

const applicantController = require("../controllers/applicant");

router.delete("/:id", applicantController.delete_applicant);
router.patch("/:id", applicantController.update_applicant);

module.exports = router;
