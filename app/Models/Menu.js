'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Menu extends Model {
  static get table() {
    return 'menu'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = Menu
