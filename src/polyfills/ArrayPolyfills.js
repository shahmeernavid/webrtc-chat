Array.prototype.last = function() {
    return this[this.length - 1];
};

Array.prototype.toMap = function(prop) {
    if (prop) {
        return this.reduce((accum, next) => ({...accum, [next[prop]]: next}), {});
    }
    return this.reduce((accum, next) => ({...accum, next: true}), {});
};
