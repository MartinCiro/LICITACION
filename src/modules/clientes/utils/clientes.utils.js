const { json } = require("express");
const { getConnection } = require("../../../interface/DBConn.js");
const config = require("../../../config.js");
const bcrypt = require("bcryptjs");

async function crearUsuarioU(
  nombre,
  num_cedula,
  pais,
  departamento,
  ciudad,
  pass
) {
  const pool = await getConnection();
  try {
    const hash = await bcrypt.hash(pass, 10);

    const params = [nombre, num_cedula, pais, departamento, ciudad];
    const insertQuery = `
            INSERT INTO huesped (
                nombre, num_cedula, pais, departamento, ciudad)
            VALUES (?, ?, ?, ?, ?)`;

     const result = await pool.query(insertQuery, params);

     const insertValidationQuery = `
         INSERT INTO validacion (num_cedula, pass)
         VALUES (?, ?)`;

     const validationResult = await pool.query(insertValidationQuery, [
       num_cedula,
       hash,
     ]);

     return {success: true, message: "Usuario registrado correctamente."
     };
   } catch (error) {
     console.log(error);
     if (error.code === "ER_DUP_ENTRY") {
       return { success: false, message: "El usuario ya se encuentra registrado."};
     }
   }
 }

async function validarUserU(num_cedula, pass) {
  try {
    const pool = await getConnection();

    // Consulta para obtener el hash de la contraseña almacenada en la tabla "validacion"
    const getHashQuery = "SELECT * FROM validacion WHERE num_cedula = ?";
    const [hashResult] = await pool.query(getHashQuery, [num_cedula]);

    if (hashResult.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const storedHash = hashResult[0].pass;

    const isPasswordCorrect = await bcrypt.compare(pass, storedHash);

    if (!isPasswordCorrect) {
      throw new Error("Contraseña incorrecta");
    }

    // Obtener los datos del usuario desde la tabla "clientes"
    const getUserDataQuery = "SELECT * FROM huesped WHERE num_cedula = ?";
    const [userDataResult] = await pool.query(getUserDataQuery, [num_cedula]);

    if (userDataResult.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const userData = userDataResult[0];

    return { success: true, message: "Inicio correcto." };
  } catch (error) {
    return { success: false, message: "Usuario o contraseña incorrecto" };
  }
}

 async function delUserU(num_cedula) {
   const pool = await getConnection();
   console.log(num_cedula);
   try {
     const tablesToDeleteFrom = [
       "validacion",
       "reserva",
       "ticket",
       "huesped",
     ];
     let recordsDeleted = false;  //Bandera para rastrear si se eliminaron registros
     for (const tableName of tablesToDeleteFrom) {
       const deleteQuery = `DELETE FROM ${tableName} WHERE num_cedula = ?`;
       const result = await pool.query(deleteQuery, [num_cedula]);

       if (result.affectedRows > 0) {
         recordsDeleted = true;
       }
     }

     if (!recordsDeleted) {
       return { success: false, message: "Registro eliminador correctamente." };
     }
   } catch (error) {
     console.error("Error al eliminar el usuario:", error);
     return { success: false, message: "No se pudo eliminar el registro." };
   } finally {
     pool.end();
   }
 }

// async function delUserU(num_cedula) {
//   const pool = await getConnection();
//   const tablesToDeleteFrom = [
//     "validacion",
//     "reserva",
//     "ticket",
//     "huesped",
//   ];

//   const results = await Promise.all(
//     tablesToDeleteFrom.map(async (table) => {
//       try {
//         const result = await pool.query(
//           `
//             DELETE FROM ${table}
//             WHERE num_cedula = ?
//           `,
//           [num_cedula]
//         );

//         return result.rowCount > 0;
//       } catch (error) {
//         console.log(`Error al eliminar de la tabla ${table}:`, error);
//         throw {
//           ok: false,
//           status_cod: 500,
//           data: `Ocurrió un error al eliminar de la tabla ${table}`,
//         };
//       }
//     })
//   );

//   const anyTableDeleted = results.some((result) => result);

//   // Finaliza la conexión de la piscina
//   pool.end();

//   return anyTableDeleted;
// }


async function updateUserU(nombre, num_cedula, pais, departamento, ciudad) {
  const pool = await getConnection();

  try {
    const updateQuery = `
            UPDATE huesped SET
                nombre = ?,
                num_cedula = ?,
                pais = ?,
                departamento = ?,
                ciudad = ?
            WHERE num_cedula = ?`;

    await pool.query(updateQuery, [
      nombre,
      num_cedula,
      pais,
      departamento,
      ciudad,
      num_cedula,
    ]);
  } catch (error) {
    throw { success: false, message: "No se puede actualziar el usuario" };;
  } finally {
    pool.end();
  }
}

async function logout(req, res) {
  if (req.session.loggedin) {
    req.session.destroy();
  }
  res.redirect("/");
}

async function obtenerProductos() {
  const pool = await getConnection();

  try {
    const selectQuery = `SELECT * FROM habitacion WHERE estado = 'disponible';`;

    const result = await pool.query(selectQuery);
    if (result.length > 0) {
      result.pop(); // Eliminar el último objeto del array
    }

    return result;
  } catch (error) {
    console.error("Error al obtener las habitaciones disponibles:", error);
    throw error;
  } finally {
    console.log("Cerrando conexión");
    pool.end();
  }
}
module.exports = {
  validarUserU,
  crearUsuarioU,
  delUserU,
  updateUserU,
  logout,
  obtenerProductos,
};
