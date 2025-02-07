import express from "express";
import cors from "cors";
import userRoutes from "../routes/usuarios.js";

class Server {
  constructor() {
    
    this.app = express();
    this.PORT = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicacion
    this.routes();
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
    this.app.use(this.usuariosPath, userRoutes);
  }

  listen() {
    this.app.listen(this.PORT, () => {
      console.log("Servidor ejecutandose en:", this.PORT);
    });
  }
}

export default Server;
