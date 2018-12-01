'use strict'

const Model = use('Model')

class Konfigurasi extends Model {
  static get table() {
    return 'konfigurasi'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = Konfigurasi
