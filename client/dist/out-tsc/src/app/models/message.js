var Message = /** @class */ (function () {
    function Message(_id, text, viewed, created_at, emitter, receiver) {
        this._id = _id;
        this.text = text;
        this.viewed = viewed;
        this.created_at = created_at;
        this.emitter = emitter;
        this.receiver = receiver;
    }
    return Message;
}());
export { Message };
//# sourceMappingURL=message.js.map