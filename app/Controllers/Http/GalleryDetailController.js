'use strict'

const Response = use('App/Helpers/ResponseHelper')
const GalleryDetail = use('App/Models/GalleryDetail')

class GalleryDetailController {
  async add({
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let data = request.only(['id_gallery', 'judul', 'gambar', 'url'])
      data.id_user = user.id

      await GalleryDetail.create(data)

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
      sql.push('id = ' + params.id)

      const galleryDetail = await GalleryDetail.query().whereRaw(sql.join(' AND ')).first()
      if (galleryDetail) {
        let data = request.only(['judul', 'gambar', 'url'])
        data.id_user = user.id

        await GalleryDetail.query()
          .where('id', params.id)
          .update(data)

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'GalleryDetail tidak ditemukan', null)
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
      sql.push('id = ' + params.id)

      const galleryDetail = await GalleryDetail.query().whereRaw(sql.join(' AND ')).first()
      if (galleryDetail) {
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

        galleryDetail.status_publish = data.status_publish
        await galleryDetail.save()

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'GalleryDetail tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async delete({
    params
  }) {
    try {
      const galleryDetail = await GalleryDetail.query().where('id', params.id).first()
      if (galleryDetail) {
        await galleryDetail.delete()

        return Response.format(true, 'Berhasil dihapus', null)
      } else {
        return Response.format(false, 'GalleryDetail tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async list({
    request
  }) {
    try {
      const params = request.get()

      let sql = []
      if (params.judul) sql.push(`MATCH(judul) AGAINST('` + params.judul + `' IN BOOLEAN MODE)`)
      if (params.status_publish) sql.push('status_publish = ' + params.status_publish)
      sql.push('id_gallery = ' + params.id_gallery)
      
      const galleryDetail = await GalleryDetail.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, galleryDetail)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detail({
    params
  }) {
    try {
      const galleryDetail = await GalleryDetail.query().where('id', params.id).first()
      if (galleryDetail) {
        return Response.format(true, null, galleryDetail)
      } else {
        return Response.format(false, 'GalleryDetail tidak ditemukan', null)
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
      if (params.judul) sql.push(`MATCH(judul) AGAINST('` + params.judul + `' IN BOOLEAN MODE)`)
      sql.push('id_gallery = ' + params.id_gallery)
      sql.push('status_publish = 3')

      const galleryDetail = await GalleryDetail.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, galleryDetail)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detailPublish({
    params
  }) {
    try {
      const galleryDetail = await GalleryDetail.query()
        .where({
          id: params.id,
          status_publish: 3
        })
        .first()

      if (galleryDetail) {
        return Response.format(true, null, galleryDetail)
      } else {
        return Response.format(false, 'GalleryDetail tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

}

module.exports = GalleryDetailController
