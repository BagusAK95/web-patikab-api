'use strict'

const Model = use('Model')

class Opd extends Model {
  static get table() {
    return 'opd'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = Opd
