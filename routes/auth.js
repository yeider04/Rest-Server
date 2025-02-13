import { Router } from "express";
import { check } from "express-validator";

import {validarCampos} from "../middlewares/validar-campos.js"
import {login, googleSignIn } from "../controllers/auth.js";

const router = Router();

router.post("/login", [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La constraseña es obligatoria").notEmpty(),
    validarCampos
],login);

router.post("/google", [
    check("id_token", "El ID es necesario").notEmpty(),
    validarCampos
],googleSignIn);

export default router;