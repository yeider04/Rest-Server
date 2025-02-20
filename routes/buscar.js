import { Router } from "express";
import  {buscar}  from "../controllers/buscar.js";

const router = Router();

// Definir las rutas
router.get("/:coleccion/:termino", buscar);

export default router; 
