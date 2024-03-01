const imageRepository = require('../repositories/imageRepository')
const { cloudinary, config } = require('../../config/cloudinary')

module.exports = {
  async upload (file) {
    try {
      const publicId = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const result = await cloudinary.uploader.upload(file, {
        folder: config.dir,
        publicId
      })

      if (!result || !result.url || !result.public_id) {
        throw new Error('Error uploading image to Cloudinary')
      }

      const createdImage = await imageRepository.create({
        public_id: result.public_id,
        url: result.url
      })

      return {
        id: createdImage.id,
        url: createdImage.url,
        public_id: createdImage.public_id
      }
    } catch (error) {
      throw new Error(`Error uploading image: ${error.message}`)
    }
  },

  async delete (id) {
    try {
      const img = await imageRepository.find(id)

      if (!img) {
        throw new Error('Image data not found')
      }

      await cloudinary.uploader.destroy(`${config.dir}/${img.public_id}`)
      await imageRepository.delete(id)

      return true
    } catch (error) {
      throw new Error(`Error deleting image: ${error.message}`)
    }
  },

  async get (id) {
    try {
      if (isNaN(id)) {
        throw new Error('Invalid parameter')
      }

      const img = await imageRepository.find(id)

      if (!img) {
        throw new Error('Image data not found')
      }

      return {
        id: img.id,
        url: img.url,
        public_id: img.public_id
      }
    } catch (error) {
      throw new Error(`Error getting image data: ${error.message}`)
    }
  }
}
