import { Model } from 'pinia-orm'
// import db from 'src/store/localbase'

export default class InfoDocsOrImages extends Model {
  static entity = 'infodocsOrImages'

  static fields () {
    return {
      id: this.attr(null),
      title: this.attr(''),
      createdDate: this.attr(''),
      publishedDate: this.attr(''),
      blop: this.attr(''),
      forMobilizer: this.attr('')

      // Relationships
      // users: this.hasMany(Utente, 'utente_id'),
      // mobilizers: this.hasMany(CommunityMobilizer, 'community_mobilizer_id')
    }
  }

  /*
  static localDbAdd (infodocsOrImage) {
    return db.newDb().collection('infodocsOrImages').add(infodocsOrImage)
  }

  static localDbGetById (id) {
    return db.newDb().collection('infodocsOrImages').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('infodocsOrImages').get()
  }

  static localDbUpdate (infodocsOrImage) {
    return db.newDb().collection('infodocsOrImages').doc({ id: infodocsOrImage.id }).set(infodocsOrImage)
  }

  static localDbUpdateAll (infodocsOrImages) {
    return db.newDb().collection('infodocsOrImages').set(infodocsOrImages)
  }

  static localDbDelete (infodocsOrImage) {
    return db.newDb().collection('infodocsOrImages').doc({ id: infodocsOrImage.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('infodocsOrImages').delete()
  }
  */
}
