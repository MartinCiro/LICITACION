const { validar, validarUser, crearUser, delUser, updateUser, obtenerProductos} = require("../controller/clientes.controller");
const ResponseBody = require('../../../shared/model/ResponseBody.model');

const fnApi = async (req, res, apiFunction) => {
    try {
        const result = await apiFunction(req.body);
        const message = new ResponseBody(true, 200, result);
        return res.status(message.status_cod).json(message);
    } catch (error) {
        if (error.data) {
            const message = new ResponseBody(error.ok, error.status_cod, error.data);
            return res.status(message.status_cod).json(message);
        } else {
            const message = new ResponseBody(false, 500, { message: 'Ha ocurrido un error inesperado. Por favor inténtelo nuevamente más tarde' });
            return res.status(message.status_cod).json(message);
        }
    }
};

//Inicio CRUD Usuario
const crearUserApi = (req, res) => {
    const { nombre, num_cedula, pais, departamento, ciudad, pass } = req.body;
    return fnApi(req, res, crearUser.bind(null, nombre, num_cedula, pais, departamento, ciudad, pass));
};

const validarUserApi = (req, res) => {
    const { num_cedula, pass } = req.body;
    return fnApi(req, res, validarUser.bind(null, num_cedula, pass));
};

const updateUserApi = (req, res) => {
    const { nombre, num_cedula, pais, departamento, ciudad } = req.body;
    return fnApi(req, res, updateUser.bind(null, nombre, num_cedula, pais, departamento, ciudad));
};

const delUserApi = (req, res) => {
    const { num_cedula } = req.body;
    return fnApi(req, res, delUser.bind(null, num_cedula));
};
//Fin CRUD Usuario

const obtenerProductosApi = (req, res) => {
    return fnApi(req, res, obtenerProductos);
};

module.exports = {
    validar,
    validarUserApi,
    crearUserApi,
    delUserApi,
    updateUserApi,
    obtenerProductosApi
}