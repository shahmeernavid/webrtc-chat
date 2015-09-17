import { connect } from 'react-redux';
import ConnectionActions from '../actions/ConnectionActions';
import LocalActions from '../actions/LocalActions';
import Person from '../classes/Person';
import React from 'react/addons';
import Router from 'react-router';

const Home = React.createClass({

    mixins: [React.addons.LinkedStateMixin, Router.Navigation],

    getInitialState: function() {
        return {
            createDialog: false,
            joinDialog: false,
            roomName: '',
            name: ''
        }
    },

    componentDidMount: function() {
        this.props.clear();
    },

    createRoom: function() {
        this.setState({
            createDialog: true,
            joinDialog: false
        });
    },

    joinRoom: function() {
        this.setState({
            createDialog: false,
            joinDialog: true
        });
    },

    back: function() {
        this.setState({
            createDialog: false,
            joinDialog: false,
            roomName: null,
            name: null
        });
    },

    go: function() {
        if (!this.state.name || this.state.name.trim().length === 0
                || !this.state.roomName || this.state.roomName.trim().length === 0) {
            alert('You need to enter a name and room name!');
            return;
        }

        const connectionType = (this.state.joinDialog) ? 'CLIENT' : 'HOST';

        this.props.setupConnectionManager(connectionType, this.state.roomName);

        const dispatch = this.props.dispatch;

        // Add yourself.
        dispatch(LocalActions.join(new Person(this.state.name)));
        // Set room name.
        dispatch(LocalActions.setRoomName(this.state.roomName));
        // Set connection type.
        dispatch(LocalActions.setConnectionType(connectionType));

        // Setup general gameplay handlers.
        this.props.setupHandlers(connectionType, this.state.name);

        // If a client, tell host about yourself.
        if (connectionType === 'CLIENT') {
            dispatch(ConnectionActions.sendJoin('HOST', this.state.name));
        }
        // Otherwise, set up host name.
        else {
            dispatch(LocalActions.setHostName(this.state.name));
        }

        this.transitionTo('room');
    },

    render: function() {
        let dialog, buttons;
        if (this.state.createDialog || this.state.joinDialog) {
            dialog = (
                <div className="start-dialog">
                    <div className="start-dialog__inputs">
                        <input className="start-start-dialog__inputs__input" type="text" valueLink={this.linkState('name')} placeholder="Enter Name" />
                        <input className="start-start-dialog__inputs__input" type="text" valueLink={this.linkState('roomName')} placeholder="Enter Room Name" />
                    </div>
                    <button className="button start-dialog__go" onClick={this.go}>Let's Go!</button>
                    <button className="button start-dialog__leave" onClick={this.back}>Cancel</button>
                </div>
            );
        }
        else {
            buttons = (
                <div className="home__buttons">
                    <button className="button home__buttons__button"  onClick={this.createRoom}>Create Room</button>
                    <button className="button home__buttons__button" onClick={this.joinRoom}>Join Room</button>
                </div>
            );
        }

        return (
            <div className="home">
                {buttons}
                {dialog}
            </div>
        );
    }
});

// Look into reselect: https://github.com/faassen/reselect.
export default connect()(Home);
