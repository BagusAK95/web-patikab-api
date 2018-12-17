'use strict'

const Response = use('App/Helpers/ResponseHelper')
const Konten = use('App/Models/Konten')

class KontenController {
  async add({
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let data = request.only(['id_opd', 'id_kategori', 'jenis', 'judul', 'isi', 'gambar', 'url', 'status_komentar'])
      data.id_user = user.id

      await Konten.create(data)

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

      const konten = await Konten.query().whereRaw(sql.join(' AND ')).first()
      if (konten) {
        let data = request.only(['id_kategori', 'jenis', 'judul', 'isi', 'gambar', 'url', 'status_komentar'])
        data.id_user = user.id

        await Konten.query().where('id', params.id).update(data)

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Konten tidak ditemukan', null)
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

      const konten = await Konten.query().whereRaw(sql.join(' AND ')).first()
      if (konten) {
        switch (data.status_publish) {
          case 1: //Draft
            return Response.format(false, 'Status tidak diijinkan', null)
          case 2: //Waiting
            if (user.level != 2) return Response.format(false, 'Status tidak diijinkan', null)
            break
          case 3: //Publish
            if (user.level != 1) return Response.format(false, 'Status tidak diijinkan', null)
            break
        }

        konten.status_publish = data.status_publish
        await konten.save()

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Konten tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async listPublish({
    request
  }) {
    try {
      let sql = []
      if (request.get().judul) sql.push(`MATCH(judul) AGAINST('` + request.get().judul + `' IN BOOLEAN MODE)`)
      sql.push('jenis = ' + request.get().jenis)
      sql.push('status_publish = 3')

      const konten = await Konten.query()
        .whereRaw(sql.join(' AND '))
        .with('kategori_').with('user_').with('opd_')
        .paginate(Number(request.get().page), Number(request.get().limit))

      return Response.format(true, null, konten)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detailPublish({
    params
  }) {
    try {
      const konten = await Konten.query()
        .where({
          id: params.id,
          status_publish: 3
        })
        .with('kategori_').with('user_').with('opd_')
        .first()

      if (konten) {
        return Response.format(true, null, konten)
      } else {
        return Response.format(false, 'Konten tidak ditemukan', null)
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
      const user = await auth.getUser()
      const params = request.get()

      let sql = []
      if (user.level == 2) {
        sql.push('id_opd = ' + user.id_opd)
      } else {
        if (params.id_opd) sql.push('id_opd = ' + params.id_opd)
      }
      if (request.get().judul) sql.push(`MATCH(judul) AGAINST('` + request.get().judul + `' IN BOOLEAN MODE)`)
      sql.push('jenis = ' + request.get().jenis)
      sql.push('status_publish = ' + request.get().status_publish)

      const konten = await Konten.query()
        .with('kategori_').with('user_').with('opd_')
        .whereRaw(sql.join(' AND '))
        .paginate(Number(request.get().page), Number(request.get().limit))

      return Response.format(true, null, konten)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detail({
    params,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const konten = await Konten.query()
        .with('kategori_').with('user_').with('opd_')
        .whereRaw(sql.join(' AND '))
        .first()

      if (konten) {
        return Response.format(true, null, konten)
      } else {
        return Response.format(false, 'Konten tidak ditemukan', null)
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

      const konten = await Gallery.query().whereRaw(sql.join(' AND ')).first()
      if (konten) {
        await Konten.query().where('id', params.id).delete()

        return Response.format(true, 'Berhasil dihapus', null)
      } else {
        return Response.format(false, 'Konten tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = KontenController
