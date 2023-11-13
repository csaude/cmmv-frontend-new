import { useRepo } from 'pinia-orm';
import api from '../apiService/apiService';
import { nSQL } from 'nano-sql';
import Appointment from 'src/stores/models/appointment/Appointment';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';

const appointment = useRepo(Appointment);

const { alertSucess, alertError } = useSwal();
const { isMobile, isOnline } = useSystemUtils();

export default {
  post(params: string) {
    if (isMobile.value && !isOnline.value) {
      return this.putMobile(params);
    } else {
      return this.postWeb(params);
    }
  },
  get(offset: number) {
    if (isMobile.value && !isOnline.value) {
      this.getMobile();
    } else {
      return this.getWeb(offset);
    }
  },
  patch(uid: string, params: string) {
    if (isMobile.value && !isOnline.value) {
      return this.putMobile(params);
    } else {
      return this.patchWeb(uid, params);
    }
  },
  delete(uuid: string) {
    if (isMobile.value && !isOnline.value) {
      this.deleteMobile(uuid);
    } else {
      return this.deleteWeb(uuid);
    }
  },
  // WEB
  postWeb(params: string) {
    return api()
      .post('appointment', params)
      .then((resp) => {
        appointment.save(resp.data);
      });
  },
  getWeb(offset: number) {
    if (offset >= 0) {
      return api()
        .get('appointment?offset=' + offset + '&max=100')
        .then((resp) => {
          appointment.save(resp.data);
          offset = offset + 100;
          if (resp.data.length > 0) {
            this.get(offset);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  patchWeb(uuid: string, params: string) {
    return api()
      .patch('appointment/' + uuid, params)
      .then((resp) => {
        appointment.save(resp.data);
      });
  },
  deleteWeb(uuid: string) {
    return api()
      .delete('appointment/' + uuid)
      .then(() => {
        appointment.destroy(uuid);
      });
  },

  getAppointments(id_clinicUser: any) {
    // Buscar as consults pelo id da clinica logada
    return api()
      .get('/appointment/clinic/' + id_clinicUser)
      .then((resp) => {
        console.log(resp);
        let appointmentApiList = [];
        appointmentApiList = resp.data;
        appointmentApiList.forEach((appointment) => {
          if (appointment.status === 'CONFIRMADO') {
            appointment.syncStatus = 'S';
          }
          this.putMobile(appointment);
        });
      })
      .catch((error) => {
        console.log('Erro no code ' + error);
      });
  },

  // Mobile
  putMobile(params: string) {
    return nSQL(Appointment.entity)
      .query('upsert', params)
      .exec()
      .then((resp) => {
        appointment.save(resp[0].affectedRows);
      });
  },
  async getMobile() {
    return nSQL(Appointment.entity)
      .query('select')
      .exec()
      .then((rows: any) => {
        appointment.save(rows);
        return rows;
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  deleteMobile(paramsId: string) {
    return nSQL(Appointment.entity)
      .query('delete')
      .where(['id', '=', paramsId])
      .exec()
      .then(() => {
        appointment.destroy(paramsId);
        alertSucess('O Registo foi removido com sucesso');
      })
      .catch((error: any) => {
        // alertError('Aconteceu um erro inesperado nesta operação.');
        console.log(error);
      });
  },
  apiGetAppointmentsByClinicId (clinicId:number){
  return api().get('/appointment/clinic/' + clinicId).then(resp => {
      appointment.save(resp.data);
      return resp;
    })
  },
  async getFromMobileById (id:number){
    return await nSQL(Appointment
      .entity)
        .query('select')
        .where(['id','=',id])
        .exec()
        .then((rows: any) => {
        console.log(rows)
        return rows[0];
        })
        .catch((error: any) => {
          // alertError('Aconteceu um erro inesperado nesta operação.');
          console.log(error);
        });
    },
    async getAppointmentToSendFromMobile(){
      return await nSQL(Appointment
        .entity)
          .query('select')
          .where(appointment => ((appointment.status = 25 && appointment.syncStatus != 'S') ||
          (appointment.hasHappened && appointment.syncStatus !== 'S')))
          .exec()
          .then((rows: any) => {
          console.log(rows)
          return rows;
          })
          .catch((error: any) => {
            console.log(error);
          });
      },
  // Local Storage Pinia
  newInstanceEntity() {
    return appointment.getModel().$newInstance();
  },
  getAllFromStorage() {
    return appointment.all();
  },
  deleteAllFromStorage() {
    appointment.flush();
  },
  getAppointmentByUtenteId(utenteId:number) {
    return appointment.query().where('utente_id', utenteId).first()
  }
  getPendingAssignment(searchText: string) {
    if (searchText.length === 0) {
      return appointment
        .query()
        .with('utente')
        .with('clinic.province')
        .with('clinic.district.province')
        .with('utente.address')
        .with('utente.province')
        .with('utente.district.province')
        .with('utente.communityMobilizer')
        .with('utente.clinic')
        .where((appointment) => {
          return (
            appointment.status === 'PENDENTE' &&
            appointment.appointmentDate !== '' &&
            appointment.clinic_id ===
              Number(localStorage.getItem('id_clinicUser'))
          );
        })
        .orderBy('appointmentDate', 'desc')
        .get();
    } else {
      // this.appointmentsPendingToFilter = this.appointmentsPending
      return appointment
        .query()
        .with('utente')
        .with('clinic.province')
        .with('clinic.district.province')
        .with('utente.address')
        .with('utente.province')
        .with('utente.district.province')
        .with('utente.communityMobilizer')
        .with('utente.clinic')
        .where((appointment) => {
          return (
            appointment.status === 'PENDENTE' &&
            appointment.appointmentDate !== '' &&
            appointment.clinic_id ===
              Number(localStorage.getItem('id_clinicUser'))
          );
        })
        .whereHas('utente', (query) => {
          query.where((utente) => {
            return (
              utente.systemNumber
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              utente.firstNames
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              utente.lastNames.toLowerCase().includes(searchText.toLowerCase())
            );
          });
        })
        .orderBy('appointmentDate', 'desc')
        .get();
    }
  },

  getConfirmedAssignment(searchTextConfirmed: any, searchText: any) {
    if (searchTextConfirmed.length === 0) {
      return appointment
        .query()
        .with('utente')
        .with('clinic.province')
        .with('clinic.district.province')
        .with('utente.address')
        .with('utente.province')
        .with('utente.district.province')
        .with('utente.communityMobilizer')
        .with('utente.clinic')
        .where((appointment) => {
          return (
            appointment.status === 'CONFIRMADO' &&
            !appointment.hasHappened &&
            appointment.appointmentDate !== '' &&
            appointment.clinic_id ===
              Number(localStorage.getItem('id_clinicUser'))
          );
        })
        .orderBy('appointmentDate', 'desc')
        .get();
    } else {
      return appointment
        .query()
        .with('utente')
        .with('clinic.province')
        .with('clinic.district.province')
        .with('utente.address')
        .with('utente.province')
        .with('utente.district.province')
        .with('utente.communityMobilizer')
        .with('utente.clinic')
        .where((appointment) => {
          return (
            appointment.status === 'CONFIRMADO' &&
            !appointment.hasHappened &&
            appointment.appointmentDate !== '' &&
            appointment.clinic_id ===
              Number(localStorage.getItem('id_clinicUser'))
          );
        })
        .whereHas('utente', (query) => {
          query.where((utente) => {
            return (
              utente.systemNumber
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              utente.firstNames
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              utente.lastNames.toLowerCase().includes(searchText.toLowerCase())
            );
          });
        })
        .orderBy('appointmentDate', 'desc')
        .get();
    }
  },
};
