'use strict'

const Model = use('Model')

class GalleryDetail extends Model {
  static get table() {
    return 'gallery_detail'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = GalleryDetail
