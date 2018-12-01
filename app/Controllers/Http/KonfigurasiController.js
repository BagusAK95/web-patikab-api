'use strict'

const Response = use('App/Helpers/ResponseHelper')
const Konfigurasi = use('App/Models/Konfigurasi')

class KonfigurasiController {
  async set({
    request
  }) {
    try {
      const data = request.only(['judul', 'copyright', 'email', 'kantor', 'no_telp', 'no_fax', 'twitter', 'facebook', 'instagram'])
      data.id = 1

      const konfigurasi = await Konfigurasi.find(1)
      if (konfigurasi) {
        await Konfigurasi.query().where('id', 1).update(data)
      } else {        
        await Konfigurasi.create(data)
      }

      return Response.format(true, 'Berhasil disimpan', null)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async get() {
    try {
      const konfigurasi = await Konfigurasi.find(1)
      if (konfigurasi) { 
        return Response.format(true, null, konfigurasi)
      } else {
        return Response.format(false, 'Konfigurasi tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = KonfigurasiController
