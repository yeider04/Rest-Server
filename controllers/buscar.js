import { response } from "express";
import Usuario from "../models/usuario.js";
import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const coleccionesPermitidas = ["usuarios", "categorias", "productos"];

const buscarUsuarios = async (termino = "", res) => {
  try {
    let usuarios;
    if (ObjectId.isValid(termino)) {
      // Buscar por ID
      usuarios = await Usuario.findById(termino);
    } else {
      // Buscar por nombre (insensible a mayúsculas)
      const regex = new RegExp(termino, "i");
      usuarios = await Usuario.find({ nombre: regex });
    }

    res.json({
        results: usuarios || [],
    });
  } catch (error) {
    console.error("Error en buscarUsuarios:", error);  // 🛑 DEBUG
    res.status(500).json({ msg: "Error en la búsqueda de usuarios" });
  }
};

const buscarCategorias = async (termino = "", res) => {
  try {
    const regex = new RegExp(termino, "i");
    const categorias = await Categoria.find({ nombre: regex });
    res.json({ results: categorias });
  } catch (error) {
    console.error("Error en la busqueda de categorias:", error);  // 🛑 DEBUG
    res.status(500).json({ msg: "Error en la búsqueda de categorías" });
  }
};

const buscarProductos = async (termino = "", res) => {
  try {
    const regex = new RegExp(termino, "i");
    const productos = await Producto.find({ nombre: regex }).populate(
      "categoria",
      "nombre"
    );
    res.json({ results: productos });
  } catch (error) {
    console.error("Error en busqueda de productos:", error);  // 🛑 DEBUG
    res.status(500).json({ msg: "Error en la búsqueda de productos" });
  }
};

export const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({ msg: "Se olvidó de implementar esta búsqueda" });
  }
};
