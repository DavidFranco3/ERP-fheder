import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraSemana,
    ENDPOINTListarSemana,
    ENDPOINTObtenerSemana,
    ENDPOINTObtenerDatosSemana,
    ENDPOINTEliminarSemana,
    ENDPOINTActualizarSemana,
    ENDPOINTActualizarEstadoSemana,
    ENDPOINTListarSemanaPaginacion,
    ENDPOINTObtenerNoSemana,
    ENDPOINTTotalSemana,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraSemana(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraSemana, data, config);
}

export async function totalSemana() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalSemana, config);
}

// Para obtener todos los datos del pedido
export async function obtenerSemana(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerSemana + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosSemana(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosSemana + `/${folio}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroSemana(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoSemana, config);
}

// Para listar todos los pedidos
export async function listarSemana(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSemana +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarSemanaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarSemanaPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaSemana(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarSemana + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoSemana(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoSemana + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaSemana(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarSemana + `/${id}`, data, config);
}
