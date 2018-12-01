'use strict'

const Model = use('Model')

class Gallery extends Model {
  static get table() {
    return 'gallery'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }

  opd_ () {
    return this.hasOne('App/Models/Opd', 'id_opd', 'id')
  }
}

module.exports = Gallery
