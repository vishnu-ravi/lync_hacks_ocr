import {
    ADD_USER_DETAIL,
    SWITCH_LOADER,
    CLEAR_USER_DETAIL,
    GET_TOTAL_DETAIL
} from './actionTypes';
import cookies from 'cookie-jeep';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function addUserDetail(aadhar) {
    return dispatch => {
        dispatch({ type: ADD_USER_DETAIL, aadhar : aadhar })
    }
}
export function switchLoader() {
    return dispatch => {
        dispatch({
            type: SWITCH_LOADER
        })
    }
}

export function clearUserDetail() {
    return dispatch => {
        dispatch({
            type: CLEAR_USER_DETAIL
        })
    };
}

export function getTotalDetail(total) {
    return dispatch => {
        dispatch({
            type: GET_TOTAL_DETAIL,
            total: total
        })
    };
}
