const CustomRouter = require('../../routes/router');
const messagesController = require('./messagesController/messagesController');
const { validateMessageId } = require('../../utils/routes/routerParams');

class Messages extends CustomRouter {
  constructor() {
    super(); 
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.param('mid', validateMessageId);

    const basePath = '/api/chat'; 
    /* Sólo el USER puede agregar productos a su carrito carrito. */
    this.post(`${basePath}/`, ['USER'], messagesController.addUserMessage);
    /* Admin */
    this.get(`${basePath}/`, ['ADMIN'], messagesController.getAllMessages);
    this.delete(`${basePath}/:mid`, ['ADMIN'], messagesController.deleteUserMessage);
  }
}

module.exports = new Messages();
