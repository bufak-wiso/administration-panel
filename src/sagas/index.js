import { takeLatest, takeEvery, all } from 'redux-saga/effects'

/* ------------- Types ------------- */
import { AuthTypes } from '../redux/authRedux'
import { ConferenceTypes } from '../redux/conferenceRedux';
import { CouncilTypes } from '../redux/councilRedux';

/* ------------- Sagas ------------- */
import { login, logout, rehydrateState, registerUser, resetPassword } from './authSagas'
import { 
  getConference,
  applyForConference,
  updatePhases,
  getApplicationList,
  uploadApplicationStatusChange,
  getApplication,
  uploadApplication,
  checkPassword,
} from './conferenceSagas'
import { getCouncil, getCouncilList } from './councilSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // Auth
    takeLatest(AuthTypes.LOGIN, login),
    takeEvery(AuthTypes.LOGOUT, logout),
    takeEvery(AuthTypes.REGISTER_USER, registerUser),
    takeEvery(AuthTypes.REHYDRATE_STATE, rehydrateState),
    takeLatest(AuthTypes.RESET_PASSWORD, resetPassword),
    // Conference
    takeLatest(ConferenceTypes.GET_CONFERENCE, getConference),
    takeLatest(ConferenceTypes.APPLY_FOR_CONFERENCE, applyForConference),
    takeEvery(ConferenceTypes.UPDATE_PHASES, updatePhases),
    takeEvery(ConferenceTypes.GET_APPLICATION_LIST, getApplicationList),
    takeEvery(ConferenceTypes.UPLOAD_APPLICATION_STATUS_CHANGE, uploadApplicationStatusChange),
    takeEvery(ConferenceTypes.GET_APPLICATION, getApplication),
    takeEvery(ConferenceTypes.UPLOAD_APPLICATION, uploadApplication), 
    takeEvery(ConferenceTypes.CHECK_PASSWORD, checkPassword),
    // Council
    takeEvery(CouncilTypes.GET_COUNCIL, getCouncil),
    takeEvery(CouncilTypes.GET_COUNCIL_LIST, getCouncilList),
  ])
}
