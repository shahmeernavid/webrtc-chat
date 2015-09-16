import ActionUtils from '../utils/ActionUtils';
import Error from '../classes/Error';

const actions = {
    error: (errorState, action) => {
        return {
            ...errorState,
            errors: [...errorState.errors, action.data]
        };
    }
};

export default ActionUtils.generateActionCreators(actions);

export const Reducers = (errorState = {}, action) => {
    if (actions[action.type]) {
        return actions[action.type](errorState, action);
    }
    return errorState;
};


