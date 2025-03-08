const express = require("express");
const multer = require("multer");
const { extractText } = require("../controllers/extractController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/extract-pdf", upload.single("file"), extractText);

module.exports = router;