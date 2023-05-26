'use strict';
const {PasswordHas} = require('../helpers/index')

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
    const password = await PasswordHas.Hash('password')

    await queryInterface.bulkInsert('users', [{
      name: 'admin',
      email: 'admin@email.com',
      title:'HR Admin',
      password:password,
      is_admin:true,
      photo:'https://anggaran-v2.web.app/assets/avatar-s-11.9d32c98c.jpg',
      phone:'091212113141',
      createdAt:new Date(),
      updatedAt:new Date()
    },{
      name: 'john',
      email: 'john@email.com',
      title:'Software Engineer',
      password:password,
      is_admin:false,
      photo:'https://anggaran-v2.web.app/assets/avatar-s-11.9d32c98c.jpg',
      phone:'091212113141',
      createdAt:new Date(),
      updatedAt:new Date()
    },{
      name: 'silvia',
      email: 'silvia@email.com',
      title:'Wareshouse admin',
      password:password,
      is_admin:false,
      photo:'https://anggaran-v2.web.app/assets/avatar-s-11.9d32c98c.jpg',
      phone:'091212113141',
      createdAt:new Date(),
      updatedAt:new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
