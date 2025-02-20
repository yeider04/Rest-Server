import { Router } from "express";
import { check } from "express-validator";

import { esAdminRol, validarCampos, validarJWT } from "../middlewares/index.js";
import { 
  actualizarCategoria, 
  borrarCategoria, 
  crearCategoria, 
  obtenerCategoria, 
  obtenerCategorias } from "../controllers/categorias.js";
import { existeCategoriaPorID } from "../helpers/db-validators.js";

const router = Router();

/*
{{url}}/api/categorias
*/

// Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// Obtener categoria por id - publico
router.get("/:id", [
  check("id","No es un id de Mongo valido").isMongoId(),
  check("id").custom(existeCategoriaPorID),
  validarCampos
],obtenerCategoria);

// Crear categoria - privado - cualquier persona con token valido
router.post("/", [
  validarJWT,
  check("nombre", "El nombre es obligatorio").notEmpty(),
  validarCampos
], crearCategoria);

// Actualizar categoria - privado - cualquiera con token valido
router.put("/:id", [
  validarJWT,
  check("nombre", "El nombre es obligatorio").notEmpty(),
  check("id").custom(existeCategoriaPorID),
  validarCampos
],actualizarCategoria);

// Borrar una categoria - Admin
router.delete("/:id", [
  validarJWT,
  esAdminRol,
  check("id","No es un id de Mongo valido").isMongoId(),
  check("id").custom(existeCategoriaPorID),
  validarCampos
],borrarCategoria);

export default router;
