'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
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
    await queryInterface.bulkInsert('Bookings', [
      {
        //id: 1,
        spotId: 1, 
        userId: 1,
        startDate: new Date(2023, 1, 10), 
        endDate: new Date(2023, 1, 15),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //id: 2,
        spotId: 2, 
        userId: 1,
        startDate: new Date(2023, 1, 20),
        endDate: new Date(2023, 1, 25),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        //id: 3,
        spotId: 2, 
        userId: 2,
        startDate: new Date(2023, 3, 20),
        endDate: new Date(2023, 4, 25),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ['1', '2'] }
    }, {});
  }
};
