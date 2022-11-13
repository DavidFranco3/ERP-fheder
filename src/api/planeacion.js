import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroPlaneacion,
    ENDPOINTListarPlaneacion,
    ENDPOINTObtenerFolioPlaneacion,
    ENDPOINTListarPaginandoPlaneacion,
    ENDPOINTObtenerPlaneacion,
    ENDPOINTObtenerDatosPlaneacion,
    ENDPOINTObtenerOrdenVentaPlaneacion,
    ENDPOINTEliminarPlaneacion,
    ENDPOINTActualizarPlaneacion,
    ENDPOINTTotalPlaneacion
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registrar planeación
export async function registraPlaneacion(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroPlaneacion, data, config);
}

// Obten el total de registros de la colección
export async function totalPlaneacion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPlaneacion, config);
}

// Obtener todas las planeaciones
export async function listarPlaneaciones(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPlaneacion, config);
}

// Obtener el folio actual de la planeación
export async function obtenerFolioActualPlaneacion() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioPlaneacion, config);
}

// Listar las planeaciones paginandolas
export async function listarPaginacionPlaneaciones(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPlaneacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener una planeación en especifico segun el id
export async function obtenerPlaneacion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPlaneacion + `/${id}`, config);
}

// Obtener una planeación en especifico segun el folio
export async function obtenerPlaneacionFolio(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosPlaneacion + `/${folio}`, config);
}

// Obtener una planeación en especifico segun la orden de venta
export async function obtenerPlaneacionOrdenVenta(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerOrdenVentaPlaneacion + `/${ordenVenta}`, config);
}

// Eliminar una planeación
export async function eliminaPlaneacion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarPlaneacion + `/${id}`, config);
}

// Actualizar, dando visto bueno a planeación, por producto
export async function actualizaPlaneacion(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarPlaneacion + `/${id}`, data, config);
}

