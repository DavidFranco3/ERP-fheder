import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraNota,
    ENDPOINTListarNotas,
    ENDPOINTListarNotasPorTipo,
    ENDPOINTListarNotasActivas,
    ENDPOINTObtenerNotas,
    ENDPOINTObtenerDatosNotas,
    ENDPOINTEliminarNotas,
    ENDPOINTActualizarNotas,
    ENDPOINTActualizarEstadoNotas,
    ENDPOINTListarNotasPaginacion,
    ENDPOINTObtenerNoNotasCredito,
    ENDPOINTObtenerNoNotasCargo,
    ENDPOINTObtenerNoNotasDevolucion,
    ENDPOINTTotalNotas,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraNota(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraNota, data, config);
}

export async function totalNotas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalNotas, config);
}

// Para obtener todos los datos del pedido
export async function obtenerNotas(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNotas + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosNota(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosNotas + `/${ordenVenta}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNotaCredito(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoNotasCredito, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNotaCargo(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoNotasCargo, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroNotaDevolucion(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoNotasDevolucion, config);
}

// Para listar todos los pedidos
export async function listarNotas(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotas + `/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarNotasPorTipo(tipo, sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasPorTipo + `/?tipo=${tipo}&&sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarNotasActivas(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasActivas + `/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarNotasPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotasPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaNotas(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarNotas + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoNotas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoNotas + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaNotas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarNotas + `/${id}`, data, config);
}
