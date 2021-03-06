import { call, put, select } from 'redux-saga/effects'
import AuthActions from '../redux/authRedux'
import ConferenceActions from '../redux/conferenceRedux'
import CouncilActions from '../redux/councilRedux'
import WorkshopActions from '../redux/workshopRedux'
import { apiFetch } from '../utils/functions'
import { getWorkshopApplication } from './workshopSagas'

export function* login(action) { 
  try {
    yield put(AuthActions.updateFetching(true))
    yield put(AuthActions.updateError(false))
    const { email, password, remeberMe } = action
    if(email && password) {
      const result = yield call(apiFetch, 'login', 'post', { email, password })
      if(result.tokenString) {
        const data = JSON.stringify({
          user: result.user,
          token: result.tokenString,
          conferences: result.conferences,
          userForConference: result.userForConference
        })

        if (remeberMe) {
          localStorage.setItem('data', data);
        } else {
          sessionStorage.setItem('data', data);
        }

        yield put(AuthActions.updateToken(result.tokenString))
        yield put(AuthActions.updateUser(result.user))
        yield put(ConferenceActions.updateConferenceList(result.conferences))
        yield put(AuthActions.updateUserForConference( result.userForConference))
        yield put(AuthActions.updateFetching(false))
        // get workshop application
        yield call(getWorkshopApplication, result.user)

      } else {
        yield put(AuthActions.updateError(true))
        yield put(AuthActions.updateFetching(false))
      }
    }
  } catch(e) {
    yield put(AuthActions.updateError(true))
    yield put(AuthActions.updateFetching(false))
    console.log('Login:', e)
  }
}

export function* rehydrateState() {
  const result = JSON.parse(sessionStorage.getItem('data'))
  if (result.token) {
    yield put(AuthActions.updateToken(result.token))
    yield put(AuthActions.updateUser(result.user))
    yield put(ConferenceActions.updateConferenceList(result.conferences))
    yield put(AuthActions.updateUserForConference( result.userForConference))
    yield put(AuthActions.updateFetching(false))
  }
}

export function* registerUser(params){
  try{
    yield put(AuthActions.updateFetching(true))
    yield put(AuthActions.updateError(false))
    const {council_id, name, surname, birthday, email, password, sex, note, address} = params.params
    yield put(AuthActions.updateFetching(true))
    const result = yield call(apiFetch, 'Users', 'post', {council_id, name, surname, birthday, email, password, sex, note, address})
    if (result.jwtToken) {
      yield put(AuthActions.login(email, password))
    } else {
      yield put(AuthActions.updateError(true))
    }
    yield put(AuthActions.updateFetching(false))
  }
  catch (e){
    yield put(AuthActions.updateFetching(false))
    yield put(AuthActions.updateError(true))
    console.log(e)
  }
}

export function* getUser(){
  try{
    const { uid } = yield select(state => state.auth.user)
    const result = yield call(apiFetch, `Users/${uid}`, 'get')
    if (result) {
      yield put(AuthActions.updateUser(result))
      // get workshop application
      yield call(getWorkshopApplication, { uid })
    }
  } catch(e) {
    console.log('Error at getting User', e)
  }
}

export function* putUser(params){
  try{
    const { user } = params
    const { uid } = yield select(state => state.auth.user)
    if (user && uid ) {
      const result = yield call(apiFetch, `Users/${uid}`, 'put', user)
      if (result) {
        yield put(AuthActions.updateUser(user))
      }
    }
  }
  catch(e){
    console.log('Error at putting User', e)
  }
}

export function* changeEmail(action) {
  try {
    yield put(AuthActions.updateError(false))
    yield put(AuthActions.updateSuccess(false))
    yield put(AuthActions.updateFetching(true))

    const { newEmail, oldPassword } = action;
    const user = yield select(state => state.auth.user)
    const result = yield call(apiFetch, 'Users/newemail', 'put', {
      uid: user.uid,
      newEmail,
      password: oldPassword,
      oldEmail: user.email
    })
    if (result) {
      yield put(AuthActions.updateUser({...user, email: newEmail}))
      yield put(AuthActions.updateSuccess(true))
    } else {
      yield put(AuthActions.updateError(true))
    }
    yield put(AuthActions.updateFetching(false))
  } catch (e) {
    console.log('Email Change:', e)
    yield put(AuthActions.updateError(true))
    yield put(AuthActions.updateFetching(false))
  }
}

export function* changePassword(action) {
  try {
    yield put(AuthActions.updateError(false))
    yield put(AuthActions.updateSuccess(false))
    yield put(AuthActions.updateFetching(true))

    const { newPassword, oldPassword } = action;
    const user = yield select(state => state.auth.user)
    const result = yield call(apiFetch, 'Users/passwordchange', 'put', {
      uid: user.uid,
      newPassword,
      oldPassword,
      email: user.email
    })
    if (result) {
      yield put(AuthActions.updateSuccess(true))
    } else {
      yield put(AuthActions.updateError(true))
    }
    yield put(AuthActions.updateFetching(false))
  } catch (e) {
    console.log('Password Change:', e)
    yield put(AuthActions.updateError(true))
    yield put(AuthActions.updateFetching(false))
  }
}

export function* logout(action) {
  try {
    localStorage.clear()
    sessionStorage.clear()
    yield put(ConferenceActions.resetConferenceState())
    yield put(CouncilActions.resetCouncilState())
    yield put(WorkshopActions.resetWorkshopState())
    yield put(AuthActions.resetAuthState())
  } catch (e) {
    console.log('Error at logging out', e)
  }
}

export function* resetPassword(action) {
  try {
    const { email } = action;
    const result = yield call(apiFetch, 'Users/passwordforget', 'put', { email })
    if (result) {
      console.log('worked', result)
    }
  } catch (e) {
    console.log(e)
  }
}