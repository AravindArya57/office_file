/* checked */
const model = require('../models/category')
/* import uuid required version */

class Category {

    /**
        * Description. insert record into Db
        * @param  uuid  uuid of project.
        * @param  name  file name .
        * @param  ownerId  Owner.id .
        * @param  buckettId bucket.id .
    */
    async store( name, ownerId) {
        try {
            const response = await model.create({
                name: name,
                ownerId: ownerId,
            });
            if (response)
                return true;
            return false;
        }
        catch (err) {
            console.log(`db file insert error: ${err} `);
            return false
        }
    }


    /**
        * Description. find single record
        * @param  whereColumnName  column name in which  `where` condition will be appiled .
        * @param  whereColumnValue value of columnName.
        * @param  requiredColumnName  array of columns, which are needed.
    */
    async getValue(whereColumnName, whereColumnValue, requiredColumnName) {
        try {
            const response = await model.findOne({
                attributes: requiredColumnName,
                where: { [whereColumnName]: whereColumnValue },
                raw: true
            });
            if (response)
                return response;
            return 0;
        }
        catch (err) {
            // console.log("error occured \t" + err);
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
    async getUserCategory(whereColumnJson, requiredColumnName) {
        try {
            const response = await model.findAll({
                attributes: requiredColumnName,
                where: whereColumnJson,
                raw: true
            });
            if (response && response.length == 1)
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



    // update project
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

module.exports = Category;