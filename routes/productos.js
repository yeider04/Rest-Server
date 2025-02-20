import { Router } from "express";
import { check } from "express-validator";

import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.js";

import { esAdminRol, validarCampos, validarJWT } from "../middlewares/index.js";

import {
  existeCategoriaPorID,
  existeProductoPorID,
} from "../helpers/db-validators.js";

const router = Router();

// Obtener productos - publico
router.get(
  "/",
  [
    check("limite")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("El límite debe ser un número entre 1 y 100"),
    check("desde")
      .optional()
      .isInt({ min: 0 })
      .withMessage("El parámetro 'desde' debe ser un número entero positivo"),
    validarCampos,
  ],
  obtenerProductos
);

// Obtener productos por id - publico
router.get("/:id", [
    check("id", "No es un ID válido de MongoDB").isMongoId(),
    check("id").custom(existeProductoPorID), // Verifica si el producto existe
    validarCampos, // Middleware para manejar validaciones
], obtenerProducto);

// Crear producto - privado - token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("categoria", "No es un id de Mongo valido").isMongoId(),
    check("categoria").custom(existeCategoriaPorID),
    check("precio", "El precio debe ser un número positivo").optional().isFloat({ min: 0 }),
    check("disponible", "El valor de disponible debe ser un booleano").optional().isBoolean(),
    validarCampos,
  ],
  crearProducto
);

// Actualizar producto por id - privado - token valido
router.put("/:id", [
    validarJWT,
    check("id", "No es un ID válido de MongoDB").isMongoId(),
    check("id").custom(existeProductoPorID), // Verifica si el producto existe
    check("nombre", "El nombre no puede estar vacío").optional().notEmpty(),
    check("precio", "El precio debe ser un número positivo").optional().isFloat({ min: 0 }),
    check("categoria", "No es un ID válido de MongoDB").optional().isMongoId(),
    check("categoria").optional().custom(existeCategoriaPorID), // Verifica si la categoría existe
    check("disponible", "El valor de disponible debe ser un booleano").optional().isBoolean(),
    validarCampos, // Middleware para manejar validaciones
], actualizarProducto);

// Eliminar producto Admin
router.delete("/:id", [
    validarJWT,
    esAdminRol,
    check("id","No es un ID de Mongo valido").isMongoId(),
    check("id").custom(existeProductoPorID),
    validarCampos
], eliminarProducto);

export default router;
