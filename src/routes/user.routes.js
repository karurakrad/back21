const { Router } = require("express");
const {
  getUsers,
  postUser,
  deleteUser,
  putUser,
  verifyUser
} = require("../controllers/user.controllers.js");

const router = Router();

//RUTAS
router.get("/", getUsers);

router.post("/agregar", postUser);

router.get("/verificar", verifyUser);

router.put("/actualizar", putUser);

router.delete("/borrar", deleteUser);


module.exports = router;
