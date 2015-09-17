import ClassNameMixin from '../mixins/ClassNameMixin';
import React from 'react';

export default React.createClass({
    mixins: [ClassNameMixin],

    render: function() {
        let messageClassName = 'message';
        if (this.props.self.name === this.props.message.author) {
            messageClassName = 'message--outgoing';
        }

        let triangleClassName = 'message__triangle';
        if (this.props.self.name === this.props.message.author) {
            triangleClassName = 'message__triangle--outgoing';
        }

        return (
            <div className={this.getClassName(messageClassName)}>
                <div className="message__text">
                    {this.props.message.text}
                </div>
                <div className="message__author">
                    {this.props.message.author}
                </div>
                <div className={triangleClassName}>
                </div>
            </div>
        );
    }
});
