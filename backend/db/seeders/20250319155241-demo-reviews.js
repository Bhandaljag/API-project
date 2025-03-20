'use strict';

const { User, Spot, Review, ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Ensure schema compatibility in production
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await User.findAll({
      where: { username: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
    });

    const demoUser = users.find(user => user.username === 'Demo-lition');
    const user1 = users.find(user => user.username === 'FakeUser1');
    const user2 = users.find(user => user.username === 'FakeUser2');

    // Fetch all spots
    const spots = await Spot.findAll();
    if (spots.length < 3 || !demoUser || !user1 || !user2) {
      console.error('Not enough spots or users exist for seeding reviews.');
      return;
    }

    const reviews = await Review.bulkCreate([
      { spotId: spots[0].id, userId: user1.id, review: 'Amazing place!', stars: 5 },
      { spotId: spots[0].id, userId: user2.id, review: 'Very nice, but a bit expensive.', stars: 4 },
      { spotId: spots[1].id, userId: demoUser.id, review: 'Loved the atmosphere!', stars: 5 },
      { spotId: spots[1].id, userId: user2.id, review: 'It was okay, nothing special.', stars: 3 },
      { spotId: spots[2].id, userId: user1.id, review: 'Best experience ever!', stars: 5 },
    ]);

    // Add sample review images
    await ReviewImage.bulkCreate([
      { reviewId: reviews[0].id, url: 'https://example.com/review1-image1.jpg' },
      { reviewId: reviews[0].id, url: 'https://example.com/review1-image2.jpg' },
      { reviewId: reviews[2].id, url: 'https://example.com/review3-image1.jpg' },
    ]);
  },

  

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReviewImages', null, options);
    await queryInterface.bulkDelete('Reviews', null, options);
  }
};
