'use strict'

const Model = use('Model')

class KontenKategori extends Model {
  static get table() {
    return 'konten_kategori'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = KontenKategori
