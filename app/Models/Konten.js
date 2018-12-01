'use strict'

const Model = use('Model')

class Konten extends Model {
  static get table() {
    return 'konten'
  }

  static get hidden() {
    return ['id_kategori', 'id_user']
  }

  static get createdAtColumn() {
    return ''
  }

  static get updatedAtColumn() {
    return ''
  }

  kategori_() {
    return this.hasOne('App/Models/KontenKategori', 'id_kategori', 'id')
  }

  user_() {
    return this.hasOne('App/Models/User', 'id_user', 'id')
  }

  opd_ () {
    return this.hasOne('App/Models/Opd', 'id_opd', 'id')
  }
}

module.exports = Konten
