import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraEtiquetaMolde,
    ENDPOINTListarEtiquetaMolde,
    ENDPOINTObtenerEtiquetaMolde,
    ENDPOINTObtenerItemEtiquetaMolde,
    ENDPOINTObtenerDatosEtiquetaMolde,
    ENDPOINTEliminarEtiquetaMolde,
    ENDPOINTActualizarEtiquetaMolde,
    ENDPOINTActualizarEstadoEtiquetaMolde,
    ENDPOINTListarEtiquetaMoldePaginacion,
    ENDPOINTObtenerNoEtiquetaMolde,
    ENDPOINTTotalEtiquetaMolde,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraEtiquetaMolde(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraEtiquetaMolde, data, config);
}

export async function totalEtiquetaMolde() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEtiquetaMolde, config);
}

export async function obtenerItemEtiquetaMolde() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemEtiquetaMolde, config);
}

// Para obtener todos los datos del pedido
export async function obtenerEtiquetaMolde(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEtiquetaMolde + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosEtiquetaMolde(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosEtiquetaMolde + `/${folio}`, config);
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
    return await axios.get(API_HOST + ENDPOINTObtenerNoEtiquetaMolde, config);
}

// Para listar todos los pedidos
export async function listarEtiquetaMolde(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetaMolde +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarEtiquetaMoldePaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetaMoldePaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaEtiquetaMolde(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEtiquetaMolde + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoEtiquetaMolde(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoEtiquetaMolde + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaEtiquetaMolde(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEtiquetaMolde + `/${id}`, data, config);
}
