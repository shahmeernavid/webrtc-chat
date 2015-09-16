import { connect } from 'react-redux';
import ErrorBanner from './ErrorBanner';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionHandlers from '../mixins/ConnectionHandlers';
import Loader from './Loader';
import LocalActions from '../actions/LocalActions';
import Message from '../classes/Message';
import MessageComponent from './Message';
import React from 'react/addons';
import Router from 'react-router';

const Room = React.createClass({
    mixins: [ConnectionHandlers(), React.addons.LinkedStateMixin, Router.Navigation],

    getInitialState: function() {
        return {
            userInput: null
        };
    },

    componentDidMount: function() {
        this.registerConnectionHandler('connectionMessage', action => {
            this.props.dispatch(LocalActions.addMessage(new Message(action.data)));
            if (this.props.ctype === 'HOST') {
                this.props.dispatch(ConnectionActions.sendMessage('ALL', action.data));
            }
        });
    },

    componentWillUnmount: function() {
        this.unregisterHandlers();
    },

    leave: function() {
        this.transitionTo('app');
    },

    send: function(evt) {
        const data = {
            text: this.state.userInput,
            author: this.props.peopleList[0].name
        };
        this.props.dispatch(LocalActions.addMessage(new Message(data)));
        if (this.props.ctype === 'HOST') {
            this.props.dispatch(ConnectionActions.sendMessage('ALL', data));
        }
        else {
            this.props.dispatch(ConnectionActions.sendMessage('HOST', data));
        }
        this.setState({
            userInput: null
        });
    },

    render: function() {
        const {errors, peopleList, peopleMap, hostName, messages} = this.props;

        if (peopleList.length === 1 && hostName !== peopleList[0].name) {
            return (
                <div className="room">
                    <Loader className="room__loader" />
                </div>
            );
        }

        const people = peopleList.map(person => {
            if (person.name === hostName) {
                return <li className="people-list__person--host">{person.name}</li>;
            }
            return <li className="people-list__person">{person.name}</li>;
        });

        const messageList = messages.map(m =>
                <MessageComponent className="message-list__message" message={m} />);

        return (
            <div>
                <ErrorBanner errors={errors} />
                <div className="room">
                    <div className="people-list">
                        <ul>
                            {people}
                        </ul>
                        <button onClick={this.leave}>Leave Room</button>
                    </div>
                    <div className="main-room-view">
                        <div className="main-room-view__message-list">
                            {messageList}
                        </div>
                        <div className="main-room-view__message-input">
                            <input className="message-input__main" valueLink={this.linkState('userInput')} />
                            <button onClick={this.send} className="message-input__send">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default connect(state => ({
    errors: state.errorState.errors,
    peopleList: state.localState.people,
    peopleMap: state.localState.people.toMap(),
    hostName: state.localState.hostName,
    messages: state.localState.messages,
    ctype: state.localState.connectionType
}))(Room);
