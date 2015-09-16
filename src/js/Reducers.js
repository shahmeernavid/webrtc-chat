import {Reducers as ErrorReducers} from './actions/ErrorActions';
import {Reducers as LocalReducers} from './actions/LocalActions';

export default (state = {}, action) => {
    return {
        localState: LocalReducers(state.localState, action),
        errorState: ErrorReducers(state.errorState, action)
    };
};
