const app = require("../config/config.js");
const { getService } = require("../config/service-config");

const smartContractServiceId = 'smart-contract';
const  auth = app.auth;

/**
 * Ejecuta el filtro.
 *
 * Regresa true si puede seguir ejecutando o false si debe retornar una respuesta inmediatamente despues de ejecutar el filtro
 * @param {any} req Request
 * @param {any} res Response
 * @returns {Promise<boolean>} si debe seguir el filter o no
 */
const doFilter = async (req, res) => {
	if (!auth) return true;
	let service = await getService(smartContractServiceId).catch((err) => {
		console.log('Ocurrió un error al obtener informacion de servicio [' + smartContractServiceId + ']');
		console.log(err);
		return null;
	});
	return (service && service.status === 'AVAILABLE');
};

module.exports = { doFilter };