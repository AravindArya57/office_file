const router = require('express').Router();
const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid/v4')

/* configuration files */
const upload = require('../middleware/multer-diskStorage')

/* Required Controllers */
const Owner = require('../controllers/ownerController')
const UserFile = require('../controllers/fileController')
const UserProject = require('../controllers/projectController')
const UserCategory = require('../controllers/categoryController')
const FileOrder = require("../controllers/fileOrderController");
const CloudS3 = require('../controllers/CloudS3')
const isLoggedIn = require('../middleware/auth').isLoggedIn;
const Project = require('../models/projects');
const { Console } = require('console');

/* check user authenticated for all routes */
router.all('*', isLoggedIn);

router.get('/create', async (req, res) => {
  if (req.query.id) {
    projectUUID = decodeURI(req.query.id);
    const project = await new UserProject().getValue('uuid', projectUUID, ['ownerId', 'name']);
    const categories = await new UserCategory().getAllValues('ownerId', project.ownerId, ['name']);
    if (Object.keys(project).length && project.ownerId == req.user.id)
      return res.render('ar', { title: project.name, uuid: projectUUID, categories:categories });
  }
  return res.redirect('/projects')
});

router.get('/:projectUuid', async (req, res) => {
  const { id } = await new UserProject().getValue('uuid', req.params.projectUuid, ['id']);
  if (!id)
    return res.render('404');
  const file = await new UserFile().getUserFiles({ projectId: id, ownerId: req.user.id }, ['uuid', 'extension', 'type', 'name']);
  console.table(file);
});

/**
 * sends json response; suitable for ajax
 * doesnot redirect
 */
