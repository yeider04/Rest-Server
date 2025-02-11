import jwt from "jsonwebtoken";

import Usuario from "../models/usuario.js";

export const validarJWT = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - Usuario no existe en DB",
      });
    }

    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - Usuario con estado: false",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

