const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Model = Sequelize.Model;

class ProjectView extends Model { }

ProjectView.init({
    id: {
        type: Sequelize.BIGINT,
        field: "id",
        primaryKey: true
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "createdAt"
    },
    ip: {
        type: Sequelize.STRING,
        field: "ip"
    },
    country: {
        type: Sequelize.STRING,
        field: "country"
    },
    region: {
        type: Sequelize.STRING,
        field: "region"
    },
    city: {
        type: Sequelize.STRING,
        field: "city"
    },
    ll: {
        type: Sequelize.STRING,
        field: "ll"
    },
    ownerId: {
        type: Sequelize.BIGINT,
        field: "ownerId"
    },
    projectId: {
        type: Sequelize.BIGINT,
        field: "projectId"
    }
},

    {
        tableName: "project_view",
        freezeTableName: true,
        sequelize,
        modelName: "ProjectView"
    }
);

ProjectView.removeAttribute('id');

module.exports = ProjectView;