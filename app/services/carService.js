const carRepository = require('../repositories/carRepository')
const userRepository = require('../repositories/userRepository')
const imageRepository = require('../repositories/imageRepository')

const formatCarData = async (car) => {
  const [creator, updater] = await Promise.all([
    imageRepository.find(car.image_id),
    userRepository.attributesFind(car.createdByUser, ['id', 'name']),
    userRepository.attributesFind(car.lastUpdatedByUser, ['id', 'name'])
  ])

  return {
    id: car.id,
    plate: car.plate,
    manufacture: car.manufacture,
    image: car.image,
    model: car.model,
    rentPerDay: car.rentPerDay,
    capacity: car.capacity,
    description: car.description,
    availableAt: car.availableAt,
    transmission: car.transmission,
    available: car.available,
    type: car.type,
    year: car.year,
    options: car.options,
    specs: car.specs,
    // rent_per_day: car.rent_per_day,
    // image: img,
    createdBy: creator,
    createdAt: car.createdAt,
    updatedBy: updater,
    updatedAt: car.updatedAt
  }
}

const formatDeletedCarData = async (car) => {
  const [img, creator, deleter] = await Promise.all([
    imageRepository.find(car.image_id),
    userRepository.attributesFind(car.createdByUser, ['id', 'name']),
    userRepository.attributesFind(car.deletedByUser, ['id', 'name'])
  ])

  return {
    id: car.id,
    name: car.name,
    size: car.size,
    rent_per_day: car.rent_per_day,
    image: img,
    createdBy: creator,
    createdAt: car.createdAt,
    deletedBy: deleter,
    deletedAt: car.deletedAt
  }
}

module.exports = {
  create (requestBody) {
    return carRepository.create(requestBody)
  },

  update (id, user, requestBody) {
    return carRepository.update(id, {
      ...requestBody,
      updatedByUser: user.id
    })
  },

  // async delete(id, user) {
  //     return Promise.all([
  //         carRepository.update(id, { deletedByUser: user.id }),
  //         carRepository.delete(id)
  //     ])
  // },
  // carService.js

  async delete (id, user) {
    return Promise.all([
      await carRepository.update(id, { deletedByUser: user.id }),
      await carRepository.delete(id)
    ])
  },

  async permanentDelete (id) {
    return carRepository.permanentDelete(id)
  },

  async listDeleted () {
    try {
      const cars = await carRepository.findAll()
      const filteredCars = cars.filter(car => car.deletedAt !== null)
      const formattedCar = await Promise.all(filteredCars.map(car => formatDeletedCarData(car)))
      const carCount = formattedCar.length

      return {
        data: formattedCar,
        count: carCount
      }
    } catch (err) {
      throw new Error(`Error listing deleted cars: ${err.message}`)
    }
  },

  //   async list () {
  //     try {
  //       const cars = await carRepository.findAll()
  //       const filteredCars = cars.filter(car => car.deletedAt === null)
  //       const formattedCar = await Promise.all(filteredCars.map(car => formatCarData(car)))
  //       const carCount = formattedCar.length

  //       return {
  //         data: formattedCar,
  //         count: carCount
  //       }
  //     } catch (err) {
  //       throw err
  //     }
  //   },
  async list () {
    const cars = await carRepository.findAll()
    const filteredCars = cars.filter(car => car.deletedAt === null)
    const formattedCar = await Promise.all(filteredCars.map(car => formatCarData(car)))
    const carCount = formattedCar.length

    return {
      data: formattedCar,
      count: carCount
    }
  },

  async get (id) {
    const car = await carRepository.find(id)
    if (car && car.deletedAt === null) {
      const formattedCar = await formatCarData(car)
      return formattedCar
    }
    return null
  },

  async forceGet (id) {
    const car = await carRepository.find(id)
    if (car && car.deletedAt !== null) {
      const formattedCar = await formatDeletedCarData(car)
      return formattedCar
    }
    return null
  },

  async restore (id, user) {
    const car = await carRepository.find(id)
    if (car.deletedAt !== null) {
      return carRepository.update(id, {
        deletedByUser: null,
        deletedAt: null,
        updatedByUser: user.id
      })
    }
    return null
  }
}
