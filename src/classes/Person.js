export default class Person {
    constructor(name, connectionId=null) {
        if (!name) {
            throw new Error('Person needs a name!');
        }
        this.name = name;
        this.connectionId = connectionId;
    }

    clone() {
        return new Person(this.name, this.connectionId);
    }

    static cloneMulti(people) {
        return people.map(person => person.clone());
    }

    static serialize() {
        return {
            name: this.name,
            connectionId: this.connectionId
        };
    }

    static deserialize(data) {
        return new Person(data.name, data.connectionId);
    }
}
