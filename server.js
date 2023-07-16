const fastify = require('fastify')();
const Sequelize = require('sequelize');

// Initialize Sequelize with your PostgreSQL database credentials
const sequelize = new Sequelize({
    database: 'postgres',
    username: 'postgres',
    password: 'admin',
    dialect: 'postgres',
    host: '127.0.0.1'
  });

  fastify.get('/', async (request, reply) => {
    return { message: 'Hello Fastify, Sequelize!' };
  });

// Import models
const { Bank_accounts } = require('./models');

// Define a route to fetch all users
fastify.get('/bank_accs', async (request, reply) => {
    const bank_accounts = await Bank_accounts.findAll();
    return bank_accounts;
  });

  // Start the server
const start = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully');
      await fastify.listen(3000);
      console.log('Server is running on port 3000');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      process.exit(1);
    }
  };
  
  start();
  