import { browserHistory } from 'react-router';
import { SubmissionError } from 'redux-form';

import AuthenticationService from '../../services/AuthenticationService';
import InitialUserState from './InitialUserState';

//Action constants
export const SET_USER_DATA = 'SET_USER_DATA';

//Actions
export const setUserData = (userData) => {
    return { type: SET_USER_DATA, userData };
};

export const signIn = (values, dispatch) => {
    const { username, password } = values;

    return AuthenticationService.signIn(username, password)
    .then((response) => {
        if(response.ok) {
            response.json().then((json) => {
                dispatch(setUserData(json.userData));
                AuthenticationService.storeToken(json.token);
                browserHistory.push('/');
            });
        } else {
            throw new SubmissionError({ username: 'Bad things', _error: 'You done goofed' });
        }
    }).catch((error) => {
        throw new Error(error);
    });
};

//Reducer
export default (state = InitialUserState, action) => {
    switch(action.type) {
        case SET_USER_DATA: {
            const userData = action.userData;
            return { ...state, ...userData };
        }
        default:
            return state;
    }
};
