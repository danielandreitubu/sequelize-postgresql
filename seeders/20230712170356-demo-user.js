'use strict';
const uuid = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const accountNumber1 = generateAccountNumber();
    const accountNumber2 = generateAccountNumber();
    const accountNumber3 = generateAccountNumber();
  
    await queryInterface.bulkInsert(
      'bank_accounts',
      [
        {
          id: uuid.v4(),
          user_id: uuid.v4(),
          account_number: accountNumber1,
          account_type: randomAccountType(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          user_id: uuid.v4(),
          account_number: accountNumber2,
          account_type: randomAccountType(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuid.v4(),
          user_id: uuid.v4(),
          account_number: accountNumber3,
          account_type: randomAccountType(),
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
  const prefix = 'ACC';
  const randomNumber = Math.floor(Math.random() * 1000000000);
  const accountNumber = `${prefix}-${randomNumber.toString().padStart(8, '0')}`;
  return accountNumber;
}

function randomAccountType() {
  const accountTypes = ['checking', 'savings'];
  const randomIndex = Math.floor(Math.random() * accountTypes.length);
  return accountTypes[randomIndex];
}

