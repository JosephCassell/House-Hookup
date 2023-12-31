'use strict';
const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// /** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      { 
        //id: 1,
        userId: 1,
        spotId: 1,
        review: 'Great place to stay, had a wonderful time!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //id: 2,
        userId: 2,
        spotId: 1,
        review: 'The location was perfect, but the room was smaller than expected.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //id: 3,
        userId: 2,
        spotId: 2,
        review: 'The location was bad, and the room was smaller than expected.',
        stars: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      stars: { [Op.in]: ['4', '5'] }
    }, {});
  }
};
