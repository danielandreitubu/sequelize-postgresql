'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_accounts', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      account_number: {
      type: Sequelize.STRING,
      unique: true // Add unique constraint

      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      username: { // Change field name to 'username'
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobileNo: { // Change field name to 'mobileNo'
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.INTEGER, // Change data type to INTEGER
        allowNull: false,
      },
      verifiedEmail: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      verifiedMobile: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      createdAt: { // Change column name to 'created_at'
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at' // Add field option for custom column name
      },
      updatedAt: { // Change column name to 'updated_at'
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at' // Add field option for custom column name
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  }
};