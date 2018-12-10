'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Link extends Model {
  static get table() {
    return 'link'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = Link
