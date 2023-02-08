import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraFactura,
    ENDPOINTListarFactura,
    ENDPOINTListarFacturaPorCliente,
    ENDPOINTListarFacturaActivo,
    ENDPOINTObtenerFactura,
    ENDPOINTEliminarFactura,
    ENDPOINTActualizarFactura,
    ENDPOINTListarFacturaPaginacion,
    ENDPOINTObtenerNoFactura,
    ENDPOINTActualizarEstadoFactura,
    ENDPOINTObtenerDatosFactura,
    ENDPOINTTotalFactura
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraFactura(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraFactura, data, config);
}

export async function totalFactura() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalFactura, config);
}

// Para obtener todos los datos del pedido
export async function obtenerFactura(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFactura + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosFactura(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosFactura + `/${folio}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNumeroFactura(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoFactura, config);
}

// Para listar todos los pedidos
export async function listarFactura(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarFactura +`/?sucursal=${sucursal}`, config);
}

// Para listar todos los pedidos
export async function listarFacturaPorCliente(sucursal, cliente) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarFacturaPorCliente +`/?sucursal=${sucursal}&&cliente=${cliente}`, config);
}

// Para listar todos los pedidos
export async function listarFacturaActiva(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarFacturaActivo +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarFacturaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarFacturaPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaFactura(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarFactura + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoFactura(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoFactura + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaFactura(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarFactura + `/${id}`, data, config);
}
