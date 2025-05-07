const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class Record extends Model { }

Record.init({

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
    visibility: {
        type: Sequelize.INTEGER,
        field: "visibility"
    },
    uuid: {
        type: Sequelize.STRING,
        field: "uuid"
    },
    extension: {
        type: Sequelize.STRING,
        field: "extension"
    },
    type: {
        type: Sequelize.INTEGER,
        field: "type"
    },
    name: {
        type: Sequelize.STRING,
        field: "name"
    },
    url: {
        type: Sequelize.STRING,
        field: "url"
    },
    ownerId: {
        type: Sequelize.BIGINT,
        field: "ownerId"
    },
    projectId: {
        type: Sequelize.BIGINT,
        field: "projectId"
    },
    category: {
        type: Sequelize.STRING,
        field: "category"
    }
},

    {
        tableName: "file",
        freezeTableName: true,
        sequelize,
        modelName: "file"
    }
);

Record.removeAttribute('id');

module.exports = Record;