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
      avgRating: 4.5,
      
    },
    {
      id: 2,
      ownerId: 2,
      address: '222 Wood St',
      city: 'Btown',
      state: 'Bstate',
      country: 'USA',
      lat: 7.05225,
      lng: -90.2433,
      name: 'BPlace',
      description: 'A dope place with great views.',
      price: 100,
      avgRating: 1.5,
      previewImage: 'image-url2.jpg',
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
