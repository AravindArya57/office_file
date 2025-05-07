const model = require('../models/owner')

class Owner {

  /**
      * Description. insert record into Db  
      * @param  name  file name .
      * @param  email   .
      * @param  phone  .
  */
  async store(name, email, phone, password,website, uuid) {
    try {
      const response = await model.create({
        name: name,
        email: email,
        phone: phone,
        password :password,
        website:website,
        uuid : uuid,
      });
      if (response)
        return true;
      return false;
    }
    catch (err) {
      console.log(`DB file insert user: ${err} `);
      return false;
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
        where: {
          [columnName]: ColumnValue
        },
        raw: true
      });
      if (response)
        return response;
      return 0;
    } catch (err) {
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
        where: {
          [columnName]: ColumnValue
        },
        raw: true
      });
      if (response && response.length>0)
        return response;
      return 0;
    } catch (err) {
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
}

module.exports = Owner;