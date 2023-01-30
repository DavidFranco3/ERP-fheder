import { API_HOST } from "../utils/constants";
import {
ENDPOINTRegistroPrograma,
ENDPOINTListarPrograma,
ENDPOINTListarProgramaPorSemana,
ENDPOINTListarPaginandoPrograma,
ENDPOINTObtenerPrograma,
ENDPOINTObtenerNoPrograma,
ENDPOINTObtenerItemPrograma,
ENDPOINTEliminarPrograma,
ENDPOINTActualizarEstadoPrograma,
ENDPOINTActualizarPrograma,
ENDPOINTObtenerDatosPrograma,
ENDPOINTTotalPrograma,
ENDPOINTHabilitarLunesT1,
ENDPOINTHabilitarLunesT2,
ENDPOINTHabilitarMartesT1,
ENDPOINTHabilitarMartesT2,
ENDPOINTHabilitarMiercolesT1,
ENDPOINTHabilitarMiercolesT2,
ENDPOINTHabilitarJuevesT1,
ENDPOINTHabilitarJuevesT2,
ENDPOINTHabilitarViernesT1,
ENDPOINTHabilitarViernesT2,
ENDPOINTHabilitarSabadoT1,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraPrograma(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroPrograma, data, config);
}

// Obten el total de registros de la colección
export async function totalPrograma() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPrograma, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerPrograma(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPrograma + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosPrograma(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosPrograma + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroPrograma() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoPrograma, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemPrograma() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemPrograma, config);
}

// Para listar todas las órdenes de compra
export async function listarPrograma(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPrograma +`/?sucursal=${sucursal}`, config);
}

// Para listar todas las órdenes de compra
export async function listarProgramaPorSemana(sucursal, semana) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProgramaPorSemana +`/?sucursal=${sucursal}&&semana=${semana}`, config);
}

// Lista las ordenes de compra paginándolas
export async function listarProgramaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPrograma + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaPrograma(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarPrograma + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusPrograma(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoPrograma + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarLunesT1 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarLunesT2 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarMartesT1 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarMartesT2 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarMiercolesT1 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarMiercolesT2 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarJuevesT1 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarJuevesT2 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarViernesT1 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarViernesT2 + `/${id}`, data, config);
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

    return await axios.put(API_HOST + ENDPOINTHabilitarSabadoT1 + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaPrograma(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarPrograma + `/${id}`, data, config);
}