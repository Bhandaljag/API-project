'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const users = await queryInterface.sequelize.query(
      `SELECT id, username FROM "${options.schema ? `${options.schema}"."Users` : 'Users'}"
       WHERE username IN ('Demo-lition', 'FakeUser1', 'FakeUser2');`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const demoUser = users.find(u => u.username === 'Demo-lition');
    const user1 = users.find(u => u.username === 'FakeUser1');
    const user2 = users.find(u => u.username === 'FakeUser2');

    options.tableName = 'Spots';
    const spots = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}"."Spots` : 'Spots'}";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (spots.length < 3 || !demoUser || !user1 || !user2) {
      throw new Error('Seeding failed: Not enough spots or users exist.');
    }

    options.tableName = 'Reviews';
    const reviews = await queryInterface.bulkInsert(options, [
      { spotId: spots[0].id, userId: user1.id, review: 'Amazing place!', stars: 5, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[0].id, userId: user2.id, review: 'Very nice, but a bit expensive.', stars: 4, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[1].id, userId: demoUser.id, review: 'Loved the atmosphere!', stars: 5, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[1].id, userId: user2.id, review: 'It was okay, nothing special.', stars: 3, createdAt: new Date(), updatedAt: new Date() },
      { spotId: spots[2].id, userId: user1.id, review: 'Best experience ever!', stars: 5, createdAt: new Date(), updatedAt: new Date() }
    ], { returning: true });

    options.tableName = 'ReviewImages';
    await queryInterface.bulkInsert(options, [
      { reviewId: reviews[0].id, url: 'https://example.com/review1-image1.jpg', createdAt: new Date(), updatedAt: new Date() },
      { reviewId: reviews[0].id, url: 'https://example.com/review1-image2.jpg', createdAt: new Date(), updatedAt: new Date() },
      { reviewId: reviews[2].id, url: 'https://example.com/review3-image1.jpg', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, null, {});

    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, null, {});
  }
};
