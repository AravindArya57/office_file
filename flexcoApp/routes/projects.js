const router = require('express').Router();
const bodyParser = require('body-parser');
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const fs = require('fs')
const path = require('path')
var geoip = require('geoip-lite');
var requestIp = require('request-ip');

const OwnerController = require('../controllers/ownerController');
const userProject = require('../controllers/projectController');
const UserCategory = require('../controllers/categoryController');
const projectView = require('../controllers/projectViewController');
const CloudS3 = require('../controllers/CloudS3');
const UserFile = require('../controllers/fileController');
const FileOrder = require("../controllers/fileOrderController");
const isLoggedIn = require('../middleware/auth').isLoggedIn;
const Owner = require('../models/owner');

router.get('/', isLoggedIn, async (req, res, next) => {
  const project = new userProject();
  const records = await project.getAllValues('ownerId', req.user.id, ['name', 'uuid']);
  if (records)
    return res.render('myexperience', { projects: records.reverse(),user:req.user.id});
  //   return res.render('projectList', {projects :records})
  // res.render('404', { projectName: 'Unable To Display Projects' })
  return res.render('myexperience', { projects: records,user:req.user.id});
})



/* save new project  */
router.post('/', isLoggedIn, async(req, res, next) => {

  const projectUuid = uuidv4();
  const name = req.body.projectName;
  const ownerId = req.user.id;
  const bucketId = 1;
  const project = new userProject();
  const ownercontroller = new OwnerController();
  
  const ownerDetails = await ownercontroller.getValue('id', ownerId, ['uuid','projectLimit']);
  ownerFolderUuid = ownerDetails.uuid;
  
  const records = await project.getAllValues('ownerId', req.user.id, ['name', 'uuid'])
  if(records.length >= ownerDetails.projectLimit )
    return res.status(409).json({ message: "Project limit exceeded. Please contact administrator" });
  if(ownerDetails.projectLimit==0)
    return res.status(409).json({ message: "Project limit is 0. Please contact administrator and purchase license" });
  

  let dir = path.resolve(__dirname, "../", 'uploads', ownerFolderUuid, projectUuid);
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir)
  else {
    // recreate uuid and check dir exist
    return res.status(409).json({ message: "Try again" });
  }

  // const s3 = new CloudS3();
  // s3.createFolder(ownerFolderUuid, projectUuid)

  var a = project.store(projectUuid, name, ownerId, bucketId);
  res.redirect('back');
  return ;
})


/* form to create new project */
// router.get('/create', isLoggedIn, (req, res) => {
//   res.render('NewProjectForm', { title: "Create New Project", url: "" });
//   return;
// })


/* list all projects of an id */
router.get('/:userid/:projectid', async (req, res, next) => {
  try {
    var clientIp = requestIp.getClientIp(req);
    var geo = geoip.lookup(clientIp);

    const ownercontroller = new OwnerController();
    const project = new userProject();

    const projectDetails = await project.getValue('uuid', req.params.projectid, ['id', 'name','ownerId'])
    let projectName, projectId,ownerId,website;
    if (!projectDetails) {
      Error('Project Not Found')
    }
    
    projectName = projectDetails.name;
    projectId = projectDetails.id;
    ownerId = projectDetails.ownerId;
    const ownerDetails = await ownercontroller.getValue('id', ownerId, ['website']);
    website = ownerDetails.website;

    // update qr scan metric
    const projectViewcontroller = new projectView();
    var a = await projectViewcontroller.store(clientIp, geo.country,geo.region,geo.city,geo.ll[0]+":"+geo.ll[1], ownerId, projectId);
    
    if(!a)
      throw Error(a);

    // get files
    const file = new UserFile();

    console.log(projectId);
    let projectFiles = await file.getAllValues('projectId', projectId, ['uuid', 'type', 'name', 'url', 'uuid','category'])

    let categories = await new UserCategory().getAllValues('ownerId', ownerId, ['name']);
    if(categories)
      categories.unshift({name:"All"});
    else
      categories = [{name:"All"}];

    
    console.log(categories);
    console.log(projectFiles);

    // get order
    const fileOrder = new FileOrder();
    const orderDetails = await fileOrder.getAllValues('projectId', projectDetails.id, ['strOrder']);

    displayFiles = [];
    if (orderDetails) {
      let orderIds = orderDetails[0]['strOrder'].split(',');

      orderIds.forEach(id => {
        var index = projectFiles.findIndex(file => file.uuid == id);
        if (index >= 0) {
          displayFiles.push(projectFiles[index]);
        }
      })
    }
    else {
      displayFiles = projectFiles;
    }
    
    if (!projectFiles || projectFiles.length <= 0) {
      throw Error("No file found for this project");
    }
    res.render(ownerId+'/contents', { hostname: req.hostname, projectName: projectName, files: displayFiles,ownerId:ownerId,website:website,categories:categories})
  }
  catch (err) {
    console.log(err);
    res.render('404', { projectName: err })
  }
});

