const Sequelize = require('sequelize');
const sequelize = require('../config/database');


const Model = Sequelize.Model;

class Project extends Model { }

Project.init({

    id: {
        type: Sequelize.BIGINT,
        field: "id",
        primaryKey:true
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "createdAt"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updatedAt"
    },
    name: {
        type: Sequelize.STRING,
        field: "name"
    },
    visibility:{
        type:Sequelize.BIGINT,
        field:"visibility"
    },
    uuid: {
        type: Sequelize.STRING,
        field: "uuid"
    },
    ownerId:{
        type:Sequelize.BIGINT,
        field:"ownerId"
    },
    
    bucketId:{
        type:Sequelize.BIGINT,
        field:"bucketId"
    }
},

    {
        tableName: "project",
        freezeTableName: true,
        sequelize,
        modelName: "Project"
    }
);

Project.removeAttribute('id');
module.exports = Project;