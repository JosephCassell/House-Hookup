'use strict';
const { Spot } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [{
      ownerId: 1,
      address: '111 Main St',
      city: 'Atown',
      state: 'Astate',
      country: 'USA',
      lat: 34.052235,
      lng: -118.243683,
      name: 'ThePlace',
      description: 'A cool place with great views.',
      price: 99.99,
      previewImage: 'https://t4.ftcdn.net/jpg/02/79/95/39/360_F_279953994_TmVqT7CQhWQJRLXev4oFmv8GIZTgJF1d.jpg'
    },
    {
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
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSjly89MdgF7OXW2oCWzJiSsoZ60QiYad1gUS1-khH9g65ySF-I23f714tZCB7MRzmREw&usqp=CAU',
    },
    {
      ownerId: 3,
      address: '333 Wood St',
      city: 'Ctown',
      state: 'Cstate',
      country: 'USC',
      lat: -11.05225,
      lng: 110.2433,
      name: 'CPlace',
      description: 'C dope place with great views.',
      price: 10,
      previewImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_2Rp57Ksoch1FeSiG4D93iuOMBTaILC--F3KqeT8KU_3aneE-ARy6RgOnYtGnqxnOmI&usqp=CAU',
    },
    {
      ownerId: 1,
      address: '444 Lake St',
      city: 'Dtown',
      state: 'Dstate',
      country: 'USD',
      lat: 40.712776,
      lng: -74.005974,
      name: 'DLake House',
      description: 'A serene lakeside retreat with stunning scenery.',
      price: 120.00,
      previewImage: 'https://theinspiredroom.net/wp-content/uploads/2020/07/Lake-House-Atlanta-Homes.jpg'
    },
    {
      ownerId: 2,
      address: '555 Mountain Rd',
      city: 'Etown',
      state: 'Estate',
      country: 'USE',
      lat: 39.739236,
      lng: -104.990251,
      name: 'EMountain View',
      description: 'Escape to the mountains for breathtaking views.',
      price: 150.00,
      previewImage: 'https://cdn.onekindesign.com/wp-content/uploads/2021/02/Rustic-Mountain-House-The-Jarvis-Group-Architects-02-1-Kindesign.jpg'
    },
    {
      ownerId: 3,
      address: '666 Beach Ave',
      city: 'Ftown',
      state: 'Fstate',
      country: 'USF',
      lat: 36.778259,
      lng: -119.417931,
      name: 'FBeach Front',
      description: 'Beachfront property with amazing sunsets.',
      price: 200.00,
      previewImage: 'https://cdn.houseplansservices.com/product/ockj9ahd2d2da1suld5q38goce/w560x373.jpg?v=11'
    },
    {
      ownerId: 1,
      address: '777 Country Rd',
      city: 'Gtown',
      state: 'Gstate',
      country: 'USG',
      lat: 37.774929,
      lng: -122.419416,
      name: 'GCountry Charm',
      description: 'A charming country house surrounded by nature.',
      price: 85.00,
      previewImage: 'https://cdn.houseplansservices.com/product/fo1sr8t3p51r2e24dq8e0pq9tq/w800x533.jpg?v=2'
    },
    {
      ownerId: 2,
      address: '888 Forest Ln',
      city: 'Htown',
      state: 'Hstate',
      country: 'USH',
      lat: 34.052234,
      lng: -118.243685,
      name: 'HForest Retreat',
      description: 'A peaceful retreat in the heart of the forest.',
      price: 135.00,
      previewImage: 'https://images.adsttc.com/media/images/61ca/2e16/b038/0601/6505/32e8/newsletter/casa-bosque-jardin.jpg?1640640053'
    },
    {
      ownerId: 3,
      address: '999 River St',
      city: 'Itown',
      state: 'Istate',
      country: 'USI',
      lat: 40.712776,
      lng: -74.005974,
      name: 'IRiver Bend',
      description: 'Enjoy the soothing sounds of the river at this cozy spot.',
      price: 110.00,
      previewImage: 'https://sola-images.s3.us-west-2.amazonaws.com/wp-content/uploads/2020/10/28132402/DT_Photo_Schenck_DSC_0406edited.jpg'
    },
    {
      ownerId: 1,
      address: '1010 Park Blvd',
      city: 'Jtown',
      state: 'Jstate',
      country: 'USJ',
      lat: 34.052234,
      lng: -118.243685,
      name: 'JParkside',
      description: 'Stay right next to the beautiful city park.',
      price: 95.00,
      previewImage: 'https://i0.wp.com/www.unofficialroyalty.com/wp-content/uploads/2013/04/parkhouse.jpg'
    }
    ])
  },

  async down (queryInterface, Sequelize) {  
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['ThePlace', 'BPlace'] }
    }, {});
  }
};
