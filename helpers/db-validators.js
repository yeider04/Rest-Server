import Role from "../models/role.js";
import Usuario from "../models/usuario.js";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";

export const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
  }
};

export const emailExiste = async (correo = "") => {
  // Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya se encuentra registrado`);
  }
};

export const existeUsuarioPorID = async (id) => {
  // Verificar si el correo existe
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }
};

export const existeCategoriaPorID = async (id) => {
  // Verificar si existe la categoria
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe`);
  }
};

export const existeProductoPorID = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    return Promise.reject(`El ID ${id} no existe en la base de datos.`);
  }
};

