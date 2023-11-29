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
    return queryInterface.bulkInsert('spots', [{
      id: 1,
      ownerId: 1,
      address: '123 Main St',
      city: 'Atown',
      state: 'Astate',
      country: 'USA',
      lat: 34.052235,
      lng: -118.243683,
      name: 'ThePlace',
      description: 'A cool place with great views.',
      price: 99.99,
      created_at: new Date(),
      updated_at: new Date(),
      previewImage: 'image-url.jpg',
      avgRating: 4.5
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
  }
};