/* list all projects of an id */
router.get('/:projectid', async (req, res, next) => {
  try {

    var clientIp = requestIp.getClientIp(req);
    var geo = geoip.lookup(clientIp);

    const ownercontroller = new OwnerController();
    const project = new userProject();
    const projectDetails = await project.getValue('uuid', req.params.projectid, ['id', 'name','ownerId'])
    let projectName, projectId,ownerId;
    if (!projectDetails) {
      Error('Project Not Found')
    }

    projectName = projectDetails.name;
    projectId = projectDetails.id;
    ownerId = projectDetails.ownerId;
    const ownerDetails = await ownercontroller.getValue('id', ownerId, ['website']);
    website = ownerDetails.website;

    // update qr scan metric
    const projectViewcontroller = new projectView();
    var a = await projectViewcontroller.store(clientIp, geo.country,geo.region,geo.city,geo.ll[0]+":"+geo.ll[1], ownerId, projectId); 
    if(!a)
      throw Error('Metrics not updated');
      
    // get files
    const file = new UserFile();
    let projectFiles = await file.getAllValues('projectId', projectId, ['uuid', 'type', 'name', 'url', 'uuid','category'])

    let categories = await new UserCategory().getAllValues('ownerId', ownerId, ['name']);
    if(categories)
      categories.unshift({name:"All"});
    else
      categories = [{name:"All"}];

    console.log(categories);

    // get order
    const fileOrder = new FileOrder();
    const orderDetails = await fileOrder.getAllValues('projectId', projectDetails.id, ['strOrder']);

    displayFiles = [];
    if (orderDetails) {
      let orderIds = orderDetails[0]['strOrder'].split(',');

      orderIds.forEach(id => {
        var index = projectFiles.findIndex(file => file.uuid == id);
        if (index >= 0) {
          displayFiles.push(projectFiles[index]);
        }
      })
    }
    else {
      displayFiles = projectFiles;
    }
    
    if (!projectFiles || projectFiles.length <= 0) {
      throw Error("No file found for this project");
    }
    res.render(ownerId+'/contents', { hostname: req.hostname, projectName: projectName, files: displayFiles,ownerId:ownerId,website:website,categories:categories })
  }
  catch (err) {
    res.render('404', { projectName: err })
  }
});


/**
 * edit route
*/

router.get('/edit/:userid/:id', isLoggedIn, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userid;
  try {
    const project = await new userProject().getValue('uuid', projectId, ['id', 'name', 'ownerId']);

    if (!project || project.ownerId !== req.user.id)
      throw "Invalid Project";

    const projectFiles = await new UserFile().getAllValues('projectId', project.id, ['type', 'name', 'url', 'uuid','category']);

    if (!projectFiles)
      throw "No Files Present";

    let categories = await new UserCategory().getAllValues('ownerId', project.ownerId, ['name']);
    if(categories)
      categories.unshift({name:"All"});
    else
      categories = [{name:"All"}];
    // view sorting
    const fileOrder = new FileOrder();
    const orderDetails = await fileOrder.getAllValues('projectId', project.id, ['strOrder']);

    displayFiles = [];
    if (orderDetails) {
      let orderIds = orderDetails[0]['strOrder'].split(',');

      orderIds.forEach(id => {
        var index = projectFiles.findIndex(file => file.uuid == id);
        if (index >= 0) {
          if(projectFiles[index].category=="")
            projectFiles[index].category="All";
          displayFiles.push(projectFiles[index]);
        }
      })
    }
    else {
      displayFiles = projectFiles;
    }

    return res.render(userId+'/editProject', { projects: displayFiles, uuid: projectId, projectName: project.name,ownerId: userId,categories:categories});

  } catch (error) {
    console.log(`caught error while editing file - Error : ${error}`);
    return res.render('editProject', { uuid: projectId, error: error });
  }

});





