const express=require('express')
const multer=require('multer')
const {summarizeFiles}=require('../controllers/summarizeController')

const router=express.Router()

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/')
    },
    filename:function(req,file,cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const upload=multer({storage:storage})


router.post(
    "/summarize-files",
    upload.fields([{ name: "file1" }, { name: "file2" }]),
    summarizeFiles
);

module.exports = router;