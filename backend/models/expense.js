'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, {
        foreignKey: 'nombreUser',
        targetKey: 'nombreUser',
        onDelete: 'CASCADE',
      });
    }
  }

  Expense.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          isFloat: { msg: 'El monto debe ser un número decimal.' },
          min: { args: [0], msg: 'El monto no puede ser negativo.' },
        },
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'La descripción es obligatoria.' },
        },
      },
      type: {
        type: DataTypes.ENUM('transporte', 'alimento', 'hotel'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['transporte', 'alimento', 'hotel']],
            msg: 'El tipo debe ser transporte, alimento o hotel.',
          },
        },
      },
      nombreUser: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'nombreUser',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Expense',
      tableName: 'expenses',
      timestamps: false,
    }
  );

  return Expense;
};