router.post('/', (req, res) => {
  try {
    if (!req.user) {
      throw "usernot logged in";
    }
    upload(req, res, async (err) => {
      try {
        if(req.body.url=="" || !req.body.url)
        {
            // console.log(`user id :: ${req.user.id}`);
            let errCode, error = '';
            /* custom errors  */
            if (!req.files['fileUpload']) errCode = 'LIMIT_NO_FILE'
            if (err || errCode) {
              if (err) errCode = err.code;
              switch (errCode) {

                /* multer error cases */
                case 'LIMIT_FILE_SIZE': err = 'File too large';
                  break;
                case 'LIMIT_FILE_COUNT': err = 'Too many files';
                  break;
                case 'LIMIT_PART_COUNT': err = 'Too many parts';
                  break;
                case 'LIMIT_FIELD_KEY': err = 'Field name too long';
                  break;
                case 'LIMIT_FIELD_VALUE': err = 'Field value too long';
                  break;
                case 'LIMIT_FIELD_COUNT': err = 'Too many fields';
                  break;
                case 'LIMIT_UNEXPECTED_FILE': err = 'Unexpected field';
                  break;

                /* custom error cases */
                case 'LIMIT_NO_FILE': err = 'NO FILE';
                  break;
                default:
                  // console.log("non hadled error ");
                  break;
              }
            }

            else {

              let displayName = '', FileUuid = ''; // from multer and user
              let projectId, projectFolderUuid;
              let ownerId, ownerFolderUuid; // get it from db
              let contentType = [['.jpg', '.jpeg', '.png'], ['.mp4', '.mkv'], ['.obj', '.fbx'], ['.pdf']];
              let fileExtension;

              ownerId = req.user.id;

            //production - ownerFolderUuid = req.user.uuid;
            //Dev /*
              const owner = new Owner();
              const ownerDetails = await owner.getValue('id', ownerId, ['uuid']);
              ownerFolderUuid = ownerDetails.uuid;
            // */


              let uploadedFile = req.files['fileUpload'][0];

              displayName = req.body.filename;
              category = req.body.category;
              let temp = uploadedFile.originalname;
              temp = temp.split(".");
              fileExtension = '.' + temp.pop().toLocaleLowerCase().trim();
              if (!req.body.filename) {
                temp = temp.join();
                displayName = temp;
              }

              let filename = uploadedFile.filename;
              FileUuid = filename.split('.')[0];


              /* dont check only etension check mime type and/or magic number */
              /*
                * 0 - image
                * 1- video
                * 2- video
                * 3 - pdf
              */
              let type = (contentType[1].includes(fileExtension)) ? 1 : (contentType[3].includes(fileExtension)) ? 3 : -1;

              if (type < 0) {
                removeFile(uploadedFile.path)
                console.log(`user uploaded file type ${fileExtension}`);
                throw "Invalid File Type.";
              }

              const project = new UserProject();

              const record = await project.getValue('uuid', req.body.uuid, ['id', 'uuid']);
              // console.log(record);
              if (record) {
                projectId = record.id;
                projectFolderUuid = record.uuid
              }
              else {
                // project Id not found
                removeFile(path.resolve(uploadedFile.path));
                throw "Invalid Project ID";
              }


              let sourcePath = path.resolve(__dirname, '../', uploadedFile.path);
              let destPath = path.resolve(__dirname, "../", 'uploads', ownerFolderUuid, projectFolderUuid, FileUuid);
              destPath = destPath + fileExtension;

              const file = new UserFile();
              await file.store(FileUuid, fileExtension, displayName, ownerId, projectId,category, type, '');


              // update view order
              const fileOrder = new FileOrder();
              const orderDetails = await fileOrder.getAllValues('projectId', projectId, ['strOrder']);

              if(!orderDetails)
                fileOrder.store(projectId, FileUuid);
              else
              {
                let orderIds = orderDetails[0].strOrder + ',' + FileUuid;
                fileOrder.updateOrder(projectId, orderIds);

              }

              /* moving file from temp to destination */
              fs.copyFileSync(sourcePath, destPath);
              fs.unlink(sourcePath, (err) => {
                if (err) throw err;
              })
              /* end of file moving */

              // const s3 = new CloudS3();
              // const bucketPath = (ownerFolderUuid + '/' + projectFolderUuid); // if needed get the bucket name here and pass it
              // s3.upload(bucketPath, filename, destPath);
            }

            if (req.xhr) {

              if (err)
                return res.status(400).json({ message: err, status: "failure" }).end();
              return res.status(200).json({ message: "file creation success", status: "success" }).end();
            }
            error = encodeURIComponent(err);
            return res.redirect('file/create?error=' + err);
        }
        else
        {
            
            let ownerId = req.user.id;
            //production - ownerFolderUuid = req.user.uuid;
            //Dev /*
            const owner = new Owner();
            const ownerDetails = await owner.getValue('id', ownerId, ['uuid']);
            let ownerFolderUuid = ownerDetails.uuid;
            // */
            let FileUuid = uuidv4(); // from multer and user
            let displayName = req.body.filename;
            let category = req.body.category;
            let url = req.body.url;
            const project = new UserProject();
            let type = 4;
            let projectId, projectFolderUuid;

            const record = await project.getValue('uuid', req.body.uuid, ['id', 'uuid']);
            if (record) 
            {
              projectId = record.id;
              projectFolderUuid = record.uuid
            }
            else 
            {
              throw "Invalid Project ID";
            }

            const file = new UserFile();
            await file.store(FileUuid, '', displayName, ownerId, projectId,category, type,url);
            // update view order
            const fileOrder = new FileOrder();
            const orderDetails = await fileOrder.getAllValues('projectId', projectId, ['strOrder']);

            if(!orderDetails)
              fileOrder.store(projectId, FileUuid);
            else
            {
              let orderIds = orderDetails[0].strOrder + ',' + FileUuid;
              fileOrder.updateOrder(projectId, orderIds);

            }
            if (req.xhr) {

              if (err)
                return res.status(400).json({ message: err, status: "failure" }).end();
              return res.status(200).json({ message: "file creation success", status: "success" }).end();
            }
            error = encodeURIComponent(err);
            return res.redirect('file/create?error=' + err);
        }
      }
      catch (err) {
        console.log(`caught error ${err}`);
        if (req.xhr)
          return res.status(400).json({ message: err, status: "failure" }).end();
        return res.redirect('/file/create?error=' + err);
      }
    });
  }
  catch (err) {
    console.log(err);
    if (req.xhr)
      return res.status(400).json({ message: err, status: "failure" }).end();
    return res.redirect('/file/create?error=' + err);
  }
})

