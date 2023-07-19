'use strict';
const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const accountNumber1 = generateAccountNumber();
    const userId1 = uuid.v4();

    await queryInterface.bulkInsert(
      'bank_accounts',
      [
        {
          id: uuid.v4(),
          user_id: uuid.v4(),
          account_number: accountNumber1,
          created_at: new Date(),
          updated_at: new Date(),
        }, 
      ],
      {}
    );
    
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: userId1,
          username: 'user1',
          email: 'user1@example.com',
          password: 'password1',
          mobileNo: '1234567890',
          firstName: 'John',
          lastName: 'Doe',
          accountType: randomAccountType(),
          companyId: 1,
          verifiedEmail: 1,
          verifiedMobile: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },  
      ],
      {}
    );


  },
  async down(queryInterface, Sequelize) {
    // Implementation for rollback
  },
};

function generateAccountNumber() {
  const randomNumber = Math.floor(Math.random() * 1000000000);
  const accountNumber = `${randomNumber.toString().padStart(8, '0')}`;
  return accountNumber;
}

function randomAccountType() {
  const accountTypes = ['checking', 'savings'];
  const randomIndex = Math.floor(Math.random() * accountTypes.length);
  return accountTypes[randomIndex];
}

