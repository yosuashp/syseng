const { Car } = require('../models')
// const Sequelize = require('sequelize')
// const Op = Sequelize.Op
const { v4: uuidv4 } = require('uuid')

module.exports = {
  create (createArgs) {
    // Pastikan `id` terisi dengan UUID
    createArgs.id = createArgs.id || uuidv4()
    return Car.create(createArgs)
  },

  update (id, updateArgs) {
    return Car.update(updateArgs, {
      where: {
        id
      },
      paranoid: false
    })
  },

  delete (id) {
    return Car.destroy({ where: { id } })
  },

  permanentDelete (id) {
    return Car.destroy({ where: { id }, force: true })
  },

  find (id) {
    return Car.findByPk(id, { paranoid: false })
  },

  findAll () {
    return Car.findAll({ paranoid: false })
  },

  getTotalCar () {
    return Car.count()
  }
}
