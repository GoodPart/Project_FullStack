import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNSET_AUTHENTICATED, LOADING_USER } from '../types'
import axios from 'axios'

export const loginUser = (userData, history) =>(dispatch) => {
    dispatch({ type: LOADING_UI });//call reduce
    axios.post('/login', userData)
        .then(res => {
          setAuthorizationHeader(res.data.token)
          dispatch(getUserData());
          dispatch({ type: CLEAR_ERRORS  });//call reduce
          history.push('/');
        })
        .catch(err=>{
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const signupUser = (newUserData, history) =>(dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/signup', newUserData)
        .then(res => {
        setAuthorizationHeader(res.data.token)
          dispatch(getUserData());
          dispatch({ type: CLEAR_ERRORS  });
          history.push('/');
        })
        .catch(err=>{
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            })
        })
}

export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNSET_AUTHENTICATED });
}


export const getUserData = () => (dispatch) => {
    dispatch({ type: LOADING_USER});
    axios
        .get('/user')
        .then(res=> {
            console.log("user-DATA",res.data)
            // dispatch({ payload: res.data})
            dispatch({
                type: SET_USER,
                payload: res.data
            })
        })
        .catch(err => console.log(err))
}

export const uploadImage = (formData) => (dispatch) =>{
    dispatch({type: LOADING_USER})
    axios.post('/user/image',formData)
        .then (() =>{
            dispatch(getUserData());
        })
        .catch(err => console.error(err))
}

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({ type : LOADING_USER });
    axios.post('/user', userDetails)
        
        .then(() => {
            console.log('USER-DETAILS - ', userDetails)
            dispatch(getUserData());
        })
        .catch(err => console.log(err))
}


const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`
          localStorage.setItem('FBIdToken', FBIdToken);
          axios.defaults.headers.common['Authorization'] = FBIdToken
}