router.patch("/:id", isLoggedIn, async (req, res) => {

  try {

    const { projectName } = req.body;
    const projectUuId = req.params.id;

    if (projectName.length > 50)
      throw "project name should be max of 50 characters";

    // get file details
    const project = new userProject();
    const projectToUpdate = await project.getUserProject({ uuid: projectUuId, ownerId: req.user.id }, ['id', 'name']);


    if (!projectToUpdate)
      throw projectUuId+" Unable to update current project";

    if (projectToUpdate.name !== projectName) {
      const response = await project.updateField('id', projectToUpdate.id, 'name', projectName);
      if (response[0] !== 1) {
        throw "Unable to Update at the moment";
      }
    }

    if (req.xhr)
      return res.status(204).json({ message: "success", status: "success" }).end();
    return res.redirect('back');


  } catch (error) {
    console.log(`caught error while updating project name Error - : ${error}`);
    if (req.xhr)
      return res.status(400).json({ message: error, status: "failure" }).end();
    return redirect('back');

  }
});

/* end edit */

router.delete('/:ownerid/:id', isLoggedIn, async (req, res) => {
  try {
    const projectUuid = req.params.id;
    const project = new userProject();
    const projectDetails = await project.getValue('uuid', projectUuid, ['id','ownerId']);
    const owner = new OwnerController();
    const ownerDetails = await owner.getValue('id', projectDetails.ownerId, ['uuid']);
    // invalid project id sent
    if (!projectDetails)
      throw { message: "Unable delete record at the moment", logMessage: "Error while deleting a record from database \n " };

    // get all files belongs to the project
    const file = new UserFile();
    const projectFiles = await file.getAllValues('projectId', projectDetails.id, ['id', 'uuid', 'extension']);

    // delete project record on db
    const projectDeleteResponse = await project.delete('id', projectDetails.id);

    if (!projectDeleteResponse)
      throw { message: "Unable delete record at the moment", logMessage: "Error while deleting a record from database" };


    // if any file associated with the project 
    // delete file
    // delete record on db
    if (projectFiles) {
      const s3 = new CloudS3();
      projectFiles.forEach(projectFile => {

        console.log(ownerDetails.uuid+" "+projectUuid+" "+projectFile.uuid+" "+projectFile.extension);
        // remove local file
        removeFile(path.join('uploads',ownerDetails.uuid, projectUuid, projectFile.uuid + projectFile.extension));
        
        // delete file on s3
        let filePath =
          req.user.uuid + '/' +
          projectUuid + '/' +
          projectFile.uuid + projectFile.extension;
        s3.deleteFile(filePath);

        // delete record on db
        file.delete('id', projectFile.id);
      })
      console.table(projectFiles);
    }

    // remove project dir
    removeDir(path.join('uploads', ownerDetails.uuid, projectUuid));

    if (req.xhr)
      return res.status(204).json({ message: "success", status: "success" }).end();
    return res.redirect('back');
  }

  catch (error) {
    console.log(`caught error while deleting file error - : ${error}`);
    console.log(error)

    if (req.xhr)
      return res.status(400).json({ message: error.message, status: "failure" }).end();
    return res.redirect('back');
  }

});
/* end delete */
/* all other routes */
router.all('*', (req, res) => {
  res.render('404', { projectName: 'Project Not Found' })
})



/**
 * remove project folder from given path
 * @param {string} folderPath path to remove
 * returns 
 */
 async function removeDir(folderPath) {
  console.log(` deleting file from path : ${folderPath}`);
  fs.rmdir(path.resolve(folderPath), (err) => {
    if (err) {
      console.log(err)
      console.log(`error deleting local folder from path ${folderPath}`);
      throw err;
    }
  });
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
      console.log(err)
      console.log(`error removing  file from path ${filePath}`);
      throw err;
    }
  });
}

module.exports = router;
