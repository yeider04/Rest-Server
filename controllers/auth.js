import bcryptjs from "bcryptjs";
import Usuario from "../models/usuario.js"
import generarJWT from "../helpers/generar-jwt.js";

const login = async(req, res) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({correo});
    if (!usuario) {
      return res.status(400).json({
        msg: "El correo no existe"
      });
    }
    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "El usuario no existe"
      });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Contraseña incorrecta"
      });
    }
    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }

};

export default login;
