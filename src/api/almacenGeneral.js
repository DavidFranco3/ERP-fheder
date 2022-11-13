import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroAlmacenGeneral,
    ENDPOINTListarAlmacenGeneral,
    ENDPOINTObtenerFolioAlmacenGeneral,
    ENDPOINTListarPaginandoAlmacenGeneral,
    ENDPOINTTotalAlmacenGeneral,
    ENDPOINTObtenerAlmacenGeneral,
    ENDPOINTListarMovimientosAlmacenGeneral,
    ENDPOINTEliminarAlmacenGeneral,
    ENDPOINTActualizarAlmacenGeneral,
    ENDPOINTRegistraMovimientosAlmacenGeneral,
    ENDPOINTModificaExistenciasAlmacenGeneral,
    ENDPOINTObtenerDatosxFolioAlmacenGeneral
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro en el almacen general
export async function registraAlmacenGeneral(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroAlmacenGeneral, data, config);
}

// Listar completa los elementos del almacen general
export async function listarAlmacenGeneral(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlmacenGeneral, config);
}

// Obtener el folio actual de el articulo en el almacen general
export async function obtenerFolioActualAlmacenGeneral() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioAlmacenGeneral, config);
}

// Listar paginando los elemntos del almacen general
export async function listarPaginacionAlmacenGeneral(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoAlmacenGeneral + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener el total de registros del almacen general
export async function totalAlmacenGeneral() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAlmacenGeneral, config);
}

// Obtener los datos de un articulo del almacen segun el id propircionado
export async function obtenerAlmacenGeneral(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAlmacenGeneral + `/${id}`, config);
}

// Listar los movimientos de un articulo del almacen general segun el folio del almacen
export async function obtenerDatosAlmacenGeneral(folioAlmacen) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosAlmacenGeneral + `/${folioAlmacen}`, config);
}


// Eliminar un artículo del almacen general
export async function eliminaAlmacenGeneral(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAlmacenGeneral + `/${id}`, config);
}

// Actualizar la informacion de un articulo del almacen general
export async function actualizaAlmacenGeneral(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarAlmacenGeneral + `/${id}`, data, config);
}

// Registrar movimientos de un articulo del almacen general
export async function registraMovimientosAlmacenGeneral(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTRegistraMovimientosAlmacenGeneral + `/${id}`, data, config);
}

// Modifica las existencias de un artículo del almacen general
export async function modificaExistenciasAlmacenGeneral(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTModificaExistenciasAlmacenGeneral + `/${id}`, data, config);
}

// Obtener toda la información de un articulo segun el folio del almacen especificado -- ENDPOINTObtenerDatosxFolioAlmacenGeneral
export async function obtenerDatosxFolioAlmacenGeneral(dato) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosxFolioAlmacenGeneral + `/${dato}`, config);
}
