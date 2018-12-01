'use strict'

const Model = use('Model')

class Agenda extends Model {
  static get table() {
    return 'agenda'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = Agenda
