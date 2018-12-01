'use strict'

const Response = use('App/Helpers/ResponseHelper')
const KontenKategori = use('App/Models/KontenKategori')

class KontenKategoriController {
  async add({
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let data = request.only(['id_opd', 'nama'])
      data.id_user = user.id

      await KontenKategori.create(data)

      return Response.format(true, 'Berhasil disimpan', null)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async update({
    params,
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const kategori = await KontenKategori.query().whereRaw(sql.join(' AND ')).first()
      if (kategori) {
        let data = request.only(['nama'])
        data.id_user = user.id_user

        await KontenKategori.query()
          .where('id', params.id)
          .update(data)

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Kategori tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async updateStatusPublish({
    params,
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()
      const data = request.only(['status_publish'])

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const kategori = await KontenKategori.query().whereRaw(sql.join(' AND ')).first()
      if (kategori) {
        switch (Number(data.status_publish)) {
          case 1: //Draft
            return Response.format(false, 'Status tidak diijinkan', null)
          case 2: //Waiting
            if (user.level != 2) return Response.format(false, 'Status tidak diijinkan', null)
            break
          case 3: //Publish
            if (user.level != 1) return Response.format(false, 'Status tidak diijinkan', null)
            break
        }

        kategori.status_publish = data.status_publish
        await kategori.save()

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Kategori tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async delete({
    params,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const kategori = await KontenKategori.query().whereRaw(sql.join(' AND ')).first()
      if (kategori) {
        await kategori.delete()

        return Response.format(true, 'Berhasil dihapus', null)
      } else {
        return Response.format(false, 'Kategori tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async list({
    request,
    auth
  }) {
    try {
      const user = auth.getUser()
      const params = request.get()

      let sql = []
      if (user.level == 2) {
        sql.push('id_opd = ' + user.id_opd)
      } else {
        if (params.id_opd) sql.push('id_opd = ' + params.id_opd)
      }
      if (params.nama) sql.push(`nama LIKE '%` + params.nama + `%'`)
      if (params.status_publish) sql.push('status_publish = ' + params.status_publish)

      const kategori = await KontenKategori.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, kategori)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detail({
    params,
    auth
  }) {
    try {
      const user = auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const kategori = await KontenKategori.query()
        .whereRaw(sql.join(' AND '))
        .first()

      if (kategori) {
        return Response.format(true, null, kategori)
      } else {
        return Response.format(false, 'Kategori tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async listAllPublish() {
    try {
      const kategori = await KontenKategori.query().where('status_publish', 3)

      return Response.format(true, null, kategori)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = KontenKategoriController
