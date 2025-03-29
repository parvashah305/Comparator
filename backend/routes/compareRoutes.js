const express = require("express");
const multer = require("multer");
const { compareFiles } = require("../controllers/comapreController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/compare", upload.fields([{ name: "file1" }, { name: "file2" }]), compareFiles);

module.exports = router;