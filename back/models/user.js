const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        Name: { type: DataTypes.STRING, allowNull: false },
        Email: { type: DataTypes.STRING, allowNull: false },
        Status: { type: DataTypes.INTEGER, allowNull: false },
        DateCreate: { type: DataTypes.DATE, allowNull: false },
        IDUserCreate: { type: DataTypes.INTEGER, allowNull: false },
        DateModify: { type: DataTypes.DATE, allowNull: false },
        IDUserModify: { type: DataTypes.INTEGER, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false },
        Password: { type: DataTypes.STRING, allowNull: false },

    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('tb_usuarios', attributes, options);
}