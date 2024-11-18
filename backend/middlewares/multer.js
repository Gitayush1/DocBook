import multer from 'multer'

const storage = multer.diskStorage({
    fileName: function(req,file,callback){
        callback(null,file.orginalname)
    }
})

const upload = multer({storage})

export default upload