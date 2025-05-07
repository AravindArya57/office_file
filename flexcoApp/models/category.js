const Sequelize = require('sequelize');
const sequelize = require('../config/database');


const Model = Sequelize.Model;

class Category extends Model { }

Category.init({

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
    ownerId:{
        type:Sequelize.BIGINT,
        field:"ownerId"
    }
},

    {
        tableName: "category",
        freezeTableName: true,
        sequelize,
        modelName: "Category"
    }
);

Category.removeAttribute('id');
module.exports = Category;