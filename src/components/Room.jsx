import { connect } from 'react-redux';
import ErrorBanner from './ErrorBanner';
import ConnectionActions from '../actions/ConnectionActions';
import ConnectionHandlers from '../mixins/ConnectionHandlers';
import React from 'react';
import Router from 'react-router';

const Room = React.createClass({
    mixins: [ConnectionHandlers(), Router.Navigation],

    componentDidMount: function() {

    },

    componentWillUnmount: function() {
        this.unregisterHandlers();
    },

    leave: function() {
        this.transitionTo('app');
    },

    render: function() {
        const {errors, peopleList, peopleMap, hostName} = this.props;

        if (errors.length) {
            return (
                <div>
                    {errors[0]}
                </div>
            );
        }

        else if (peopleList.length === 1 && hostName !== peopleList[0].name) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        const list = peopleList.map(person => {
            if (person.name === hostName) {
                return <li>*{person.name}</li>;
            }
            return <li>{person.name}</li>;
        });

        return (
            <div>
                <ErrorBanner errors={errors} />
                <div>
                    <ul>
                        {list}
                    </ul>
                    <button onClick={this.leave}>Leave</button>
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
    ctype: state.localState.connectionType
}))(Room);
