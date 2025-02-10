import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { emailExiste, esRolValido, existeUsuarioPorID } from "../helpers/db-validators.js";

import {
  usuariosDelete,
  usuariosGet,
  usuariosPatch,
  usuariosPost,
  usuariosPut,
} from "../controllers/usuarios.js";

const router = Router();

router.get("/", usuariosGet);

router.put("/:id",[
  check("id", "No es un ID valido").isMongoId(),
  check("id").custom(existeUsuarioPorID),
  check("rol").custom(esRolValido),
  validarCampos
] ,usuariosPut);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check(
      "password",
      "La contraseña debe tener como minimo 6 caracteres"
    ).isLength({ min: 6 }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste), 
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete("/:id", [
  check("id", "No es un ID valido").isMongoId(),
  check("id").custom(existeUsuarioPorID),
  validarCampos
],usuariosDelete);

router.patch("/", usuariosPatch);

export default router;
