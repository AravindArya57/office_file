const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class FileOrder extends Model { }

FileOrder.init({
    id: {
        type: Sequelize.BIGINT,
        field: "id",
        primaryKey: true
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "createdAt"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updatedAt"
    },
    projectId: {
        type: Sequelize.BIGINT,
        field: "projectId"
    },
    strOrder : {
        type: Sequelize.TEXT,
        field: "strOrder"
    },

},

    {
        tableName: "file_order",
        freezeTableName: true,
        sequelize,
        modelName: "FileOrder"
    }
);

FileOrder.removeAttribute('id');
module.exports = FileOrder;