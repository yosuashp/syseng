// const { DataTypes } = require('sequelize')
// 'use strict'
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await queryInterface.createTable('Cars', {
//       id: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         defaultValue: DataTypes.UUIDV4
//       },
//       plate: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       manufacture: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       model: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       image: {
//         allowNull: true,
//         type: Sequelize.STRING
//       },
//       rentPerDay: {
//         allowNull: false,
//         type: Sequelize.INTEGER
//       },
//       capacity: {
//         allowNull: false,
//         type: Sequelize.INTEGER
//       },
//       description: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       availableAt: {
//         allowNull: false,
//         type: Sequelize.DATE // Ganti 'timestamp' menjadi 'DATE'
//       },
//       transmission: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       available: {
//         allowNull: true,
//         type: Sequelize.BOOLEAN
//       },
//       type: {
//         allowNull: false,
//         type: Sequelize.STRING
//       },
//       year: {
//         allowNull: false,
//         type: Sequelize.INTEGER
//       },
//       options: {
//         type: DataTypes.JSON,
//         allowNull: false// Perbaikan penulisan DataTypes.JSON
//       },
//       specs: {
//         allowNull: false,
//         type: DataTypes.JSON
//       },
//       image_id: {
//         type: Sequelize.INTEGER
//       },
//       createdByUser: {
//         type: Sequelize.INTEGER
//       },
//       lastUpdatedByUser: {
//         type: Sequelize.INTEGER
//       },
//       deletedByUser: {
//         type: Sequelize.INTEGER
//       },
//       createdAt: {
//         type: Sequelize.DATE,
//         allowNull: false
//       },
//       updatedAt: {
//         type: Sequelize.DATE,
//         allowNull: false
//       },
//       deletedAt: {
//         type: Sequelize.DATE
//       }
//     })
//   },
//   async down (queryInterface, Sequelize) {
//     await queryInterface.dropTable('Cars')
//   }
// }

const { DataTypes } = require('sequelize')
// 'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Cars', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      plate: {
        allowNull: false,
        type: Sequelize.STRING
      },
      manufacture: {
        allowNull: false,
        type: Sequelize.STRING
      },
      model: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rentPerDay: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      capacity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      availableAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      transmission: {
        allowNull: false,
        type: Sequelize.STRING
      },
      available: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      options: {
        type: DataTypes.JSON,
        allowNull: false
      },
      specs: {
        allowNull: false,
        type: DataTypes.JSON
      },
      image_id: {
        type: Sequelize.INTEGER
      },
      createdByUser: {
        type: Sequelize.INTEGER
      },
      lastUpdatedByUser: {
        type: Sequelize.INTEGER
      },
      deletedByUser: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Cars')
  }
}
