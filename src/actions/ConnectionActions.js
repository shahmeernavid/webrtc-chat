import ActionUtils from '../utils/ActionUtils';
import ConnectionManager from '../utils/ConnectionManager';
import Logger from '../utils/Logger';

// Actions meant to be sent over webRTC.
const handler = action => {
    Logger.debug('Sending action', action);
    ConnectionManager.send(action.to, {
        type: action.type,
        data: action.data
    }, action.except);
};

const actions = {
    sendError: handler,
    sendJoin: handler,
    sendJoinMulti: handler,
    sendHostName: handler,
    sendRemovePerson: handler,
    sendMessage: handler,
    ping: action => {
        ConnectionManager.ping(action.to)
    },
    close: action => {
        ConnectionManager.close(action.data)
    }
};

export default ActionUtils.generateConnectionActionCreators(actions);

export const Reducers = (store, action) => {
    const type = action.type.replace('connection', 'send');
    if (actions[type]) {
        return actions[type](action);
    }
};

