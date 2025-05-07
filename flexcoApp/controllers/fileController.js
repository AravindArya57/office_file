const model = require("../models/file")

class UserFile {

    constructor() { }

    /**
        * Description. insert record into Db  
        * @param  uuid  uuid of file.
        * @param  extension file extension.
        * @param  name  file name .
        * @param  ownerId  Owner.id .
        * @param  projectId project.id .
        * @param  type  type of file  `image,video,3d,pdf : 0,1,2,3 respectively`.
    */
    async store(uuid, extension, name, ownerId, projectId,category, type, url) {
        try {
            const response = await model.create({
                uuid: uuid,
                extension: extension,
                name: name,
                url: url,
                type: type,
                ownerId: ownerId,
                projectId: projectId,
                category:category
            });
            if (response)
                return true;
            return false;
        }
        catch (err) {
            // console.log(`DB file insert error: ${err} `);
            return false
        }
    }


    /**
        * Description. find single record
        * @param  columnName  column name in which  `where` condition will be appiled .
        * @param  ColumnValue value of columnName.
        * @param  requiredColumnName  array of columns, which are needed.
    */
    async getValue(columnName, ColumnValue, requiredColumnName) {
        try {
            const response = await model.findOne({
                attributes: requiredColumnName,
                where: { [columnName]: ColumnValue },
                raw: true
            });
            if (response)
                return response;
            return 0;
        }
        catch (err) {
            // console.log(`error while fetching values from DB : ${err} `);
            return 0;
        }
    }


    /**
        * Description. find all records  
        * @param  columnName  column name in which  `where` condition will be appiled .
        * @param  ColumnValue value of columnName.
        * @param  requiredColumnName  array of columns, which are needed.
    */
    async getAllValues(columnName, ColumnValue, requiredColumnName) {
        try {
            const response = await model.findAll({
                attributes: requiredColumnName,
                where: { [columnName]: ColumnValue },
                raw: true
            });
            if (response && response.length > 0)
                return response;
            return 0;
        }
        catch (err) {
            // console.log(`error while fetching Multiple Record from DB : ${err} `);
            return 0;
        }
    }



    /**
        * Description. find all records  by userId
        * @param  columnName  column name in which  `where` condition will be appiled .
        * @param  ColumnValue value of columnName.
        * @param  requiredColumnName  array of columns, which are needed.
    */
    async getUserFiles(whereColumnJson, requiredColumnName) {
        try {
            const response = await model.findAll({
                attributes: requiredColumnName,
                where: whereColumnJson,
                raw: true
            });
            if (response && response.length ==1)
                return response[0];

            else if (response && response.length > 1)
                return response;
            return 0;
        }
        catch (err) {
            // console.log(`error while fetching Multiple Record from DB : ${err} `);
            return 0;
        }
    }



    async updateField(whereColumnName, whereColumnValue, updateColumnName, updateColumnValue) {
        try {

            const response = await model.update(
                { [updateColumnName]: updateColumnValue },
                {
                    where: { [whereColumnName]: whereColumnValue },
                    raw: true,
                }
            );

            if (response)
                return response;
            return 0;

        } catch (err) {
            console.log(`error while updating single Record to DB : ${err} `);
            return 0;
        }
    }

    
      /**
     * delete a record on DB
     * @param {string} whereColumnName where condition column name
     * @param {string} whereColumnValue where condition column value
     */
       async delete(whereColumnName, whereColumnValue) {
        try {

            const response = await model.destroy(
                {
                    where: { [whereColumnName]: whereColumnValue },
                    raw: true,
                }
            );

            if (response)
                return response;
            return 0;

        } catch (err) {
            console.log(`error while updating single Record to DB : ${err} `);
            return 0;
        }
    }
}

module.exports = UserFile;