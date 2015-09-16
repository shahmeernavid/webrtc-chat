import ActionUtils from '../utils/ActionUtils';

const actions = {
    join: (state, action) => {
        return {
            ...state,
            people: [...state.people, action.data]
        };
    },

    setHostName: (state, action) => {
        return {
            ...state,
            hostName: action.data
        };
    },

    removePerson: (state, action) => {
        return {
            ...state,
            people: state.people.filter(p => p.name !== action.data)
        };
    },

    addMessage: (state, action) => {
        return {
            ...state,
            messages: [...state.messages, action.data]
        };
    },

    setConnectionType: (state, action) => {
        return {
            ...state,
            connectionType: action.data
        };
    },

    setRoomName: (state, action) => {
        return {
            ...state,
            roomName: action.data
        };
    }

};

export default ActionUtils.generateActionCreators(actions);

export const Reducers = (state = {}, action) => {
    if (actions[action.type]) {
        return actions[action.type](state, action);
    }
    return state;
};