router.patch("/:id", async (req, res) => {
  try {

    const { fileName,category } = req.body;
    const fileUuId = req.params.id;

    if(fileName)
    if (fileName.length > 50)
      throw "fileName should be max of 50 characters";

    // get file details
    const file = new UserFile();
    const fileToUpdate = await file.getUserFiles({ uuid: fileUuId, ownerId: req.user.id }, ['id', 'name','category']);

    if (!fileToUpdate)
      throw "Unable to update current file";

    if(fileName)
    if (fileToUpdate.name !== fileName) {
      const response = await file.updateField('id', fileToUpdate.id, 'name', fileName);
      if (response[0] !== 1) {
        console.log("coming here");
        throw "Unable to Update at the moment";
      }
    }

    if(category)
    if (fileToUpdate.category !== category) {
      const response = await file.updateField('id', fileToUpdate.id, 'category', category);
      if (response[0] !== 1) {
        console.log("coming here 2");
        throw "Unable to Update at the moment";
      }
    }


    if (req.xhr)
      return res.status(204).json({ message: "success", status: "success" }).end();
    return res.redirect('back');


  } catch (error) {
    console.log(`caught error while updating file name Error - : ${error}`);
    if (req.xhr)
      return res.status(400).json({ message: error, status: "failure" }).end();
    return redirect('back');

  }
});

router.patch('/order/:id', async (req, res) => {
  try {
    const projectuuId = req.params.id;
    const { newOrder } = req.body;
    const newOrderArray = newOrder.split(',');

    // get projectUuid
    const project = new UserProject();
    const projectDetails = await project.getUserProject({ uuid: projectuuId }, ['id']);
    if (!projectDetails)
      throw "Unable to update new Order";
  
    // fetch file details
    const file = new UserFile();
    const fileDetails = await file.getUserFiles({ projectId: projectDetails.id }, ['uuid']);
    if (!fileDetails)
      throw "Unable to update new order";

    const fileUuid = fileDetails.map(file => file.uuid);

    // check whether only valid ids are sent
    if (!newOrderArray.every(val => fileUuid.includes(val))) {
      throw fileUuid;
    }
    // console.log(fileUuid, newOrderArray);

    // get old order
    const fileOrder = new FileOrder();
    const orderDetails = await fileOrder.getValue('projectId', projectDetails.id, ['id', 'strOrder']);

    // if exist update else insert
    let response = '';
    if (!orderDetails) {
      response = await fileOrder.store(projectDetails.id, newOrder)
    }
    else {
      response = await fileOrder.updateOrder(projectDetails.id, newOrder);
      response = response[0];
    }

    console.log(response);
    // return response
    if (!response)
      throw "Unable to update";
    if (req.xhr)
      return res.status(204).json({ message: "success", status: "success" }).end();
  }
  catch (error) {
    console.log(`caught error while updating order of file view Error - : ${error}`);

    if (req.xhr)
      return res.status(400).json({ message: error, status: "failure" }).end();
    return res.status(400).render('fileEdit', { message: error, status: "success" });
  }
});

//  functions ///////////////////////////////////////////
async function getProjectName(ownerId) {
  /*
      * get user folder
      * now its hardcoded
  */
  const project = new UserProject();
  let projectName = []
  const records = await project.getAllValues('ownerId', ownerId, ['name'])
  if (records !== 0 && records !== null && records.length > 0) {
    records.forEach((record) => { projectName.push(record.name) })
    return projectName
  }
  return project
}

/**
 * remove file from given path
 * @param {string} filePath path to remove
 * returns 
 */
async function removeFile(filePath) {
  fs.unlink(path.resolve(filePath), (err) => {
    if (err) {
      console.log(`error removing temp file from path ${filePath}`);
      throw err;
    }
  });
}

// end functions ///////////////////////////////


