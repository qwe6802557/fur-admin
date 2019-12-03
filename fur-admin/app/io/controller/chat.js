module.exports = app => {
    class Controller extends app.Controller {
        async ping() {
            const message = this.ctx.args[0];
             this.ctx.socket.emit('customEmit', `你当前发送的信息是:${message}`);
        }
    }
    return Controller
};