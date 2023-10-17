import { Model } from 'pinia-orm';
import District from '../district/District'
import Utente from '../utente/Utente'
import { v4 as uuidv4 } from 'uuid'

export default class Address extends Model {
  static entity = 'addresses'
  static primaryKey = 'id'
  static fields () {
    return {
      id: this.string(() => uuidv4()),
      neighboorhood: this.attr(''),
      city: this.attr(''),
      residence: this.attr(''),
      latitude: this.attr(''),
      longitude: this.attr(''),
      district_id: this.attr(''),
      utente_id: this.attr(''),

      // Relationships
      district: this.belongsTo(District, 'district_id'),
      utente: this.belongsTo(Utente, 'utente_id')
    }
  }
}
