import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraEtiquetaPT,
    ENDPOINTListarEtiquetaPT,
    ENDPOINTObtenerEtiquetaPT,
    ENDPOINTObtenerItemEtiquetaPT,
    ENDPOINTObtenerDatosEtiquetaPT,
    ENDPOINTEliminarEtiquetaPT,
    ENDPOINTActualizarEtiquetaPT,
    ENDPOINTActualizarEstadoEtiquetaPT,
    ENDPOINTListarEtiquetaPTPaginacion,
    ENDPOINTObtenerNoEtiquetaPT,
    ENDPOINTTotalEtiquetaPT,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraEtiquetaPT(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraEtiquetaPT, data, config);
}

export async function totalEtiquetasPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEtiquetaPT, config);
}

export async function obtenerItemEtiquetaPT() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemEtiquetaPT, config);
}

// Para obtener todos los datos del pedido
export async function obtenerEtiquetaPT(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEtiquetaPT + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosEtiquetaPT(factura) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosEtiquetaPT + `/${factura}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNoEtiquetaPT(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoEtiquetaPT, config);
}

// Para listar todos los pedidos
export async function listarEtiquetaPT(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetaPT, config);
}

// Listar los pedidos de venta paginandolos
export async function listarEtiquetaPTPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetaPTPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaEtiquetaPT(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEtiquetaPT + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoEtiquetaPT(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoEtiquetaPT + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaEtiquetaPT(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEtiquetaPT + `/${id}`, data, config);
}
