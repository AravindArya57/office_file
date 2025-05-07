const multer = require('multer');
const path = require('path')
const uuidv4 = require('uuid/v4')

/* body parser does not work with multi-part form data; therefore use multer */

/* Defining storage rules */
const storage = multer.diskStorage(
    {
        destination: './uploads/temp/', 

        filename: (req, file, cb) => {
            cb(null, uuidv4() + path.extname(file.originalname))
        },
    });


const upload = multer(

    {
        storage: storage, // type of storage

        /* max file size in bytes; here 100MB */
        limits: {
            fileSize: 100 * 1024 * 1024,
        },
    })
    .fields([
        {
            name: "fileUpload", // html file form field name
            maxCount: 1          // max number of file user can upload
        }
    ]);

/*
    *    .fields
    * can accept mix of files
    * can parse both text and image fields 
 */

/* 
 * err case from multer
     'LIMIT_PART_COUNT': 'Too many parts',
     'LIMIT_FILE_SIZE': 'File too large',
     'LIMIT_FILE_COUNT': 'Too many files',
     'LIMIT_FIELD_KEY': 'Field name too long',
     'LIMIT_FIELD_VALUE': 'Field value too long',
     'LIMIT_FIELD_COUNT': 'Too many fields',
     'LIMIT_UNEXPECTED_FILE': 'Unexpected field'
*/
module.exports = upload;