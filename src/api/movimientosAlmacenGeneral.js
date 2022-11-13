import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroMovimientosAG,
    ENDPOINTListarMovimientosAG,
    ENDPOINTObtenerFolioMovimientosAG,
    ENDPOINTListarPaginandoMovimientosAG,
    ENDPOINTListarPaginandoxFolioAGMovimientosAG,
    ENDPOINTTotalMovimientosAG,
    ENDPOINTTotalxFolioAGMovimientosAG,
    ENDPOINTObtenerMovimientosAG
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro del movimiento  registraMovimientosAlmacenGeneral
export async function registraMovimientoAG(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroMovimientosAG, data, config);
}

// Obtener el listado de todos los movimientos del almacen
export async function listarMovimientosAG(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosAG, config);
}

// Obtener el folio actual
export async function obtenerFolioActualMovimientoAG() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioMovimientosAG, config);
}

// Listar paginando los movimientos del almacen
export async function listarPaginacionMovimientosAG(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMovimientosAG + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar paginando los movimientos del almacen correspondientes al folio de AG indicado
export async function listarPaginacionMovimientoAGAlmacenG(pagina, limite, folioAG) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoxFolioAGMovimientosAG + `/?pagina=${pagina}&&limite=${limite}&&folioAG=${folioAG}`, config);
}

// Obtener el total de movimientos del almacen
export async function totalMovimientosAG() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosAG, config);
}

// Obtener el total de movimientos correspondientes al folio de AG indicado
export async function totalMovimientosAGAlmacenG(folioAG) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalxFolioAGMovimientosAG + `/?folioAG=${folioAG}`, config);
}

// Obtener los datos del movimiento indicando el id
export async function obtenerMovimientoAG(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMovimientosAG + `/${id}`, config);
}
