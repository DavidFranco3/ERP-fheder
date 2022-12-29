import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroMovimientosAPT,
    ENDPOINTListarMovimientosAPT,
    ENDPOINTObtenerFolioMovimientosAPT,
    ENDPOINTListarPaginandoMovimientosAPT,
    ENDPOINTListarPaginandoxFolioMPMovimientosAPT,
    ENDPOINTTotalMovimientosAPT,
    ENDPOINTTotalxFolioMPMovimientosAPT,
    ENDPOINTObtenerMovimientosAPT
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro del movimiento
export async function registraMovimientoAPT(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroMovimientosAPT, data, config);
}

// Obtener el listado de todos los movimientos del almacen
export async function listarMovimientosAPT(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosAPT +`/?sucursal=${sucursal}`, config);
}

// Obtener el folio actual
export async function obtenerFolioActualMovimientosAPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioMovimientosAPT, config);
}

// Listar paginando los movimientos del almacen
export async function listarPaginacionMovimientosAPT(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMovimientosAPT + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar paginando los movimientos del almacen correspondientes al folio de MP indicado
export async function listarPaginacionMovimientosMPAPT(pagina, limite, folioMP) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoxFolioMPMovimientosAPT + `/?pagina=${pagina}&&limite=${limite}&&folioMP=${folioMP}`, config);
}

// Obtener el total de movimientos del almacen
export async function totalMovimientosAPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosAPT, config);
}

// Obtener el total de movimientos correspondientes al folio de MP indicado
export async function totalMovimientosMPAPT(folioMP) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalxFolioMPMovimientosAPT + `/?folioMP=${folioMP}`, config);
}

// Obtener los datos del movimiento indicando el id
export async function obtenerMovimientosAPT(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMovimientosAPT + `/${id}`, config);
}
