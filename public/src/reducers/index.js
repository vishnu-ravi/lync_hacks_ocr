import { ADD_USER_DETAIL, SWITCH_LOADER, CLEAR_USER_DETAIL, GET_TOTAL_DETAIL } from '../actions/actionTypes';

import {fromJS, Map} from 'immutable';
import cookies from 'cookie-jeep';

import conf from '../conf';

var locale = 'en_US';

function getNewState(state, newState) {
    return state.merge(newState);
}

export default function (state = fromJS({aadhar:[], loading : false, flow : 0, total : 0}), action) {
    console.log(state);
    switch (action.type) {
        case ADD_USER_DETAIL:
            return getNewState(state, {aadhar: state.get('aadhar').push(action.aadhar), flow : state.get('flow')+1});
        case SWITCH_LOADER:
            return getNewState(state, {loading: !state.get('loading')});
        case CLEAR_USER_DETAIL:
            return getNewState(state, {aadhar: []});
        case GET_TOTAL_DETAIL:
            return getNewState(state, {total: action.total});

    }
    return state;
}
