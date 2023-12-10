'use strict';
let options = {};
const { Spot } = require('../models');
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
    return queryInterface.bulkInsert('Spots', [{
      //id: 1,
      ownerId: 1,
      address: '111 Main St',
      city: 'Atown',
      state: 'Astate',
      country: 'USA',
      lat: 34.052235,
      lng: -118.243683,
      name: 'ThePlace',
      description: 'A cool place with great views.',
      //avgRating: 4.5,
      price: 99.99,
      //numReviews: 2,
      previewImage: 'image-url1.jpg'
    },
    {
      //id: 2,
      ownerId: 2,
      address: '222 Wood St',
      city: 'Btown',
      state: 'Bstate',
      country: 'USB',
      lat: 7.05225,
      lng: -90.2433,
      name: 'BPlace',
      description: 'B dope place with great views.',
      price: 100,
      //avgRating: 1.5,
      //numReviews: 1,
      previewImage: 'image-url2.jpg',
    },
    {
      //id: 3,
      ownerId: 3,
      address: '333 Wood St',
      city: 'ctown',
      state: 'cstate',
      country: 'USC',
      lat: -11.05225,
      lng: 110.2433,
      name: 'CPlace',
      description: 'C dope place with great views.',
      price: 10,
      //avgRating: 3.5,
      previewImage: 'image-url3.jpg',
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['ThePlace', 'BPlace'] }
    }, {});
  }
};
