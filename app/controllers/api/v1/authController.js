const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userService = require('../../../services/userService')
const encryption = require('../../../../config/encryption')

async function checkPassword (encryptedPassed, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassed, (err, isPasswordCorrect) => {
      if (err) {
        reject(err)
        return
      }

      resolve(isPasswordCorrect)
    })
  })
}

function createToken (payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || encryption.SIGNATURE_KEY)
}

async function authorize (req, res, next, allowedRole) {
  try {
    const bearerToken = req.headers.authorization
    const token = bearerToken.split('Bearer ')[1]
    const tokenPayload = jwt.verify(
      token,
      process.env.JWT_SIGNATURE_KEY || encryption.SIGNATURE_KEY
    )

    const user = await userService.get(tokenPayload.id)
    if (!allowedRole.includes(user.role)) {
      throw new Error('Unauthorized')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({
      status: 'failed',
      message: 'Unauthorized'
    })
  }
}

async function authorizeMember (req, res, next) {
  authorize(req, res, next, ['member', 'admin', 'superadmin'])
}

async function authorizeAdmin (req, res, next) {
  authorize(req, res, next, ['admin', 'superadmin'])
}

async function  authorizeSuper (req, res, next) {
  authorize(req, res, next, ['superadmin'])
}

module.exports = {
  authorize,
  authorizeAdmin,
  authorizeMember,
  authorizeSuper,
  createToken,
  checkPassword,
  async login (req, res) {
    if (!req.body.email || !req.body.password) {
      res.status(422).json({
        status: 'failed',
        message: 'Missing fields required'
      })
    } else {
      const email = req.body.email.toLowerCase()
      const password = req.body.password
      const user = await userService.getByEmail(email)

      if (!user) {
        res.status(401).json({
          status: 'failed',
          message: 'Email is not registered'
        })
        return
      }

      const isPasswordCorrect = await checkPassword(user.encryptedPassed, password)

      if (!isPasswordCorrect) {
        res.status(401).json({
          status: 'failed',
          message: 'Wrong password'
        })
        return
      }

      const token = createToken({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })

      res.status(201).json({
        status: 'success',
        message: 'login successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    }
  },

  // async authorizeMember (req, res, next) {
  //   authorize(req, res, next, ['member', 'admin', 'superadmin'])
  // },

  // async authorizeAdmin (req, res, next) {
  //   authorize(req, res, next, ['admin', 'superadmin'])
  // },

  // async authorizeSuper (req, res, next) {
  //   authorize(req, res, next, ['superadmin'])
  // },

  async loginAdmin (req, res) {
    if (!req.body.email || !req.body.password) {
      res.status(422).json({
        status: 'failed',
        message: 'Missing fields required'
      })
    } else {
      const email = req.body.email.toLowerCase()
      const password = req.body.password
      const user = await userService.getByEmail(email)

      // Periksa apakah pengguna ada dan memiliki peran superadmin
      if (!user || user.role !== 'superadmin') {
        res.status(401).json({
          status: 'failed',
          message: 'Unauthorized'
        })
        return
      }

      const isPasswordCorrect = await checkPassword(user.encryptedPassed, password)

      if (!isPasswordCorrect) {
        res.status(401).json({
          status: 'failed',
          message: 'Wrong password'
        })
        return
      }

      const token = createToken({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })

      res.status(201).json({
        status: 'success',
        message: 'Login successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    }
  }
}