const CustomRouter = require('../../routes/router'); // Assuming you have a CustomRouter defined similarly to the first code snippet
const productsController = require('./productsController/productsController');
const { uploadProducts } = require('../../utils/multer/multer');
const { validateProductId } = require('../../utils/routes/routerParams');

class ProductsRoutes extends CustomRouter {
  constructor() {
    super(); 
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar el parametro pid
    this.router.param('pid', validateProductId);

    const basePath = '/api/products'; // Almacena el prefijo de la ruta

    /* Sistema de autorización para delimitar el acceso a endpoints:*/


    /* Admin */
    
    /* Sólo el ADMIN puede crear, actualizar y eliminar productos. */
    this.post(`${basePath}/`, ['ADMIN', 'PREMIUM'], uploadProducts.array('image', 5), productsController.addProduct);
    this.put(`${basePath}/:pid`, ['ADMIN', 'PREMIUM'], uploadProducts.array('image', 5), productsController.updateProduct);
    this.delete(`${basePath}/:pid`, ['ADMIN', 'PREMIUM'], productsController.deleteProduct);
    this.get(`${basePath}/`, ['ADMIN', 'PREMIUM'], productsController.getAllProducts);
    this.get(`${basePath}/:pid`, ['ADMIN'], productsController.getProductById);
  }
}

module.exports = new ProductsRoutes();

