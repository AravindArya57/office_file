const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class Owner extends Model { }

Owner.init({
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
    password: {
        type: Sequelize.STRING,
        field: "password"
    },
    email:{
        type:Sequelize.STRING,
        field:"email"
    },
    phone: {
        type: Sequelize.BIGINT,
        field: "phone"
    },
    website: {
        type: Sequelize.STRING,
        field: "website"
    },
    projectlimit: {
        type: Sequelize.BIGINT,
        field: "projectlimit"
    },
    uuid:{
        type:Sequelize.STRING,
        field:"uuid"
    }
},

    {
        tableName: "owner",
        freezeTableName: true,
        sequelize,
        modelName: "owner"
    }
);

Owner.removeAttribute('id')
module.exports = Owner;
