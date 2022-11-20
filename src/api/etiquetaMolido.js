import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraEtiquetaMolido,
    ENDPOINTListarEtiquetaMolido,
    ENDPOINTObtenerEtiquetaMolido,
    ENDPOINTObtenerItemEtiquetaMolido,
    ENDPOINTObtenerDatosEtiquetaMolido,
    ENDPOINTEliminarEtiquetaMolido,
    ENDPOINTActualizarEtiquetaMolido,
    ENDPOINTActualizarEstadoEtiquetaMolido,
    ENDPOINTListarEtiquetaMolidoPaginacion,
    ENDPOINTObtenerNoEtiquetaMolido,
    ENDPOINTTotalEtiquetaMolido,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraEtiquetaMolido(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraEtiquetaMolido, data, config);
}

export async function totalEtiquetaMolido() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEtiquetaMolido, config);
}

export async function obtenerItemEtiquetaMolido() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemEtiquetaMolido, config);
}

// Para obtener todos los datos del pedido
export async function obtenerEtiquetaMolido(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEtiquetaMolido + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosEtiquetaMolido(factura) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosEtiquetaMolido + `/${factura}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNoEtiqueta(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoEtiquetaMolido, config);
}

// Para listar todos los pedidos
export async function listarEtiquetaMolido(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetaMolido, config);
}

// Listar los pedidos de venta paginandolos
export async function listarEtiquetaMolidoPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetaMolidoPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaEtiquetaMolido(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEtiquetaMolido + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoEtiquetaMolido(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoEtiquetaMolido + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaEtiquetaMolido(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEtiquetaMolido + `/${id}`, data, config);
}
