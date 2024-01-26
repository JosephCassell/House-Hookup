'use strict';
const { SpotImage } = require('../models');
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
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1, 
        url: 'https://i.pinimg.com/550x/fc/07/40/fc0740d7c26d93974e117cb88a81bc36.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://www.tennessean.com/gcdn/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg?width=1200&disable=upscale&format=pjpg&auto=webp',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38dLNTu9lZr_ahAbZhLebJ10m7B722SenWA&usqp=CAU',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38dLNTu9lZr_ahAbZhLebJ10m7B722SenWA&usqp=CAU',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38dLNTu9lZr_ahAbZhLebJ10m7B722SenWA&usqp=CAU',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38dLNTu9lZr_ahAbZhLebJ10m7B722SenWA&usqp=CAU',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38dLNTu9lZr_ahAbZhLebJ10m7B722SenWA&usqp=CAU',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS38dLNTu9lZr_ahAbZhLebJ10m7B722SenWA&usqp=CAU',
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ['1', '2'] }
    }, {});
  }
};
