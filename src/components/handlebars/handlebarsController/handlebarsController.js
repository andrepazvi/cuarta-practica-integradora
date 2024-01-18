const HandlebarsServices = require('../handlebarsServices/handlebarsServices');
const { usersServices } = require('../../../repositories/index');
const { getTotalProducts } = require('../handlebarsServices/handlebarsServices');
const jwt = require('jsonwebtoken');
const { config } = require('../../../config');

class HandlebarsController {
  getLogin = async (req, res) => {
    const data = await HandlebarsServices.getLogin(res);
    return res.render('login', data);
  };

  getRegister = async (req, res) => {
    const data = await HandlebarsServices.getRegister(res);
    return res.render('register', data);
  };

  getRecovery = async (req, res) => {
    const data = await HandlebarsServices.getRecovery(res);
    return res.render('recovery', data);
  };

  getUser = async (req, res) => {
    const data = await HandlebarsServices.getUser(res);
    const userData = req.session.user || req.user;
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);

    const context = { user: userWithCurrentDTO, ...data };
    return res.render('profile', context);
  };

  getAdmin = async (req, res) => {
    const data = await HandlebarsServices.getAdmin(res);
    const userData = req.session.user || req.user;
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    const context = { user: userWithCurrentDTO, ...data };
    return res.render('dashboard', context);
  };

  getCurrent = async (req, res) => {
    const data = await HandlebarsServices.getCurrent(res);

    // Verifica si req.session.user o req.user están definidos
    const user = req.session.user || req.user;
    if (!user) {
      return res.sendServerError('Usuario no autorizado');
    }

    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(user);
    /*     console.log('userWithCurrentDTO getCurrent running', userWithCurrentDTO); */
    const context = { user: userWithCurrentDTO, ...data };
    return res.render('current', context);
  };

  getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const userData = req.session.user || req.user;
    const data = await HandlebarsServices.getProducts(limit, page, sort, query, res, userData);

    // Filtra y estructura los datos del usuario utilizando getUserWithCurrentDTO
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);

    /*     console.log('userWithCurrentDTO getProducts running', userWithCurrentDTO); */
    const context = { user: userWithCurrentDTO, ...data };

    return res.render('products', context);
  };

  getCartProductById = async (req, res) => {
    const { cid } = req.params;
    const cartId = cid;
    const userData = req.session.user || req.user;

    /*     console.log('userWithCurrentDTO getCartProductById running', userWithCurrentDTO); */
    const data = await HandlebarsServices.getCartProductById(cartId, res, userData);

    return res.render('carts', data);
  };

  getRealTimeProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const userData = req.session.user || req.user;

    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    /*     console.log('userWithCurrentDTO getRealTimeProducts running', userWithCurrentDTO); */
    const data = await HandlebarsServices.getRealTimeProducts(limit, page, sort, query, res, userWithCurrentDTO);

    return res.render('realTimeProducts', data);
  };

  getAdminProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const userData = req.session.user || req.user;

    // Obtén el total de productos llamando a getTotalProducts
    const totalProducts = await getTotalProducts();

    const data = await HandlebarsServices.getAdminProducts(limit, page, sort, query, res, userData);

    // Filtra y estructura los datos del usuario utilizando getUserWithCurrentDTO
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);

    // Agrega el total de productos al contexto
    const context = { user: userWithCurrentDTO, ...data, totalProducts };
    // Emitir el evento totalProductsUpdate a través de req.app.io
    req.app.io.emit('totalProductsUpdate', totalProducts);
    return res.render('adminProducts', context);
  };

  getHomeProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const userData = req.session.user || req.user;

    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    /*     console.log('userWithCurrentDTO getHomeProducts running', userWithCurrentDTO); */
    const data = await HandlebarsServices.getHomeProducts(limit, page, sort, query, res, userWithCurrentDTO);

    return res.render('home', data);
  };

  getChat = async (req, res) => {
    const data = await HandlebarsServices.getChat(res);
    return res.render('chat', data);
  };

  getResetPassByEmail = async (req, res) => {
    const data = await HandlebarsServices.getResetPassByEmail(res);
    return res.render('resetPassByEmail', data);
  };

  getResetPassExpiredToken = async (req, res) => {
    const data = await HandlebarsServices.getResetPassExpiredToken(res);
    return res.render('resetPassExpiredToken', data);
  };

  getResetPass = async (req, res) => {
    const data = await HandlebarsServices.getResetPass(res);
    const { token } = req.params;

    // Verifica si el token es válido
    jwt.verify(token, config.jwt_secret, (err, decodedToken) => {
      if (err) {
        // Token no válido o expirado, redirige a la vista Link expirado
        return res.redirect('/resetPassExpiredToken');
      }

      data.token = token;
      return res.render('resetPass', data);
    });
  };
}

module.exports = new HandlebarsController();
