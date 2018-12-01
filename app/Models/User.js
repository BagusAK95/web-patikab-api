'use strict'

const Model = use('Model')

class User extends Model {
  static get table() {
    return 'user'
  }

  static get hidden() {
    return ['password']
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

module.exports = User
