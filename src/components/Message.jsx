import ClassNameMixin from '../mixins/ClassNameMixin';
import React from 'react';

export default React.createClass({
    mixins: [ClassNameMixin],

    render: function() {
        return (
            <div className={this.getClassName('message')}>
                <div className="message__text">
                    {this.props.message.text}
                </div>
                <div className="message__author">
                    {this.props.message.author}
                </div>
            </div>
        );
    }
});
