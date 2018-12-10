'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ProgramKerja extends Model {
  static get table() {
    return 'program_kerja'
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }
}

module.exports = ProgramKerja
