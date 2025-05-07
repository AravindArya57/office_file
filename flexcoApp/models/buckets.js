const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class Bucket extends Model { }

Bucket.init({
    id: {
        type: Sequelize.BIGINT,
        field: "id"
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
    region: {
        type: Sequelize.STRING,
        field: "region"
    },
    serviceProvider: {
        type: Sequelize.STRING,
        field: "serviceProvider"
    }

},

    {
        tableName: "bucket",
        freezeTableName: true,
        sequelize,
        modelName: "Bucket"
    }
);

Bucket.removeAttribute('id');
module.exports = Bucket;