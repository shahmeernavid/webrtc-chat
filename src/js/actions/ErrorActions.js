import ActionUtils from '../utils/ActionUtils';
import InitialStoreState from '../constants/InitialStoreState';

const actions = {
    error: (errorState, action) => {
        return {
            ...errorState,
            errors: [...errorState.errors, action.data]
        };
    },

    clear: () => {
        return InitialStoreState.errorState;
    }
};

export default ActionUtils.generateActionCreators(actions);

export const Reducers = (errorState = {}, action) => {
    if (actions[action.type]) {
        return actions[action.type](errorState, action);
    }
    return errorState;
};


