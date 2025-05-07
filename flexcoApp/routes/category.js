const router = require('express').Router();
const bodyParser = require('body-parser');
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const fs = require('fs')
const path = require('path')
var geoip = require('geoip-lite');
var requestIp = require('request-ip');

const OwnerController = require('../controllers/ownerController');
const userCategory = require('../controllers/categoryController');
const userFile = require('../controllers/fileController');
const isLoggedIn = require('../middleware/auth').isLoggedIn;
const Owner = require('../models/owner');

router.get('/', isLoggedIn, async (req, res, next) => {
  const category = new userCategory();
  const records = await category.getAllValues('ownerId', req.user.id, ['name','id'])
  return res.render('category', { categories: records,user:req.user.id});
  
})

/* save new project  */
router.post('/', isLoggedIn, async(req, res, next) => {

    const name = req.body.categoryName;
    const ownerId = req.user.id;
    const category = new userCategory();
    var a = category.store( name, ownerId);
    return res.redirect('back');
});

router.patch("/:id", isLoggedIn, async (req, res) => {

  try {

    const { categoryName } = req.body;
    const categoryId = req.params.id;

    if (categoryName.length > 50)
      throw "category name should be max of 50 characters";

    // get file details
    const category = new userCategory();
    const categoryToUpdate = await category.getUserCategory({ id: categoryId }, ['id', 'name','ownerId']);

    const file = new userFile();
    const projectFiles = await file.getAllValues('ownerId', categoryToUpdate.ownerId, ['id', 'category']);

    const oldname = categoryToUpdate.name;
    

    if (!categoryToUpdate)
      throw categoryId+" Unable to update current category";

    if (categoryToUpdate.name !== categoryName) {
      const response = await category.updateField('id', categoryToUpdate.id, 'name', categoryName);
      if (response[0] !== 1) {
        throw "Unable to Update at the moment";
      }
      else
      {
        for(let i=0;i<projectFiles.length;i++)
        {
          if(projectFiles[i].category == oldname)
          {
            const response2 = await file.updateField('id', projectFiles[i].id, 'category', categoryName);
            if (response2[0] !== 1) {
              throw "Unable to Update at the moment";
            }
          }
        }
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


router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = new userCategory();
    const categoryToUpdate = await category.getUserCategory({ id: categoryId }, ['id', 'name','ownerId']);
    
    const oldname = categoryToUpdate.name;
    const file = new userFile();
    const projectFiles = await file.getAllValues('ownerId', categoryToUpdate.ownerId, ['id', 'category']);

    const categoryDeleteResponse = await category.delete('id', categoryId);

    if (!categoryDeleteResponse)
      throw { message: "Unable delete record at the moment", logMessage: "Error while deleting a record from database" };
    
    for(let i=0;i<projectFiles.length;i++)
    {
      if(projectFiles[i].category == oldname)
      {
        const response2 = await file.updateField('id', projectFiles[i].id, 'category', '');
        if (response2[0] !== 1) {
          throw "Unable to Update at the moment";
        }
      }
    }

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

module.exports = router;
