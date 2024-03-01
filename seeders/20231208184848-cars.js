'use strict'
// const { Sequelize, DataTypes } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const body = [
      {
        id: '6e2bc663-5197-441a-957b-bc75e4a2da7c',
        plate: 'DBH-3491',
        manufacture: 'Ford',
        model: 'F150',
        image: 'https://res.cloudinary.com/dshomxqjc/image/upload/v1698933251/zpqppydzku2ibgccbsbr.jpg',
        rentPerDay: 200000,
        capacity: 2,
        description:
          ' Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.',
        availableAt: '2022-03-23T15:49:05.563Z',
        transmission: 'Automatic',
        available: true,
        type: 'Sedan',
        year: 2022,
        options: JSON.stringify(['Cruise Control', 'Tinted Glass', 'Tinted Glass', 'Tinted Glass', 'AM/FM Stereo']),
        specs: JSON.stringify([
          'Brake assist',
          'Leather-wrapped shift knob',
          'Glove box lamp',
          'Air conditioning w/in-cabin microfilter',
          'Body color folding remote-controlled pwr mirrors',
          'Dual-stage front airbags w/occupant classification system'
        ])
      },
      {
        id: '9ff03bbc-b18c-4ba7-8f3a-4c4b5c2f6c77',
        plate: 'WXB-3984',
        manufacture: 'BMW',
        model: 'X5',
        image: 'https://res.cloudinary.com/dshomxqjc/image/upload/v1698933251/zpqppydzku2ibgccbsbr.jpg',
        rentPerDay: 800000,
        capacity: 6,
        description:
          ' Rear passenger map pockets. Electrochromic rearview mirror. Dual chrome exhaust tips. Locking glove box.',
        availableAt: '2022-03-23T15:49:05.563Z',
        transmission: 'Automatic',
        available: false,
        type: 'Convertible',
        year: 2019,
        options: ['Keyless Entry', 'Power Windows', 'MP3 (Single Disc)', 'CD (Multi Disc)', 'Navigation'],
        specs: [
          'Rear passenger map pockets',
          'Electrochromic rearview mirror',
          'Dual chrome exhaust tips',
          'Locking glove box',
          'Pwr front vented disc/rear drum brakes'
        ]
      },
      {
        id: 'bf6b5c43-1377-4ae0-8908-310c64266f81',
        plate: 'OSL-4224',
        manufacture: 'Lincoln',
        model: 'MKZ',
        image: 'https://res.cloudinary.com/dshomxqjc/image/upload/v1698933251/zpqppydzku2ibgccbsbr.jpg',
        rentPerDay: 900000,
        capacity: 6,
        description:
          ' Driver & front passenger map pockets. Direct-type tire pressure monitor system. Cargo area lamp. Glove box lamp.',
        availableAt: '2022-03-23T15:49:05.563Z',
        transmission: 'Automanual',
        available: true,
        type: 'Sedan',
        year: 2021,
        options: [
          'Bucket Seats',
          'Airbag: Passenger',
          'Airbag: Driver',
          'Power Seats',
          'Airbag: Side',
          'Antilock Brakes',
          'CD (Multi Disc)'
        ],
        specs: [
          'Driver & front passenger map pockets',
          'Direct-type tire pressure monitor system',
          'Cargo area lamp',
          'Glove box lamp',
          'Silver finish interior door handles',
          'Driver & front passenger advanced multistage airbags w/occupant sensors',
          'Silver accent IP trim finisher -inc: silver shifter finisher',
          'Fasten seat belt warning light/chime'
        ]
      }
    ]

    const getRandomInt = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const populateCars = (cars) => {
      return cars.map((car) => {
        const isPositive = getRandomInt(0, 1) === 1
        const timeAt = new Date()
        // date + 3 day
        const mutator = getRandomInt(10000000, 300000000)
        const availableAt = new Date(timeAt.getTime() + (isPositive ? mutator : -1 * mutator))

        return {
          ...car,
          availableAt,
          options: JSON.stringify(car.options), // Ubah menjadi JSON.stringify
          specs: JSON.stringify(car.specs), // Ubah menjadi JSON.stringify
          createdAt: new Date(), // Tambahkan nilai createdAt
          updatedAt: new Date() // Tambahkan nilai updatedAt
        }
      })
    }

    const cars = populateCars(body)
    return queryInterface.bulkInsert('Cars', cars, {})
  },

  async down (queryInterface, Sequelize) {
    // Lakukan sesuatu untuk mengembalikan keadaan sebelumnya, jika diperlukan
  }
}