/**
 * delete a file
 * requires valid file uuid in params
 */
 router.delete('/:id', async (req, res, next) => {

  try {
    const fileUuid = req.params.id;
    const file = new UserFile();
    const owner = new Owner();
    const fileToDelete = await file.getUserFiles({ uuid: fileUuid }, ['id', "projectId", 'extension']);
    // check file id passed is valid
    if (!fileToDelete)
      throw { message: "Unable to delete current File", logMessage: "Error while fetching user file to delete. Invalid fileId supplied" }

    const projectDetails = await new UserProject().getValue('id', fileToDelete.projectId, ['uuid','ownerId']);
    const ownerDetails = await owner.getValue('id', projectDetails.ownerId, ['uuid']);
    const deleteResponse = await file.delete('uuid', fileUuid);
    removeFile(path.join('uploads', ownerDetails.uuid, projectDetails.uuid, fileUuid + fileToDelete.extension));

    if (!deleteResponse)
      throw { message: "Unable delete record at the moment", logMessage: "Error while deleting a record from database" };

    // remove file order from order table
    const fileOrder = new FileOrder();
    const orderDetails = await fileOrder.getAllValues('projectId', fileToDelete.projectId, ['strOrder']);
    const oldOrder = orderDetails[0].strOrder.split(',');
    const newOrder = oldOrder.filter(element => element != fileUuid);
    const newOrderStr = newOrder.join(',');

    fileOrder.updateOrder(fileToDelete.projectId, newOrderStr);

    // remove file from s3
    const s3 = new CloudS3();
    const filePath =
      req.user.uuid + '/' +
      projectDetails.uuid + '/' +
      fileUuid + fileToDelete.extension;

    s3.deleteFile(filePath);

    if (req.xhr)
      return res.status(204).json({ message: "success", status: "success" }).end();
    return res.redirect('back');

  }
  catch (error) {
    console.log(`caught error while deleting file error - : ${error}`);

    if (req.xhr)
      return res.status(400).json({ message: error, status: "failure" }).end();
    return res.status(400).render('fileEdit', { message: error, status: "success" });
  }

});


//  functions ///////////////////////////////////////////

async function getProjectName(ownerId) {

  /*
      * get user folder
      * now its hardcoded
  */
  const project = new UserProject();
  let projectName = []
  const records = await project.getAllValues('ownerId', ownerId, ['name'])
  if (records !== 0 && records !== null && records.length > 0) {
    records.forEach((record) => { projectName.push(record.name) })
    return projectName
  }
  return project
}


/**
 * remove file from given path
 * @param {string} filePath path to remove
 * returns 
 */
async function removeFile(filePath) {
  console.log(` deleting file from path : ${filePath}`);
  fs.unlink(path.resolve(filePath), (err) => {
    if (err) {
      console.log(`error removing temp file from path ${filePath}`);
      throw err;
    }
  });
}


// check user logged in - useful when using ajax request
// router.all('*', async(req,res, next)=>{
//   try {
//     if(! req.user)
//       throw "user not logged in";
//   } catch (error) {
//     if (req.xhr)
//       return res.status(401).json({ message: error, status: "failure" }).end();
//     res.redirect(302, 'back');
//   }
//   next();
// });




/* show a form to create youtube link */
// router.get('/create/link', async (req, res) => {
//   const projectName = await getProjectName(1);
//   if (projectName.length)
//     return res.render('videoLink', { title: 'UploadForm', projectName: projectName })
//   return res.redirect('/projects/create')
// })

// /* to provide text - url of video */
// router.post('/link', isLoggedIn, async (req, res) => {

//   const FileUuid = uuidv4();
//   const fileExtension = '.txt';
//   const displayName = req.body.filename;
//   const url = req.body.url;
//   const ownerId = req.user.id;
//   let projectId = '';
//   const type = 1;

//   const project = new UserProject();
//   const record = await project.getValue('uuid', req.body.uuid, ['id', 'uuid']);

//   if (record)
//     projectId = record.id;
//   const file = new UserFile();
//   file.store(FileUuid, fileExtension, displayName, ownerId, projectId, type, url);
//   res.redirect('/file/create/link')
// });

module.exports = router;