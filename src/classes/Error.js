export default class AppError {
    constructor(msg, fatal=false) {
        this.message = msg;
        this.fatal = fatal;
    }

    clone() {
        return new AppError(this.message, this.fatal);
    }

    static cloneMulti(errors) {
        return error.map(e => e.clone());
    }
}
