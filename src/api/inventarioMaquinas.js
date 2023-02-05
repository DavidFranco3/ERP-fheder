import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraInventarioMaquina,
    ENDPOINTObtenerItemInventarioMaquina,
    ENDPOINTListarInventarioMaquina,
    ENDPOINTObtenerInventarioMaquina,
    ENDPOINTEliminarInventarioMaquina,
    ENDPOINTActualizarInventarioMaquina,
    ENDPOINTActualizarEstadoInventarioMaquina,
    ENDPOINTListarInventarioMaquinaPaginacion,
    ENDPOINTTotalInventarioMaquina,
} from "./endpoints";
import axios from 'axios';
import {getTokenApi} from "./auth";

// Registra pedidos de venta
export async function registraInventarioMaquina(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraInventarioMaquina, data, config);
}

export async function totalInventarioMaquina() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalInventarioMaquina, config);
}

export async function obtenerItemInventarioMaquina() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemInventarioMaquina, config);
}

// Para obtener todos los datos del pedido
export async function obtenerInventarioMaquina(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerInventarioMaquina + `/${params}`, config);
}

// Para listar todos los pedidos
export async function listarInventarioMaquina(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInventarioMaquina +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarInventarioMaquinaPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarInventarioMaquinaPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaInventarioMaquina(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarInventarioMaquina + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoInventarioMaquina(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoInventarioMaquina + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaInventarioMaquina(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarInventarioMaquina + `/${id}`, data, config);
}
