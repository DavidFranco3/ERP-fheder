import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraNoConformidad,
    ENDPOINTListarNoConformidad,
    ENDPOINTObtenerNoConformidad,
    ENDPOINTObtenerItemNoConformidad,
    ENDPOINTObtenerDatosNoConformidad,
    ENDPOINTEliminarNoConformidad,
    ENDPOINTActualizarNoConformidad,
    ENDPOINTActualizarEstadoNoConformidad,
    ENDPOINTListarNoConformidadPaginacion,
    ENDPOINTObtenerNumeroNoConformidad,
    ENDPOINTTotalNoConformidad,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraNoConformidad(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraNoConformidad, data, config);
}

export async function totalNoConformidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalNoConformidad, config);
}

export async function obtenerItemNoConformidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemNoConformidad, config);
}

// Para obtener todos los datos del pedido
export async function obtenerNoConformidad(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoConformidad + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosNoConformidad(factura) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosNoConformidad + `/${factura}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNoConformidad(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNumeroNoConformidad, config);
}

// Para listar todos los pedidos
export async function listarNoConformidad(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNoConformidad +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarNoConformidadPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNoConformidadPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaNoConformidad(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarNoConformidad + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoNoConformidad(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoNoConformidad + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaNoConformidad(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarNoConformidad + `/${id}`, data, config);
}
