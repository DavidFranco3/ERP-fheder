import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroRequerimiento,
ENDPOINTListarRequerimiento,
ENDPOINTListarRequerimientoActivo,
ENDPOINTListarPaginandoRequerimiento,
ENDPOINTObtenerRequerimiento,
ENDPOINTObtenerNoRequerimiento,
ENDPOINTObtenerItemRequerimiento,
ENDPOINTEliminarRequerimiento,
ENDPOINTActualizarEstadoRequerimiento,
ENDPOINTActualizarRequerimiento,
ENDPOINTObtenerDatosRequerimiento,
ENDPOINTTotalRequerimiento,
ENDPOINTListarRequerimientoPorSemana,
ENDPOINTHabilitarPlaneacionLunesT1,
ENDPOINTHabilitarPlaneacionLunesT2,
ENDPOINTHabilitarPlaneacionMartesT1,
ENDPOINTHabilitarPlaneacionMartesT2,
ENDPOINTHabilitarPlaneacionMiercolesT1,
ENDPOINTHabilitarPlaneacionMiercolesT2,
ENDPOINTHabilitarPlaneacionJuevesT1,
ENDPOINTHabilitarPlaneacionJuevesT2,
ENDPOINTHabilitarPlaneacionViernesT1,
ENDPOINTHabilitarPlaneacionViernesT2,
ENDPOINTHabilitarPlaneacionSabadoT1,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraRequerimiento(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroRequerimiento, data, config);
}

// Obten el total de registros de la colección
export async function totalRequerimiento() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalRequerimiento, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerRequerimiento(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerRequerimiento + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosRequerimiento(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosRequerimiento + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroRequerimiento() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoRequerimiento, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemRequerimiento() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemRequerimiento, config);
}

// Para listar todas las órdenes de compra
export async function listarRequerimiento(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRequerimiento +`/?sucursal=${sucursal}`, config);
}

// Para listar todas las órdenes de compra
export async function listarRequerimientoPorSemana(sucursal, semana) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRequerimientoPorSemana +`/?sucursal=${sucursal}&&semana=${semana}`, config);
}

// Para listar todas las órdenes de compra
export async function listarRequerimientoActivo(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRequerimientoActivo +`/?sucursal=${sucursal}`, config);
}

// Lista las ordenes de compra paginándolas
export async function listarRequerimientoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoRequerimiento + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaRequerimiento(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarRequerimiento + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusRequerimiento(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoRequerimiento + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaLunesT1(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionLunesT1 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaLunesT2(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionLunesT2 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaMartesT1(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionMartesT1 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaMartesT2(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionMartesT2 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaMiercolesT1(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionMiercolesT1 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaMiercolesT2(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionMiercolesT2 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaJuevesT1(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionJuevesT1 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaJuevesT2(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionJuevesT2 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaViernesT1(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionViernesT1 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaViernesT2(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionViernesT2 + `/${id}`, data, config);
}

// Actualiza estado de una orden de compra
export async function habilitaSabadoT1(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTHabilitarPlaneacionSabadoT1 + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaRequerimiento(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarRequerimiento + `/${id}`, data, config);
}