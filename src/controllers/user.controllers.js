const Usuario = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.json({ usuarios });
  } catch (err) {
    res.status(500).json({ msj: "hubo un error" });
  }
};

const postUser = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
    });

    const payload = {
      user: {
        id: nuevoUsuario._id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).json({ msj: "hubo un error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    // CONFIRMAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS Y RETORNAMOS SUS DATOS, EXCLUYENDO EL PASSWORD
    const usuario = await Usuario.findById(req.user.id).select("-password");
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ msg: "Hubo un error", error });
  }
};

const putUser = async (req, res) => {
  const { id, nombre, email } = req.body;
  try {
    const nuevoUsuario = await Usuario.findByIdAndUpdate(
      id,
      { nombre, email },
      { new: true }
    );
    res.json({ nuevoUsuario });
  } catch (err) {
    res.status(500).json({ msj: "hubo un error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const usuarioBorrado = await Usuario.findByIdAndDelete({ _id: id });
    res.json({ usuarioBorrado });
  } catch (err) {
    res.status(500).json({ msj: "hubo un error" });
  }
};

module.exports = { getUsers, postUser, deleteUser, putUser, verifyUser };
