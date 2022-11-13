import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroAlmacenPT,
    ENDPOINTListarAlmacenPT,
    ENDPOINTObtenerFolioAlmacenPT,
    ENDPOINTListarPaginandoAlmacenPT,
    ENDPOINTTotalAlmacenPT,
    ENDPOINTObtenerAlmacenPT,
    ENDPOINTObtenerxFolioMPAlmacenPT,
    ENDPOINTListarMovimientosAlmacenPT,
    ENDPOINTEliminarAlmacenPT,
    ENDPOINTActualizarEstadoAlmacenPT,
    ENDPOINTRegistraMovimientosAlmacenPT,
    ENDPOINTModificaExistenciasAlmacenPT
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro de pt en almacen
export async function registraAlmacenPT(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroAlmacenPT, data, config);
}

// Listar completo el contenido de almacen de pt
export async function listarAlmacenPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlmacenPT, config);
}

// Obtener el folio actual
export async function obtenerFolioActualAlmacenPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioAlmacenPT, config);
}

// Listar paginando
export async function listarPaginacionAlmacenPT(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoAlmacenPT + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener el numero total de registros
export async function totalAlmacenPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAlmacenPT, config);
}

// Obtener los datos de un articulo or el id
export async function obtenerAlmacenPT(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAlmacenPT + `/${id}`, config);
}

// Obtener los datos de un articulo por el folio de la materia prima
export async function obtenerDatosAlmacenPT(dato) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerxFolioMPAlmacenPT + `/${dato}`, config);
}

// Listar todos los movimientos de un articulo del almacen indicando folioMP
export async function listarMovimientosAlmacenPT(folioMP) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosAlmacenPT + `/${folioMP}`, config);
}

// Eliminar articulo del almacen
export async function eliminaAlmacenPT(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAlmacenPT + `/${id}`, config);
}

// Actualizar los datos de un articulo
export async function actualizaAlmacenPT(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoAlmacenPT + `/${id}`, data, config);
}

// Registra movimientos del almacen
export async function registraMovimientosAlmacenPT(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTRegistraMovimientosAlmacenPT + `/${id}`, data, config);
}

// Modifica las existencias del articulo del almacen
export async function actualizaExistenciasAlmacenPT(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTModificaExistenciasAlmacenPT + `/${id}`, data, config);
}
