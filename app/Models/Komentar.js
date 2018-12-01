'use strict'

const Model = use('Model')

class Komentar extends Model {
  static get table() {
    return 'komentar'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = Komentar
