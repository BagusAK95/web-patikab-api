'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {import('@adonisjs/framework/src/Route/Manager'} */

const Route = use('Route')

Route.on('/').render('swaggerUI').as('swaggerUI')

Route.get('/docs.json', () => {
  const swaggerJSDoc = require('swagger-jsdoc')

  const options = {
    swaggerDefinition: {
      info: {
        title: 'Web Kabupaten Pati', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'This is about documentation of Web Kabupaten Pati.'
      },
      basePath: "/",
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    apis: ['./start/routes.js'] // Path to the API docs
  }

  return swaggerJSDoc(options)
}).as('swaggerSpec')

/**
 * @swagger
 * /getToken:
 *   post:
 *     tags:
 *       - User
 *     summary: Get Token
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: nip
 *         in: formData
 *         description: Nomor Induk Pegawai
 *         required: true
 *         type: number
 *       - name: password
 *         in: formData
 *         description: Password
 *         required: true
 *         type: string
 *         format: password
 */
Route.post('/getToken', 'UserController.getToken')

/**
 * @swagger
 * /konten:
 *   post:
 *     tags:
 *       - Konten
 *     summary: Add
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: formData
 *         description: ID Instasi
 *         required: true
 *         type: number
 *         format: number
 *       - name: id_kategori
 *         in: formData
 *         description: ID Kategori
 *         required: true
 *         type: number
 *         format: number
 *       - name: jenis
 *         in: formData
 *         description: Jenis (1=Berita, 2=Article, 3=Halaman)
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: formData
 *         description: Judul Konten
 *         required: true
 *         type: string
 *       - name: isi
 *         in: formData
 *         description: Isi Konten
 *         required: true
 *         type: string
 *       - name: gambar
 *         in: formData
 *         description: Url Gambar
 *         required: false
 *         type: string
 *       - name: url
 *         in: formData
 *         description: Url
 *         required: true
 *         type: string
 *       - name: status_komentar
 *         in: formData
 *         description: Status Komentar (0=Tidak Aktif, 1=Aktif)
 *         required: true
 *         type: number
 *         format: number
 */
Route.post('/konten', 'KontenController.add').middleware('CheckToken')

/**
 * @swagger
 * /konten/{id}:
 *   put:
 *     tags:
 *       - Konten
 *     summary: Update
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: id_kategori
 *         in: formData
 *         description: ID Kategori
 *         required: true
 *         type: number
 *         format: number
 *       - name: jenis
 *         in: formData
 *         description: Jenis (1=Berita, 2=Article, 3=Halaman)
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: formData
 *         description: Judul Konten
 *         required: true
 *         type: string
 *       - name: isi
 *         in: formData
 *         description: Isi Konten
 *         required: true
 *         type: string
 *       - name: gambar
 *         in: formData
 *         description: Url Gambar
 *         required: false
 *         type: string
 *       - name: url
 *         in: formData
 *         description: Url
 *         required: true
 *         type: string
 *       - name: status_komentar
 *         in: formData
 *         description: Status Komentar (0=Tidak Aktif, 1=Aktif)
 *         required: true
 *         type: number
 *         format: number
 */
Route.put('/konten/:id', 'KontenController.update').middleware('CheckToken')

/**
 * @swagger
 * /konten/StatusPublish/{id}:
 *   put:
 *     tags:
 *       - Konten
 *     summary: Update Status Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: status_publish
 *         in: formData
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: true
 *         type: number
 *         format: number
 */
Route.put('/konten/StatusPublish/:id', 'KontenController.updateStatusPublish').middleware('CheckToken')

/**
 * @swagger
 * /konten/Publish:
 *   get:
 *     tags:
 *       - Konten
 *     summary: List Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: judul
 *         in: query
 *         description: Judul
 *         required: false
 *         type: string
 *       - name: jenis
 *         in: query
 *         description: Jenis (1=Berita, 2=Article, 3=Halaman)
 *         required: true
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/konten/Publish', 'KontenController.listPublish')

/**
 * @swagger
 * /konten/Publish/{id}:
 *   get:
 *     tags:
 *       - Konten
 *     summary: Detail Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/konten/Publish/:id', 'KontenController.detailPublish')

/**
 * @swagger
 * /konten:
 *   get:
 *     tags:
 *       - Konten
 *     summary: List
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: query
 *         description: ID Instansi
 *         required: false
 *         type: number
 *         format: number
 *       - name: judul
 *         in: query
 *         description: Judul
 *         required: false
 *         type: string
 *       - name: jenis
 *         in: query
 *         description: Jenis (1=Berita, 2=Article, 3=Halaman)
 *         required: true
 *         type: number
 *         format: number
 *       - name: status_publish
 *         in: query
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: true
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/konten', 'KontenController.list').middleware('CheckToken')

/**
 * @swagger
 * /konten/{id}:
 *   get:
 *     tags:
 *       - Konten
 *     summary: Detail
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/konten/:id', 'KontenController.detail').middleware('CheckToken')

/**
 * @swagger
 * /gallery:
 *   post:
 *     tags:
 *       - Gallery
 *     summary: Add
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: formData
 *         description: ID Instasi
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: formData
 *         description: Judul
 *         required: true
 *         type: string
 *       - name: cover
 *         in: formData
 *         description: Url Cover
 *         required: true
 *         type: string
 *       - name: url
 *         in: formData
 *         description: Url
 *         required: true
 *         type: string
 */
Route.post('/gallery', 'GalleryController.add').middleware('CheckToken')

/**
 * @swagger
 * /gallery/{id}:
 *   put:
 *     tags:
 *       - Gallery
 *     summary: Update
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: formData
 *         description: Judul
 *         required: true
 *         type: string
 *       - name: cover
 *         in: formData
 *         description: Url Cover
 *         required: true
 *         type: string
 *       - name: url
 *         in: formData
 *         description: Url
 *         required: true
 *         type: string
 */
Route.put('/gallery/:id', 'GalleryController.update').middleware('CheckToken')

/**
 * @swagger
 * /gallery/{id}:
 *   delete:
 *     tags:
 *       - Gallery
 *     summary: Delete
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.delete('/gallery/:id', 'GalleryController.delete').middleware('CheckToken')

/**
 * @swagger
 * /gallery:
 *   get:
 *     tags:
 *       - Gallery
 *     summary: List
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: query
 *         description: ID Instansi
 *         required: false
 *         type: number
 *         format: number
 *       - name: judul
 *         in: query
 *         description: Judul
 *         required: false
 *         type: string
 *       - name: status_publish
 *         in: query
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: false
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery', 'GalleryController.list').middleware('CheckToken')

/**
 * @swagger
 * /gallery/Publish:
 *   get:
 *     tags:
 *       - Gallery
 *     summary: List Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: query
 *         description: ID Instansi
 *         required: false
 *         type: number
 *         format: number
 *       - name: judul
 *         in: query
 *         description: Judul
 *         required: false
 *         type: string
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery/Publish', 'GalleryController.listPublish')

/**
 * @swagger
 * /gallery/StatusPublish/{id}:
 *   put:
 *     tags:
 *       - Gallery
 *     summary: Update Status Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: status_publish
 *         in: formData
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: true
 *         type: number
 *         format: number
 */
Route.put('/gallery/StatusPublish/:id', 'GalleryController.updateStatusPublish').middleware('CheckToken')

/**
 * @swagger
 * /gallery/{id}:
 *   get:
 *     tags:
 *       - Gallery
 *     summary: Detail
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery/:id', 'GalleryController.detail').middleware('CheckToken')

/**
 * @swagger
 * /gallery/Publish/{id}:
 *   get:
 *     tags:
 *       - Gallery
 *     summary: Detail Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery/Publish/:id', 'GalleryController.detailPublish')

/**
 * @swagger
 * /gallery-detail:
 *   post:
 *     tags:
 *       - Gallery Detail
 *     summary: Add
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_gallery
 *         in: formData
 *         description: ID Gallery
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: formData
 *         description: Judul
 *         required: true
 *         type: string
 *       - name: gambar
 *         in: formData
 *         description: Url Gambar
 *         required: true
 *         type: string
 *       - name: url
 *         in: formData
 *         description: Url
 *         required: true
 *         type: string
 */
Route.post('/gallery-detail', 'GalleryDetailController.add').middleware('CheckToken')

/**
 * @swagger
 * /gallery-detail/{id}:
 *   put:
 *     tags:
 *       - Gallery Detail
 *     summary: Update
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: formData
 *         description: Judul
 *         required: true
 *         type: string
 *       - name: gambar
 *         in: formData
 *         description: Url Gambar
 *         required: true
 *         type: string
 *       - name: url
 *         in: formData
 *         description: Url
 *         required: true
 *         type: string
 */
Route.put('/gallery-detail/:id', 'GalleryDetailController.update').middleware('CheckToken')

/**
 * @swagger
 * /gallery-detail/{id}:
 *   delete:
 *     tags:
 *       - Gallery Detail
 *     summary: Delete
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.delete('/gallery-detail/:id', 'GalleryDetailController.delete').middleware('CheckToken')

/**
 * @swagger
 * /gallery-detail:
 *   get:
 *     tags:
 *       - Gallery Detail
 *     summary: List
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_gallery
 *         in: query
 *         description: ID Gallery
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: query
 *         description: Judul
 *         required: false
 *         type: string
 *       - name: status_publish
 *         in: query
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: false
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery-detail', 'GalleryDetailController.list').middleware('CheckToken')

/**
 * @swagger
 * /gallery-detail/Publish:
 *   get:
 *     tags:
 *       - Gallery Detail
 *     summary: List Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_gallery
 *         in: query
 *         description: ID Instansi
 *         required: true
 *         type: number
 *         format: number
 *       - name: judul
 *         in: query
 *         description: Judul
 *         required: false
 *         type: string
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery-detail/Publish', 'GalleryDetailController.listPublish')

/**
 * @swagger
 * /gallery-detail/StatusPublish/{id}:
 *   put:
 *     tags:
 *       - Gallery Detail
 *     summary: Update Status Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: status_publish
 *         in: formData
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: true
 *         type: number
 *         format: number
 */
Route.put('/gallery-detail/StatusPublish/:id', 'GalleryDetailController.updateStatusPublish').middleware('CheckToken')

/**
 * @swagger
 * /gallery-detail/{id}:
 *   get:
 *     tags:
 *       - Gallery Detail
 *     summary: Detail
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery-detail/:id', 'GalleryDetailController.detail').middleware('CheckToken')

/**
 * @swagger
 * /gallery-detail/Publish/{id}:
 *   get:
 *     tags:
 *       - Gallery Detail
 *     summary: Detail Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/gallery-detail/Publish/:id', 'GalleryDetailController.detailPublish')

/**
 * @swagger
 * /komentar:
 *   post:
 *     tags:
 *       - Komentar
 *     summary: Add
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jns_konten
 *         in: formData
 *         description: Jenis Konten (1=Berita, 2=Article, 3=Halaman)
 *         required: true
 *         type: number
 *         format: number
 *       - name: id_konten
 *         in: formData
 *         description: Id Konten
 *         required: true
 *         type: number
 *         format: number
 *       - name: email
 *         in: formData
 *         description: Email
 *         required: true
 *         type: string
 *       - name: nama
 *         in: formData
 *         description: Nama
 *         required: true
 *         type: string
 *       - name: isi
 *         in: formData
 *         description: Isi
 *         required: true
 *         type: string
 */
Route.post('/komentar', 'KomentarController.add')

/**
 * @swagger
 * /komentar:
 *   get:
 *     tags:
 *       - Komentar
 *     summary: List
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jns_konten
 *         in: query
 *         description: Jenis Konten (1=Berita, 2=Article, 3=Halaman)
 *         required: true
 *         type: number
 *         format: number
 *       - name: id_konten
 *         in: query
 *         description: Id Konten
 *         required: true
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/komentar', 'KomentarController.list')

/**
 * @swagger
 * /konten-kategori:
 *   post:
 *     tags:
 *       - Konten Kategori
 *     summary: Add
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: formData
 *         description: ID Instasi
 *         required: true
 *         type: number
 *         format: number
 *       - name: nama
 *         in: formData
 *         description: Nama
 *         required: true
 *         type: string
 */
Route.post('/konten-kategori', 'KontenKategoriController.add').middleware('CheckToken')

/**
 * @swagger
 * /konten-kategori/{id}:
 *   put:
 *     tags:
 *       - Konten Kategori
 *     summary: Update
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: nama
 *         in: formData
 *         description: Nama
 *         required: true
 *         type: string
 */
Route.put('/konten-kategori/:id', 'KontenKategoriController.update').middleware('CheckToken')

/**
 * @swagger
 * /konten-kategori/{id}:
 *   delete:
 *     tags:
 *       - Konten Kategori
 *     summary: Delete
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.delete('/konten-kategori/:id', 'KontenKategoriController.delete').middleware('CheckToken')

/**
 * @swagger
 * /konten-kategori:
 *   get:
 *     tags:
 *       - Konten Kategori
 *     summary: List
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: query
 *         description: ID Instansi
 *         required: false
 *         type: number
 *         format: number
 *       - name: nama
 *         in: query
 *         description: Nama
 *         required: false
 *         type: string
 *       - name: status_publish
 *         in: query
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: false
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/konten-kategori', 'KontenKategoriController.list').middleware('CheckToken')

/**
 * @swagger
 * /konten-kategori/Publish:
 *   get:
 *     tags:
 *       - Konten Kategori
 *     summary: List All Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 */
Route.get('/konten-kategori/Publish', 'KontenKategoriController.listAllPublish')

/**
 * @swagger
 * /konten-kategori/StatusPublish/{id}:
 *   put:
 *     tags:
 *       - Konten Kategori
 *     summary: Update Status Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: status_publish
 *         in: formData
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: true
 *         type: number
 *         format: number
 */
Route.put('/konten-kategori/StatusPublish/:id', 'KontenKategoriController.updateStatusPublish').middleware('CheckToken')

/**
 * @swagger
 * /konten-kategori/{id}:
 *   get:
 *     tags:
 *       - Konten Kategori
 *     summary: Detail
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/konten-kategori/:id', 'KontenKategoriController.detail').middleware('CheckToken')

/**
 * @swagger
 * /konfigurasi:
 *   post:
 *     tags:
 *       - Konfigurasi
 *     summary: Set
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: judul
 *         in: formData
 *         description: Judul
 *         required: true
 *         type: string
 *       - name: copyright
 *         in: formData
 *         description: Copyright
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         description: Email
 *         required: true
 *         type: string
 *       - name: kantor
 *         in: formData
 *         description: Kantor
 *         required: true
 *         type: string
 *       - name: no_telp
 *         in: formData
 *         description: No Telp
 *         required: true
 *         type: string
 *       - name: no_fax
 *         in: formData
 *         description: No Fax
 *         required: false
 *         type: string
 *       - name: twitter
 *         in: formData
 *         description: Twitter
 *         required: false
 *         type: string
 *       - name: facebook
 *         in: formData
 *         description: Facebook
 *         required: false
 *         type: string
 *       - name: instagram
 *         in: formData
 *         description: Instagram
 *         required: false
 *         type: string
 */
Route.post('/konfigurasi', 'KonfigurasiController.set').middleware('CheckToken:administrator')

/**
 * @swagger
 * /konfigurasi:
 *   get:
 *     tags:
 *       - Konfigurasi
 *     summary: Get
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 */
Route.get('/konfigurasi', 'KonfigurasiController.get')

/**
 * @swagger
 * /agenda:
 *   post:
 *     tags:
 *       - Agenda
 *     summary: Add
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: formData
 *         description: ID Instasi
 *         required: true
 *         type: number
 *         format: number
 *       - name: nama
 *         in: formData
 *         description: Nama
 *         required: true
 *         type: string
 *       - name: tgl_awal
 *         in: formData
 *         description: Tanggal Awal
 *         required: true
 *         type: string
 *       - name: tgl_akhir
 *         in: formData
 *         description: Tanggal Akhir
 *         required: true
 *         type: string
 *       - name: lokasi
 *         in: formData
 *         description: Lokasi
 *         required: false
 *         type: string
 *       - name: gambar
 *         in: formData
 *         description: Gambar
 *         required: false
 *         type: string
 */
Route.post('/agenda', 'AgendaController.add').middleware('CheckToken')

/**
 * @swagger
 * /agenda/{id}:
 *   put:
 *     tags:
 *       - Agenda
 *     summary: Update
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: nama
 *         in: formData
 *         description: Nama
 *         required: true
 *         type: string
 *       - name: tgl_awal
 *         in: formData
 *         description: Tanggal Awal
 *         required: true
 *         type: string
 *       - name: tgl_akhir
 *         in: formData
 *         description: Tanggal Akhir
 *         required: true
 *         type: string
 *       - name: lokasi
 *         in: formData
 *         description: Lokasi
 *         required: false
 *         type: string
 *       - name: gambar
 *         in: formData
 *         description: Gambar
 *         required: false
 *         type: string
 */
Route.put('/agenda/:id', 'AgendaController.update').middleware('CheckToken')

/**
 * @swagger
 * /agenda/{id}:
 *   delete:
 *     tags:
 *       - Agenda
 *     summary: Delete
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.delete('/agenda/:id', 'AgendaController.delete').middleware('CheckToken')

/**
 * @swagger
 * /agenda:
 *   get:
 *     tags:
 *       - Agenda
 *     summary: List
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: query
 *         description: ID Instansi
 *         required: false
 *         type: number
 *         format: number
 *       - name: nama
 *         in: query
 *         description: Nama
 *         required: false
 *         type: string
 *       - name: status_publish
 *         in: query
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: false
 *         type: number
 *         format: number
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/agenda', 'AgendaController.list').middleware('CheckToken')

/**
 * @swagger
 * /agenda/Publish:
 *   get:
 *     tags:
 *       - Agenda
 *     summary: List Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_opd
 *         in: query
 *         description: ID Instansi
 *         required: false
 *         type: number
 *         format: number
 *       - name: nama
 *         in: query
 *         description: Nama
 *         required: false
 *         type: string
 *       - name: page
 *         in: query
 *         description: Halaman
 *         required: true
 *         type: number
 *         format: number
 *       - name: limit
 *         in: query
 *         description: Jumlah Data
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/agenda/Publish', 'AgendaController.listPublish')

/**
 * @swagger
 * /agenda/StatusPublish/{id}:
 *   put:
 *     tags:
 *       - Agenda
 *     summary: Update Status Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 *       - name: status_publish
 *         in: formData
 *         description: Status Publish (1=Draft, 2=Waiting, 3=Publish)
 *         required: true
 *         type: number
 *         format: number
 */
Route.put('/agenda/StatusPublish/:id', 'AgendaController.updateStatusPublish').middleware('CheckToken')

/**
 * @swagger
 * /agenda/{id}:
 *   get:
 *     tags:
 *       - Agenda
 *     summary: Detail
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/agenda/:id', 'AgendaController.detail').middleware('CheckToken')

/**
 * @swagger
 * /agenda/Publish/{id}:
 *   get:
 *     tags:
 *       - Agenda
 *     summary: Agenda Publish
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID
 *         required: true
 *         type: number
 *         format: number
 */
Route.get('/agenda/Publish/:id', 'AgendaController.detailPublish')
