import multer from 'multer'





export const validationObject = {
    image:['image/png', 'image/jpeg'],
    files:['application/pdf']
}




export const multerFunctionCoudinary = ({filevalidation=validationObject.image} ={}) => {
  
  
      const storage = multer.diskStorage({})
  
      const fileFilter = (req,file,cb) => {
        if (filevalidation.includes(file.mimetype)) {
          cb(null,true)
        }else{
          return cb(new Error('Invalid file type/extension'),false)
        }
      }
      
  
  
  
  const uploads = multer({fileFilter,storage})
  return uploads
  }
