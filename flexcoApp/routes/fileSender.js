const router = require('express').Router();
const fs = require('fs')
const path = require('path');
const UserFile = require('../controllers/fileController')
const userProject = require('../controllers/projectController')
const Owner = require('../controllers/ownerController');


router.get('/', async (req, res) => {
    // search for file if present send file
    //  else redirect
    let fileResponse = 0, projectId;
    if (req.fileUuid) {
        const file = new UserFile();
        fileResponse = await file.getValue('uuid', req.fileUuid, ['id', 'projectId', 'extension'])
        projectId = fileResponse.projectId;
    }


    if (fileResponse === 0) {
        // console.log("no response");// no file; load default 404 file
        res.sendFile(
            'uploads/system/404.pdf',
            // 'uploads/' + ownerFolderUuid + '/' + projectUuid + '/' + req.fileUuid +'.pdf',
            {
                'root': __dirname + '../../',
                headers: { 'Content-Type': 'application/octet-stream' },
            })
        return // to prevent any code below running

    }

    const project = new userProject();
    const projectResponse = await project.getValue('id', projectId, ['uuid', 'ownerId']);
    projectUuid = projectResponse.uuid;

    const owner = new Owner();
    let user = await owner.getValue('id', projectResponse.ownerId, ['uuid']);
    ownerFolderUuid = user.uuid;


    const fileSendOptions = { root: path.join(__dirname, '..') };
    //     // 'uploads/75a33fd9c61f80ce0f5ed4d1e296635f/7e587e62-2513-4656-9f2a-080e1f217966.pdf',
    const filePath = path.join('uploads', ownerFolderUuid, projectUuid, req.fileUuid + fileResponse.extension);
    res.sendFile(filePath, fileSendOptions, (err) => {
        if (err)
            next(err);
        else {
            console.log('Sent:', fileName);
            next();
        }
    });
    return;


    // res.sendFile(
    //     // 'uploads/75a33fd9c61f80ce0f5ed4d1e296635f/7e587e62-2513-4656-9f2a-080e1f217966.pdf',
    //     'uploads/' + ownerFolderUuid + '/' + projectUuid + '/' + req.fileUuid  + fileResponse.extension,
    //     {
    //         'root': __dirname + '../../',
    //         headers: { 
    //             // 'Content-Type': 'application/octet-stream',
    //         },

    //     })
    //     return
})

module.exports = router;