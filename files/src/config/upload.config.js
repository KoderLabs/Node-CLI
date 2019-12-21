let code = '';

const makeFileUploadConfig = function (name) {

    code = `
    import * as multer from "multer"; 
    export const FileUploadOptions = {
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./public/attachments/");
            },
            filename: (req, file, cb) => {
                file.uniqueName =
                    Math.random()
                        .toString()
                        .split(".")[1] +
                    Date.now() +
                    file.originalname.substr(file.originalname.length - 30 >= 0 ? file.originalname.length - 30 : 0);
                cb(null, file.uniqueName, file);
            }
        })
    };
    

    
` ;

    return code;

};

module.exports = makeFileUploadConfig;

