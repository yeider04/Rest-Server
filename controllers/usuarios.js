import Usuario from "../models/usuario.js";
import bcryptjs from "bcryptjs";

export const usuariosGet = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({
    total,
    usuarios
  });
};

export const usuariosPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    usuario,
  });
};

export const usuariosPost = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en base de datos
  await usuario.save();

  res.json({
    usuario,
  });
};

export const usuariosDelete = async(req, res) => {
  const {id} = req.params;

  // Se elimina permanente
  // const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
  const usuarioAutenticado = req.usuario;

  res.json({
    usuario,
    usuarioAutenticado
  });
};

export const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};
