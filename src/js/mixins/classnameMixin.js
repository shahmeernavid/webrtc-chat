export default {
    getClassName: function(classes) {
        if (this.props.className) {
            return this.props.className + ` ${classes}`;
        }
        return classes;
    }
}
