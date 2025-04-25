'use strict';

const { Spot, SpotImage, User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Find the demo user
    const demoUser = await User.findOne({
      where: { username: 'Demo-lition' }
    });

    if (!demoUser) {
      console.error('User "Demo-lition" not found');
      return;
    }

    

    // Create spots for the demo user
    const spots = await Spot.bulkCreate( [
      {
        ownerId: demoUser.id,
        address: '95 3rd St 2nd Floor',
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
        state: 'CA',
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
        state: 'CO',
        country: 'USA',
        lat: 66.70,
        lng: -33.31,
        name: 'Lookout Mountain Park',
        description: 'Viewpoint',
        price: 15
      }
    ], {
      validate: true,
      
    });

    // Create spot images
  
    await SpotImage.bulkCreate( [
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
        url: 'https://example.com/test-image-4.jpg',
        preview: true
      }
    ] 
     
    );
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;

    options.tableName = 'SpotImages';
    // Delete SpotImages
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.ne]: null }
    });

    options.tableName = 'Spots';
    // Delete Spots
    await queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['App Academy', 'Sunny Store', 'Lookout Mountain Park']
      }
    });
  }
};
