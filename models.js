const Sequelize = require('sequelize');

// Initialize Sequelize with your PostgreSQL database credentials
const sequelize = new Sequelize({
    database: 'postgres',
    username: 'postgres',
    password: 'admin',
    dialect: 'postgres',
    host: '127.0.0.1'
  });

// Define the Users model
const Users = sequelize.define('users', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    username: {
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
    mobileNo: {
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
      type: Sequelize.INTEGER,
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
    createdAt: { // Change column name to 'createdAt'
      allowNull: false,
      type: Sequelize.DATE,
      field: 'created_at' // Add field option for custom column name
    },
    updatedAt: { // Change column name to 'updatedAt'
      allowNull: false,
      type: Sequelize.DATE,
      field: 'updated_at' // Add field option for custom column name
    },
  });

// Define the Bank Account model
const Bank_accounts = sequelize.define('bank_accounts', {
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
      createdAt: { // Change column name to 'createdAt'
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at' // Add field option for custom column name
      },
      updatedAt: { // Change column name to 'updatedAt'
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at' // Add field option for custom column name
      }
});

// Set up associations between Users and Bank_accounts
Users.hasMany(Bank_accounts, { foreignKey: 'user_id' });
Bank_accounts.belongsTo(Users, { foreignKey: 'user_id' });

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database and tables synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = { Users, Bank_accounts };
