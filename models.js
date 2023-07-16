const Sequelize = require('sequelize');

// Initialize Sequelize with your PostgreSQL database credentials
const sequelize = new Sequelize({
    database: 'postgres',
    username: 'postgres',
    password: 'admin',
    dialect: 'postgres',
    host: '127.0.0.1'
  });

// Define the User model
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
      type: Sequelize.STRING  
      },
      account_type: {
        type: Sequelize.STRING
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

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database and tables synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = { Bank_accounts };
