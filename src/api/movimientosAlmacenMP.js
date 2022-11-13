import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroMovimientosAMP,
    ENDPOINTListarMovimientosAMP,
    ENDPOINTObtenerFolioMovimientosAMP,
    ENDPOINTListarPaginandoMovimientosAMP,
    ENDPOINTListarPaginandoxFolioMPMovimientosAMP,
    ENDPOINTTotalMovimientosAMP,
    ENDPOINTTotalxFolioMPMovimientosAMP,
    ENDPOINTObtenerMovimientosAMP
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro del movimiento
export async function registraMovimentoAMP(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroMovimientosAMP, data, config);
}

// Obtener el listado de todos los movimientos del almacen
export async function listarMovimientosAMP(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosAMP, config);
}

// Obtener el folio actual
export async function obtenerFolioActualMovimientosAMP() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioMovimientosAMP, config);
}

// Listar paginando los movimientos del almacen
export async function listarPaginacionMovimientosAMP(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMovimientosAMP + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar paginando los movimientos del almacen correspondientes al folio de MP indicado
export async function listarPaginacionMovimientosMPAMP(pagina, limite, folioMP) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoxFolioMPMovimientosAMP + `/?pagina=${pagina}&&limite=${limite}&&folioMP=${folioMP}`, config);
}

// Obtener el total de movimientos del almacen
export async function totalMovimientosAMP() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosAMP, config);
}

// Obtener el total de movimientos correspondientes al folio de MP indicado
export async function totalMovimientosMPAMP(folioMP) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalxFolioMPMovimientosAMP + `/?folioMP=${folioMP}`, config);
}

// Obtener los datos del movimiento indicando el id
export async function obtenerMovimientoAMP(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMovimientosAMP + `/${id}`, config);
}
