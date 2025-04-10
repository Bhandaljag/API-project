'use strict';


const { Spot, SpotImage, User} = require('../models');
let options = {};
    if (process.env.NODE_ENV === 'production') {
      options.schema = process.env.SCHEMA;
    }

 /** @type {import('sequelize-cli').Migration} */
 module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     * 
     * 
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

  
  const demoUser = await User.findOne ({ where: { username: 'Demo-lition'}});
  if(!demoUser){
    console.error('User "Demo-lition" not found');
    return;

  }
  // const demoUser = await queryInterface.sequelize.query(
  //   `SELECT id FROM Users WHERE username = 'Demo-lition' LIMIT 1;`,
  //   { type: Sequelize.QueryTypes.SELECT }
  // );
  
  options.tableName = 'Spots';
  const spots = await Spot.bulkCreate ([
    {
      ownerId:  demoUser.id,
      address:  '95 3rd St 2nd Floor',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      lat: 58.54,
      lng: -34.67,
      name: 'App Academy',
      description: 'Coding bootcamp',
      price: 29000

    },
    {
      ownerId: demoUser.id,
      address: '4565 Sunny dr',
      city: 'Los Angeles',
      state: "CA",
      country: 'USA',
      lat: 89.90,
      lng: -67.34,
      name: 'Sunny Store',
      description: 'Market',
      price: 35
    },
    {
      ownerId: demoUser.id,
      address: '987 Lookout Mountain Rd',
      city: 'Golden',
      state: "CO",
      country: 'USA',
      lat: 66.70,
      lng: -33.31,
      name: 'Lookout Mountain Park',
      description: 'Viewpoint',
      price: 15

    }
  ], { validate: true});

  options.tableName = 'SpotImages';
  await SpotImage.bulkCreate([
    {
      spotId: spots[0].id,
      url: 'https://example.com/test-image.jpg',
      preview: true
    },
    {
      spotId: spots[0].id,
      url: 'https://example.com/test-image-2.jpg',
      preview: false
    },
    {
      spotId: spots[1].id,
      url: 'https://example.com/test-image-3.jpg',
      preview: true
    },
    {
      spotId: spots[2].id,
      url:'https://example.com/test-image-4.jpg',
      preview:true
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
    const Op = Sequelize.Op;

    options.tableName = 'SpotImages';

    await queryInterface.bulkDelete('SpotImages', {
      spotId: {[Op.ne]: null},
    }, options);

    options.tableName = 'Spots';
    await queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ['App Academy', 'Sunny Store', 'Lookout Mountain Park']},
    }, options);
    
  }
};
