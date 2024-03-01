// const { setRandomFallback } = require('bcryptjs')
const userRepository = require('../repositories/userRepository')

module.exports = {
  create (requestBody) {
    return userRepository.create(requestBody)
  },

  delete (id) {
    return userRepository.delete(id)
  },

  //   async list () {
  //     try {
  //       const users = await userRepository.findAll()
  //       const filteredUsers = []
  //       users.forEach(user => {
  //         const tmp = user.dataValues
  //         delete tmp.encrypted_pass
  //         filteredUsers.push(tmp)
  //       })
  //       const userCount = await userRepository.getTotalUser()

  //       return {
  //         data: filteredUsers,
  //         count: userCount
  //       }
  //     } catch (err) {
  //       throw err
  //     }
  //   },
  async list () {
    const users = await userRepository.findAll()
    const filteredUsers = []

    users.forEach(user => {
      const tmp = user.dataValues
      delete tmp.encryptedPassed
      filteredUsers.push(tmp)
    })

    const userCount = await userRepository.getTotalUser()

    return {
      data: filteredUsers,
      count: userCount
    }
  },

  get (id) {
    return userRepository.find(id)
  },

  getByEmail (email) {
    return userRepository.findByEmail(email)
  },

  async isUserExist (email) {
    const result = await userRepository.findByEmail(email)
    return !!(result)
  }
}
