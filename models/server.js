import express from "express";
import colors from "colors";
import cors from "cors";

import { userRoutes, authRoutes, categoriasRoutes, productosRoutes, buscarRoutes } from "../routes/index.js";

import { dbConnection } from "../database/config.js";

class Server {
  constructor() {
    
    this.app = express();
    this.PORT = process.env.PORT;
    this.paths = {
      auth:       "/api/auth",
      buscar:     "/api/buscar",
      categorias: "/api/categorias",
      productos:  "/api/productos",
      usuarios:   "/api/usuarios"
    }

    // Conectar base de datos
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB(){
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, authRoutes);
    this.app.use(this.paths.buscar, buscarRoutes);
    this.app.use(this.paths.categorias, categoriasRoutes);
    this.app.use(this.paths.productos, productosRoutes);
    this.app.use(this.paths.usuarios, userRoutes);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log("Servidor ejecutandose en puerto:", this.PORT.blue);
    });
  }
}

export default Server;
