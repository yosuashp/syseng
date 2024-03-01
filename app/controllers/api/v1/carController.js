// const { permanentDelete } = require('../../../repositories/carRepository')
const carService = require('../../../services/carService')

module.exports = {
  // list(req, res) {
  //     carService
  //         .list()
  //         .then(({ data, count }) => {
  //             res.status(200).json({
  //                 status: "success",
  //                 message: "Get cars data successfully",
  //                 data,
  //                 meta: { total: count },
  //             });
  //         })
  //         .catch((err) => {
  //             console.log(err);
  //             res.status(500).json({
  //                 status: "error",
  //                 message: err.message,
  //             });
  //         });
  // },
  listUser (req, res) {
    const { page = 1, size = 10 } = req.query

    carService
      .list({ page, size }) // Mengirimkan query parameters ke dalam fungsi list
      .then(({ data, count }) => {
        res.status(200).json({
          status: 'success',
          message: 'Get cars data successfully',
          data,
          meta: {
            total: count,
            page: parseInt(page),
            size: parseInt(size)
          }
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          status: 'error',
          message: err.message
        })
      })
  },

  listDeleted (req, res) {
    carService
      .listDeleted()
      .then(({ data, count }) => {
        res.status(200).json({
          status: 'success',
          message: 'Get archived cars data successfully',
          data,
          meta: { total: count }
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          status: 'error',
          message: err.message
        })
      })
  },

  async show (req, res) {
    try {
      // if (isNaN(req.params.id)) throw new Error("Invalid parameter");
      const id = req.params.id
      const car = await carService.get(id)
      if (!car) {
        res.status(404).json({
          status: 'failed',
          message: 'Car data not found'
        })
      } else {
        carService
          .get(id)
          .then((car) => {
            res.status(200).json({
              status: 'success',
              message: 'Get car data successfully',
              data: car
            })
          })
          .catch((err) => {
            res.status(500).json({
              status: 'error',
              message: err.message
            })
          })
      }
    } catch (err) {
      res.status(422).json({
        status: 'failed',
        message: err.message
      })
    }
  },

  async forceShow (req, res) {
    try {
      // if (isNaN(req.params.id)) throw new Error("Invalid parameter");
      const id = req.params.id
      const car = await carService.forceGet(id)
      if (!car) {
        res.status(404).json({
          status: 'failed',
          message: 'Archived car data not found'
        })
      } else {
        carService
          .forceGet(id)
          .then((car) => {
            res.status(200).json({
              status: 'success',
              message: 'Get archived car data successfully',
              data: car
            })
          })
          .catch((err) => {
            res.status(500).json({
              status: 'error',
              message: err.message
            })
          })
      }
    } catch (err) {
      res.status(422).json({
        status: 'failed',
        message: err.message
      })
    }
  },

  // controllers/api/v1/carController.js

  create (req, res) {
    const { plate, manufacture, model, image, rentPerDay, capacity, description, availableAt, transmission, available, type, year, options, specs } = req.body

    if (!plate || !model || !rentPerDay) {
      res.status(422).json({
        status: 'failed',
        message: 'Missing required fields'
      })
    } else {
      carService
        .create({
          availableAt,
          plate,
          manufacture,
          model,
          image,
          rentPerDay,
          capacity,
          description,
          transmission,
          available,
          type,
          year,
          options,
          specs,
          createdByUser: req.user.id,
          lastUpdatedByUser: req.user.id
        })
        .then((car) => {
          res.status(201).json({
            status: 'success',
            message: 'Create car data successfully',
            data: {
              id: car.id,
              plate: car.plate,
              manufacture: car.manufacture,
              model: car.model,
              rentPerDay: car.rentPerDay,
              image_id: car.image_id // Jika image_id perlu dimasukkan
              // Tambahkan field lainnya sesuai kebutuhan
            }
          })
        })
        .catch((err) => {
          res.status(500).json({
            status: 'error',
            message: err.message
          })
        })
    }
  },

  // async update(req, res) {
  //     try {
  //         // if (isNaN(req.params.id)) throw new Error("Invalid parameter");
  //         const id = req.params.id;
  //         const car = await carService.get(id)
  //         if (!car) {
  //             res.status(404).json({
  //                 status: "failed",
  //                 message: "Car data not found"
  //             })
  //         } else {
  //             const allowedUpdate = ["plate", "manufacture", "model", "capacity"];
  //             for (const key of Object.keys(req.body)) {
  //                 if (!allowedUpdate.includes(key)) {
  //                     res.status(422).json({
  //                         status: "failed",
  //                         message: "Invalid data",
  //                     })
  //                     console.log(key)
  //                     return
  //                 }
  //             }
  //             console.log(res.key)
  //             carService
  //                 .update(req.params.id, req.user, req.body)
  //                 .then(() => {
  //                     res.status(200).json({
  //                         status: "success",
  //                         message: "Update car data successfully"
  //                     });
  //                 })
  //                 .catch((err) => {
  //                     res.status(500).json({
  //                         status: "error",
  //                         message: err.message,
  //                     });
  //                 });
  //         }
  //     } catch (err) {
  //         res.status(422).json({
  //             status: "failed",
  //             message: err.message,
  //         });
  //     }
  // },

  async update (req, res) {
    try {
      const id = req.params.id
      const car = await carService.get(id)

      if (!car) {
        return res.status(404).json({
          status: 'failed',
          message: 'Data mobil tidak ditemukan'
        })
      }

      const { plate, manufacture, model, capacity } = req.body

      // Pastikan data yang dibutuhkan ada
      if (!plate || !manufacture || !model || !capacity) {
        return res.status(422).json({
          status: 'failed',
          message: 'Data tidak valid: pastikan semua parameter terpenuhi'
        })
      }

      // Kecualikan kunci-kunci yang tidak boleh diupdate
      const keysToExclude = ['rentPerDay', 'description', 'availableAt', 'transmission', 'available', 'type', 'year', 'options', 'specs', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']

      const updatedData = {}
      for (const key in req.body) {
        if (!keysToExclude.includes(key)) {
          updatedData[key] = req.body[key]
        }
      }

      carService
        .update(id, req.user, updatedData)
        .then(() => {
          res.status(200).json({
            status: 'success',
            message: 'Berhasil memperbarui data mobil'
          })
        })
        .catch((err) => {
          res.status(500).json({
            status: 'error',
            message: err.message
          })
        })
    } catch (err) {
      res.status(422).json({
        status: 'failed',
        message: err.message
      })
    }
  },

  async delete (req, res) {
    try {
      // if (isNaN(req.params.id)) throw new Error("Invalid parameter");
      const id = req.params.id
      const car = await carService.get(id)

      if (!car) {
        res.status(404).json({
          status: 'failed',
          message: 'Car data not found'
        })
      } else {
        carService.delete(id, req.user)
          .then((result) => {
            console.log(result)
            res.status(200).json({
              status: 'success',
              message: 'Delete car data successfully'
            })
          })
          .catch((err) => {
            res.status(500).json({
              status: 'error',
              message: err.message
            })
          })
      }
    } catch (err) {
      res.status(422).json({
        status: 'failed',
        message: err.message
      })
    }
  },

  async permanentDelete (req, res) {
    try {
      // if (isNaN(req.params.id)) throw new Error("Invalid parameter");
      const id = req.params.id
      const car = await carService.forceGet(id)

      if (!car) {
        res.status(404).json({
          status: 'failed',
          message: 'Archived car data not found'
        })
      } else {
        carService.permanentDelete(id)
          .then((result) => {
            console.log(result)
            res.status(200).json({
              status: 'success',
              message: 'Destroy car data successfully'
            })
          })
          .catch((err) => {
            res.status(500).json({
              status: 'error',
              message: err.message
            })
          })
      }
    } catch (err) {
      res.status(422).json({
        status: 'failed',
        message: err.message
      })
    }
  },

  async restore (req, res) {
    try {
      // if (isNaN(req.params.id)) throw new Error("Invalid parameter");
      const id = req.params.id
      const car = await carService.forceGet(id)

      if (!car) {
        res.status(404).json({
          status: 'failed',
          message: 'Archived car data not found'
        })
      } else {
        carService.restore(id, req.user)
          .then((result) => {
            console.log(result)
            res.status(200).json({
              status: 'success',
              message: 'Restore car data successfully'
            })
          })
          .catch((err) => {
            res.status(500).json({
              status: 'error',
              message: err.message
            })
          })
      }
    } catch (err) {
      res.status(422).json({
        status: 'failed',
        message: err.message
      })
    }
  }

}
