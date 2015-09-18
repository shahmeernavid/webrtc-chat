import AppError from '../classes/Error';
import { connect } from 'react-redux';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionManager from '../utils/ConnectionManager';
import ErrorActions from '../actions/ErrorActions';
import ErrorBanner from '../components/ErrorBanner';
import ConnectionHandlers from '../mixins/ConnectionHandlers';
import Loader from '../components/Loader';
import LocalActions from '../actions/LocalActions';
import Logger from '../utils/Logger';
import Person from '../classes/Person';
import React from 'react';

const Connection = React.createClass({

    mixins: [ConnectionHandlers()],

    setupHandlers: function(ctype, selfName) {
        const handleJoin = (name, cid) => {
            const {dispatch, peopleList, peopleMap} = this.props;

            // If you are a host you need to tell the new client about yourself
            // and tell all other clients about the new client.
            if (ctype === 'HOST') {
                if (peopleMap[name] || name === selfName) {
                    dispatch(ConnectionActions.sendError(cid, 'ROOM_NAME_UNIQUE'));
                    dispatch(ConnectionActions.close(cid));
                    Logger.debug('Someone with non unique name tried to join room');
                    return;
                }

                // Tell new client the room host name.
                dispatch(ConnectionActions.sendHostName(cid, selfName));
                // Tell all other clients about new client.
                dispatch(ConnectionActions.sendJoin('ALL', name, cid));
                // Tell new client about other clients and yourself.
                dispatch(ConnectionActions.sendJoinMulti(cid,
                        peopleList.map(p => p.name)));

                // Add person to local store.
                // Only host should know about connectionId.
                dispatch(LocalActions.join(new Person(name, cid)));
            }
            else {
                // If a duplicate player appears on a client, error.
                if (peopleMap[name]) {
                    throw new Error('Tried adding a duplicate player.');
                }

                // Add player to local store.
                dispatch(LocalActions.join(new Person(name)));
            }
        };

        this.registerConnectionHandler('connectionJoin', (action, cid) => {
            handleJoin(action.data, cid);
        });

        this.registerConnectionHandler('connectionJoinMulti', (action, cid) => {
            action.data.forEach(person => {
                handleJoin(person, cid);
            });
        });

        this.registerConnectionHandler('connectionHostName', action => {
            this.props.dispatch(LocalActions.setHostName(action.data));
        });

        this.registerConnectionHandler('connectionError', action => {
            const dispatch = this.props.dispatch;
            switch (action.data) {
                case 'ROOM_NAME_UNIQUE':
                    this.props.dispatch(ErrorActions.error(new AppError({
                        message: 'Name chosen not unique, please try again with a different name'
                    })));
                    break;
            }
        });

        this.registerConnectionHandler('connectionRemovePerson', (action, cid) => {
            if (ctype === 'HOST') {
                throw new Error('Only clients should be told to remove people');
            }
            const dispatch = this.props.dispatch;
            dispatch(LocalActions.removePerson(action.data));
        });
    },

    setupConnectionManager: function(ctype, roomName) {
        ConnectionManager.setup(ctype, roomName);
        ConnectionManager.on('connectionData', (data, conn) => {
            this.handleConnectionData(data, conn.label);
        });

        ConnectionManager.on('peerError', (err, peer, ctype) => {
            const dispatch = this.props.dispatch;
            switch (err.type) {
                case 'peer-unavailable':
                    if (ctype === 'CLIENT') {
                        dispatch(ErrorActions.error(new AppError({
                            message: `Could not connect to room`
                        })));
                    }
                    else {
                        dispatch(ErrorActions.error(new AppError({
                            message: `Could not set up room`
                        })));
                    }
                    break;
            }
        });

        ConnectionManager.on('peerClose', () => {
            const msg = (ctype === 'HOST') ? 'clients' : 'host';
            this.props.dispatch(ErrorActions.error(new AppError({
                message: `Connection to ${msg} lost`,
                fatal: true
            })));
        });

        ConnectionManager.on('connectionClose', conn => {
            if (ctype === 'HOST') {
                const person = this.props.peopleList.find(
                        person => person.connectionId === conn.label);
                // Someone who wasn't a player tried to connect.
                if (!person) {
                    return;
                }
                // Tell other clients to remove disconnected client.
                this.props.dispatch(ConnectionActions.sendRemovePerson('ALL', person.name));
                this.props.dispatch(LocalActions.removePerson(person.name));
            }
            else {
                this.props.dispatch(ErrorActions.error(new AppError({
                    message: `Connection to host lost`,
                    fatal: true
                })));
            }
        });

        // ConnectionManager.on('peerDisconnected', () => {
        //     if (ctype === 'CLIENT') {
        //         this.props.dispatch(LocalActions.setLoading(true));
        //     }
        // });

        // ConnectionManager.on('peerOpen', () => {
        //     if (ctype === 'CLIENT') {
        //         this.props.dispatch(LocalActions.setLoading(false));
        //     }
        // });
    },

    clear: function() {
        ConnectionManager.clear();
        this.props.dispatch(LocalActions.clear());
    },

    componentWillUnmount: function() {
        this.unregisterHandlers();
        this.clear();
    },

    render: function() {
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                setupHandlers: this.setupHandlers,
                setupConnectionManager: this.setupConnectionManager,
                clear: this.clear
            });
        });

        return (
            <div>
                <ErrorBanner errors={this.props.errors} />
                <div>{children}</div>
            </div>
        );
    }
});

export default connect(state => ({
    peopleList: state.localState.people,
    peopleMap: state.localState.people.toMap(),
    errors: state.errorState.errors
}))(Connection);
