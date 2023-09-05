const clienteUtils = require("../utils/clientes.utils");
const axios = require("axios");

const fs = require("fs");

function validar(valor, nombre) {
  if (!valor)
    throw {
      ok: false,
      status_cod: 400,
      data: `No se ha proporcionado ${nombre}`,
    };
}

async function valiControl(apiFunction, msg, ...args) {
  try {
    const result = await apiFunction(...args);
    return result;
  } catch (error) {
    if (error.status_cod) {
      throw error;
    }
    console.log(error);
    throw {
      ok: false,
      status_cod: 500,
      data: `${msg}`,
    };
  }
}

// Ejemplo de uso para crearUser
async function crearUser(nombre, num_cedula, pais, departamento, ciudad, pass) {
  validar(nombre, "nombre");
  validar(num_cedula, "numero de cedula");
  validar(pais, "pais");
  validar(departamento, "departamento");
  validar(ciudad, "ciudad");
  validar(pass, "contraseña");
  return valiControl(
    clienteUtils.crearUsuarioU,
    "Ha ocurrido un error en la creacion del usuario, intente de nuevo mas tarde",
    nombre,
    num_cedula,
    pais,
    departamento,
    ciudad,
    pass
  );
}

// Ejemplo de uso para validarUser
async function validarUser(num_cedula, pass) {
  validar(num_cedula, "numero de cedula");
  validar(pass, "contraseña");
  return valiControl(clienteUtils.validarUserU,"Ha ocurrido un error en la validacion del usuario, intente de nuevo mas tarde", num_cedula, pass);
}

async function delUser(num_cedula) {
  validar(num_cedula, "numero de cedula");
  return valiControl(clienteUtils.delUserU, "Ha ocurrido un error en la eliminacion del usuario, intente de nuevo mas tarde", num_cedula);
}

async function updateUser(nombre, num_cedula, pais, departamento, ciudad) {
  validar(nombre, "nombre");
  validar(num_cedula, "numero de cedula");
  validar(pais, "pais");
  validar(departamento, "departamento");
  validar(ciudad, "ciudad");
  return valiControl(
    clienteUtils.updateUserU,
    "Ha ocurrido un error en la actualizacion del usuario, intente de nuevo mas tarde",
    nombre,
    num_cedula,
    pais,
    departamento,
    ciudad,
  );
}

async function obtenerProductos() {
  return valiControl(
    clienteUtils.obtenerProductos,
    "Ha ocurrido un error en la actualizacion del usuario, intente de nuevo mas tarde",
  );
}
module.exports = {
  validar,
  validarUser,
  crearUser,
  delUser,
  updateUser,
  obtenerProductos,
};
