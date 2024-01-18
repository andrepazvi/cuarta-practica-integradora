const CustomRouter = require('../../routes/router');
const mailController = require('./maillController/mailController');
/* const { validateMessageId } = require('../../utils/routes/routerParams'); */

class mailRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    /* this.router.param('eid', validateMessageId); */

    const basePath = '/mail';
    this.post(`${basePath}/`, ['ADMIN'], mailController.sendMail);
  }
}

module.exports = new mailRoutes();
