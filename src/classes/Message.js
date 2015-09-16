export default class Message {
    constructor(opts) {
        // TODO: type checking
        if (!opts.text || !opts.author) {
            console.log(opts);
            throw new Error('A message must have text and an author');
        }
        this.text = opts.text;
        this.author = opts.author;
    }

    clone() {
        return new Message({
            text: this.text,
            author: this.text
        });
    }

    static cloneMulti(messages) {
        return message.map(m => m.clone());
    }

    static serialize() {
        return {
            text: this.text,
            author: this.author
        };
    }

    static deserialize(data) {
        return new Message({
            text: data.text,
            author: data.author
        });
    }
}
