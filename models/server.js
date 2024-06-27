const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../database/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT||3000;
    this.usuariosPath='/api/usuarios';
    //llamada a conectarDB
    this.conectarDB();
    //Middelware
    this.middlewares();
    //Rutas de la aplicacion
    this.routes();
  }

  async conectarDB(){
    await dbConnection();
  }
  //se define el metodo middleware que publicara la carpeta public
  middlewares(){
    //cors
    this.app.use(cors());
    //lectura y parseo
    this.app.use(express.json());
    //directorio publico
    this.app.use(express.static('public'));
  }
  routes() {
    this.app.use(this.usuariosPath, require('../routes/user'))
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo como puerto: ", this.port);
    });
  }
}
module.exports = Server;
