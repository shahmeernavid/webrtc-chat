import ClassNameMixin from '../mixins/ClassNameMixin';
import React from 'react';

export default React.createClass({
    mixins: [ClassNameMixin],

    render: function() {
        if (this.props.show) {
            return <div></div>;
        }

        return (
            <div className="loader">
                Loading<span class="loader__dots">...</span>
            </div>
        );
    }
});
