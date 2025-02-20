import Producto from "../models/producto.js";
import { response } from "express";

export const obtenerProductos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productosDB] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  // Reordenar cada producto antes de enviarlo
  const productos = productosDB.map(
    ({ _id, nombre, precio, categoria, disponible, usuario }) => ({
      _id,
      nombre,
      precio,
      categoria,
      disponible,
      usuario, // Usuario queda al final
    })
  );

  res.json({
    total,
    productos,
  });
};

export const obtenerProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findById(id).populate("usuario", "nombre");

  if (!producto) {
    return res.status(404).json({ msg: "Producto no encontrado" });
  }

  // Reorganizar los campos para que usuario quede al final
  const { __v, usuario, ...resto } = producto.toObject();
  const respuestaOrdenada = { ...resto, usuario };

  res.json(respuestaOrdenada);
};

export const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  // Guardar DB
  await producto.save();

  res.status(201).json(producto);
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  // Verificar si el body está vacío
  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      msg: "No hay datos para actualizar",
    });
  }

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  // Realizar la actualización en la base de datos
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  // Buscar el producto en la base de datos
  const producto = await Producto.findById(id);

  // Si el producto no existe o ya está eliminado, devolver error
  if (!producto || !producto.estado) {
      return res.status(404).json({
          msg: "El producto no existe"
      });
  }

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    msg: "Producto eliminado correctamente",
    productoBorrado
});
};
