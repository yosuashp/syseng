'use strict'

const bcrypt = require('bcryptjs')
const superadmin = require('../config/superadmin')
const encryption = require('../config/encryption')

// function encryptPassword (password) {
//   return new Promise((resolve, reject) => {
//     bcrypt.hash(password, encryption.SALT, (err, encryptedPassed) => {
//       if (err) {
//         reject(err)
//         return
//       }

//       resolve(encryptedPassed)
//     })
//   })
// }

function encryptPassword (password) {
  return new Promise((resolve, reject) => {
    if (!password || typeof password !== 'string') {
      reject(new Error('Invalid password'))
      return
    }

    bcrypt.hash(password, encryption.SALT, (err, encryptedPassed) => {
      if (err) {
        reject(err)
        return
      }

      resolve(encryptedPassed)
    })
  })
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const encryptedPassed = await encryptPassword(superadmin.password)

    return queryInterface.bulkInsert('Users', [{
      name: superadmin.name,
      email: superadmin.email,
      encryptedPassed,
      role: 'superadmin'
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      role: 'superadmin'
    }, {})
  }
}
