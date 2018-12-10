'use strict'

const Komentar = use('App/Models/Komentar')
const Response = use('App/Helpers/ResponseHelper')

class KomentarController {
  async add({
    request
  }) {
    try {
      const data = request.only(['id_konten', 'email', 'nama', 'isi'])

      await Komentar.create(data)
      
      return Response.format(true, 'Berhasil disimpan', null)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async list({
    request
  }) {
    try {
      const params = request.get()

      const data = await Komentar.query()
        .where('id_konten', params.id_konten)
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, data)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = KomentarController
