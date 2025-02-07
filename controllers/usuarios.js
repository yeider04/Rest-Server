export const usuariosGet = (req, res) => {
  res.json({
    msg: "get API - controlador",
  });
};

export const usuariosPut = (req, res) => {
  const {id} = req.params;

  res.json({
    msg: "put API - controlador",
    id
  });
};

export const usuariosPost = (req, res) => {
  const { nombre, edad } = req.body;

  res.json({
    msg: "post API - controlador",
    nombre,
    edad,
  });
};

export const usuariosDelete = (req, res) => {
  res.json({
    msg: "delete API - controlador",
  });
};

export const usuariosPatch = (req, res) => {
  res.json({
    msg: "patch API - controlador",
  });
};
