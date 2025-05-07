const AWS = require('aws-sdk')
const fs = require('fs')


class CloudS3 {

    constructor() {
        /* loading  aws secret credentials  */
        const credentials = new AWS.SharedIniFileCredentials({ profile: "default" })
        AWS.config.credentials = credentials;

        // set aws service region
        AWS.config.update({ region: 'ap-south-1' });

        // Create S3 service object
        this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
        this.bucketName = 'mindwox-flexco/';
    }


    /**
        * Description. To upload file to S3  
        * @param  bucketUserPath  where to store the file (eg : userFolder/projectFolder).
        * @param  filename Name of the file on S3.
        * @param  UploadedFilePath  absolute path of file to read
    */
    upload(bucketUserPath, filename, UploadedFilePath) {
        // full path 
        let bucket = this.bucketName + bucketUserPath;
        const fileContent = fs.readFileSync(UploadedFilePath);

        // Setting up S3 upload parameters
        const params = {
            Bucket: bucket,
            Delimiter: '/',
            Key: filename,
            Body: fileContent
        };

        const storageObject = new CloudS3();

        // Uploading files to the bucket 
        storageObject.s3.upload(params, function (err, data) {
            if (err)
                throw err;
            // console.log(`File uploaded successfully. ${data.Location}`);
        });
    }


    /**
        * Description. To upload file to S3  
        * @param  ownerFolderName  UUID of UserFolder .
        * @param  NewFolderName Name of the folder to create on S3.
    */
    createFolder(ownerFolderName, NewFolderName='') {
        let bucket = this.bucketName + ownerFolderName;
        
        // if its not a sub folder then no need for trail slash
        if (NewFolderName)
            NewFolderName = '' + '/';
        const params = {
            Bucket: bucket,
            Key: NewFolderName 
        }
        const storageObject = new CloudS3();

        storageObject.s3.putObject(params, (err, data) => {
            if (err) {
                // console.log(`error while creating folder on s3 : ${err} `);
                // throw err;
                return 0;
            }
            return 1;
        })
    }


    /**
        * Description. To delete file from S3  
        * @param  filePath  where to store the file (eg : userFolder/projectFolder/fileName.txt).\
        * filepath should not contain '/' at start and end of path
    */
     async deleteFile(filePath) {
        try {
            // to delete file bucket should not contain trail slash
            let bucket = this.bucketName.replace('/','');
            const params = {
                Bucket: bucket,
                Key: filePath,
            };
            const storageObject = new CloudS3();
            await storageObject.s3.deleteObject(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log("Response:", data);
            }).promise();
        } catch (e) { }

    }

}

module.exports = CloudS3;