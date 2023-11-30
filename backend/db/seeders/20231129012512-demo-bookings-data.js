'use strict';

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
        spotId: 1, 
        userId: 1,
        startDATE: new Date(2023, 0, 10), 
        endDate: new Date(2023, 0, 15),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2, 
        userId: 2,
        startDATE: new Date(2023, 1, 20),
        endDate: new Date(2023, 1, 25),
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
