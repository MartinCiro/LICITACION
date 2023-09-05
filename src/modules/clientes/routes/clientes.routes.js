const { Router } = require('express');
const { isAuthenticatedMW, checkPermissions } = require('../../auth/api/auth.api');

// api handlers
const { validarUserApi, crearUserApi, delUserApi, updateUserApi, obtenerProductosApi} = require('../api/clientes.api');

const router = Router();

/**
 *  {
 *     body: {
 *          user: string, 
 *          pass: string,
 *      },
 *      
 *  }
 */
router.post('/createUser', crearUserApi);
router.post('/validate', validarUserApi);
router.delete('/deleteUser', delUserApi);
router.put('/updateUser', updateUserApi);
router.get('/productos', obtenerProductosApi);
//router.get('/clientes/leerRut', isAuthenticatedMW, checkPermissions([1, 2]), extractRutAPI); //ejm: uso
module.exports = router;


//https://co.hoteles.com/Hotel-Search?adults=null&children=null&destination=Cartagena%2C%20Bol%C3%ADvar%2C%20Colombia&endDate=2023-09-10&regionId=6140796&selected=1378320&semdtl=&sort=RECOMMENDED&startDate=2023-09-08&theme=&useRewards=false&userIntent=