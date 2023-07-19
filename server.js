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
const { Users } = require('./models');

// // Create a user using the POST method:
// fastify.post('/users', async (request, reply) => {
//   const { username, email, password, mobileNo, firstName, lastName, accountType, companyId, verifiedEmail, verifiedMobile } = request.body;
//   const user = await Users.create({ username, email, password, mobileNo, firstName, lastName, accountType, companyId, verifiedEmail, verifiedMobile });
//   return user;
// });
  
// Create a user and generate a bank account
fastify.post('/users', async (request, reply) => {
    const { username, email, password, mobileNo, firstName, lastName, accountType, companyId, verifiedEmail, verifiedMobile } = request.body;
  
    try {
      // Create the user
      const user = await Users.create({
        username,
        email,
        password,
        mobileNo,
        firstName,
        lastName,
        accountType,
        companyId,
        verifiedEmail,
        verifiedMobile,
        createdAt: new Date(),
        updatedAt: new Date(),
        /* other user attributes as needed */
      });
  
      if (!user || !user.id) {
        throw new Error('Failed to create user or invalid user ID.');
      }
  
      // Generate a random account number
      const accountNumber = generateRandomAccountNumber();
  
      // Create the associated bank account directly in the database using Sequelize
      const bankAccount = await Bank_accounts.create({
        account_number: accountNumber,
        account_type: accountType,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      return { user, bankAccount };
    } catch (err) {
      console.error('Error creating user:', err); // Log the error
      throw new Error('Failed to create user: ' + err.message); // Throw the error with additional details
    }
  });
  
// Fetch all users using the GET method:
fastify.get('/users', async (request, reply) => {
    try {
      // Perform a JOIN operation between Users and Bank_accounts tables
      const usersWithAccounts = await Users.findAll({
        include: Bank_accounts, // Include the Bank_accounts model to fetch the associated data
      });
  
      return usersWithAccounts;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw new Error('Failed to fetch users: ' + err.message);
    }
  });
  
  // Get a user by ID using the GET method:
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params;
    try {
      // Perform a JOIN operation between Users and Bank_accounts tables
      const userWithAccount = await Users.findByPk(id, {
        include: Bank_accounts, // Include the Bank_accounts model to fetch the associated data
      });
  
      if (!userWithAccount) {
        reply.code(404).send({ message: 'User not found' });
      }
  
      return userWithAccount;
    } catch (err) {
      console.error('Error fetching user:', err);
      throw new Error('Failed to fetch user: ' + err.message);
    }
  });
  
  // Update a user using the PUT method:
fastify.put('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const { username, email, password } = request.body;
  
    try {
      // Perform a JOIN operation between Users and Bank_accounts tables
      const userWithAccount = await Users.findByPk(id, {
        include: Bank_accounts, // Include the Bank_accounts model to fetch the associated data
      });
  
      if (!userWithAccount) {
        reply.code(404).send({ message: 'User not found' });
      }
  
      // Update the user attributes
      userWithAccount.username = username;
      userWithAccount.email = email;
      userWithAccount.password = password;
      await userWithAccount.save();
  
      return userWithAccount;
    } catch (err) {
      console.error('Error updating user:', err);
      throw new Error('Failed to update user: ' + err.message);
    }
  });
  

// // Fetch all users using the GET method:
// fastify.get('/users', async (request, reply) => {
//     const users = await Users.findAll();
//     return users;
//   });

// // Get a user by ID using the GET method:
// fastify.get('/users/:id', async (request, reply) => {
//     const { id } = request.params;
//     const user = await Users.findByPk(id);
//     if (!user) {
//       reply.code(404).send({ message: 'User not found' });
//     }
//     return user;
//   });
  
// Delete a user and their associated bank account using a transaction
fastify.delete('/users/:id', async (request, reply) => {
  const { id } = request.params;

  try {
    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
      // Find the bank account associated with the user and delete it
      const bankAccount = await Bank_accounts.findOne({
        where: { user_id: id },
        transaction, // Pass the transaction instance
      });

      if (bankAccount) {
        await bankAccount.destroy({ transaction });
      }

      // Find and delete the user
      const user = await Users.findByPk(id, { transaction });
      if (!user) {
        await transaction.rollback(); // Rollback the transaction if user not found
        return reply.code(404).send({ message: 'User not found' });
      }

      await user.destroy({ transaction });

      // Commit the transaction after successful deletion of user and bank account
      await transaction.commit();

      return { message: 'User and associated bank account deleted successfully' };
    } catch (err) {
      // Rollback the transaction if an error occurs during deletion
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    console.error('Error deleting user and bank account:', err);
    throw new Error('Failed to delete user and associated bank account: ' + err.message);
  }
});


//  // Delete a user using the DELETE method:
//  fastify.delete('/users/:id', async (request, reply) => {
//     const { id } = request.params;
//     const user = await Users.findByPk(id);
//     if (!user) {
//       reply.code(404).send({ message: 'User not found' });
//     }
//     await user.destroy();
//     return { message: 'User deleted successfully' };
//   });
  
// // Update a user using the PUT method:
// fastify.put('/users/:id', async (request, reply) => {
//     const { id } = request.params;
//     const { username, email, password } = request.body;
//     const user = await Users.findByPk(id);
//     if (!user) {
//       reply.code(404).send({ message: 'User not found' });
//     }
//     user.username = username;
//     user.email = email;
//     user.password = password;
//     await user.save();
//     return user;
//   });
  

// Create a bank account
fastify.post('/bank_accs', async (request, reply) => {
    const { account_type } = request.body;
    // Generate a random account number
    const account_number = generateRandomAccountNumber();
    // Create the bank account with the generated account number
    const bank_accounts = await Bank_accounts.create({  account_number, account_type });
    return bank_accounts;
  });
  
  // Function to generate a random 10-digit account number
  function generateRandomAccountNumber() {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
// Define a route to fetch all bank account
fastify.get('/bank_accs', async (request, reply) => {
    const bank_accounts = await Bank_accounts.findAll();
    return bank_accounts;
  });

// Get a bank account by ID
fastify.get('/bank_accs/:id', async (request, reply) => {
    const { id } = request.params;
    const bank_accounts = await Bank_accounts.findByPk(id);
    if (!bank_accounts) {
      reply.code(404).send({ message: 'Bank account not found' });
    }
    return bank_accounts;
  });

// Delete a bank account
fastify.delete('/bank_accs/:id', async (request, reply) => {
    const { id } = request.params;
    const bank_accounts = await Bank_accounts.findByPk(id);
    if (!bank_accounts) {
      reply.code(404).send({ message: 'Bank account found' });
    }
    await bank_accounts.destroy();
    return { message: 'Bank account deleted successfully' };
  });

  // Update a bank acc
fastify.put('/bank_accs/:id', async (request, reply) => {
    const { id } = request.params;
    const { account_number, account_type } = request.body;
    const bank_accounts = await Bank_accounts.findByPk(id);
    if (!bank_accounts) {
      reply.code(404).send({ message: 'Bank accounts not found' });
    }
    bank_accounts.account_number = account_number;
    bank_accounts.account_type = account_type;

    await bank_accounts.save();
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
  