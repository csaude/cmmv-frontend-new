import { Model } from 'pinia-orm'
import db from 'src/store/localbase'

export default class VMMCArticle extends Model {
  static entity = 'VMMCArticles'
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.string(() => uuidv4()),
      seq: this.attr(''),
      text: this.attr('')
    }
  }

  static localDbAdd (VMMCArticle) {
    return db.newDb().collection('VMMCArticles').add(VMMCArticle)
  }

  static localDbGetById (id) {
    return db.newDb().collection('VMMCArticles').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('VMMCArticles').get()
  }

  static localDbUpdate (VMMCArticle) {
    return db.newDb().collection('VMMCArticles').doc({ id: VMMCArticle.id }).set(VMMCArticle)
  }

  static localDbUpdateAll (VMMCArticles) {
    return db.newDb().collection('VMMCArticles').set(VMMCArticles)
  }

  static localDbDelete (VMMCArticle) {
    return db.newDb().collection('VMMCArticles').doc({ id: VMMCArticle.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('VMMCArticles').delete()
  }
}
