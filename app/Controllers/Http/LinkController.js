'use strict'

const Response = use('App/Helpers/ResponseHelper')
const Link = use('App/Models/Link')

class LinkController {
  async add({
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let data = request.only(['id_opd', 'judul', 'gambar', 'url'])
      data.id_user = user.id

      await Link.create(data)

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

      const link = await Link.query().whereRaw(sql.join(' AND ')).first()
      if (link) {
        let data = request.only(['judul', 'gambar', 'url'])
        data.id_user = user.id_user

        await Link.query()
          .where('id', params.id)
          .update(data)

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Link tidak ditemukan', null)
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

      const link = await Link.query().whereRaw(sql.join(' AND ')).first()
      if (link) {
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

        link.status_publish = data.status_publish
        await link.save()

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Link tidak ditemukan', null)
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

      const link = await Link.query().whereRaw(sql.join(' AND ')).first()
      if (link) {
        await Link.query().where('id', params.id).delete()

        return Response.format(true, 'Berhasil dihapus', null)
      } else {
        return Response.format(false, 'Link tidak ditemukan', null)
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
      if (params.judul) sql.push(`MATCH(judul) AGAINST('` + params.judul + `' IN BOOLEAN MODE)`)
      if (params.status_publish) sql.push('status_publish = ' + params.status_publish)

      const link = await Link.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, link)
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

      const link = await Link.query()
        .whereRaw(sql.join(' AND '))
        .first()

      if (link) {
        return Response.format(true, null, link)
      } else {
        return Response.format(false, 'Link tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async listPublish({
    request
  }) {
    try {
      const params = request.get()

      let sql = []
      if (params.id_opd) sql.push('id_opd = ' + params.id_opd)
      if (params.judul) sql.push(`MATCH(judul) AGAINST('` + params.judul + `' IN BOOLEAN MODE)`)
      sql.push('status_publish = 3')

      const link = await Link.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, link)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detailPublish({
    params
  }) {
    try {
      const link = await Link.query()
        .where({
          id: params.id,
          status_publish: 3
        })
        .first()

      if (link) {
        return Response.format(true, null, link)
      } else {
        return Response.format(false, 'Link tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = LinkController
