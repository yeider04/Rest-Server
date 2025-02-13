import bcryptjs from "bcryptjs";
import Usuario from "../models/usuario.js";
import generarJWT from "../helpers/generar-jwt.js";
import googleVerify from "../helpers/google-verify.js";

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "El correo no existe",
      });
    }
    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario no existe",
      });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Contraseña incorrecta",
      });
    }
    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const googleSignIn = async (req, res) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Tengo que crearlo

      const data = {
        nombre,
        correo,
        password: "xd",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario en base de datos esta en false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Usuario bloqueado, hable con el administrador",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
    
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "No se pudo verificar el token",
    });
  }
};
