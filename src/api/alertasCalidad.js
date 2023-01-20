import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraAlertasCalidad,
    ENDPOINTListarAlertasCalidad,
    ENDPOINTObtenerAlertasCalidad,
    ENDPOINTObtenerItemAlertasCalidad,
    ENDPOINTObtenerDatosAlertasCalidad,
    ENDPOINTEliminarAlertasCalidad,
    ENDPOINTActualizarAlertasCalidad,
    ENDPOINTActualizarEstadoAlertasCalidad,
    ENDPOINTListarAlertasCalidadPaginacion,
    ENDPOINTObtenerNoAlertaCalidad,
    ENDPOINTTotalAlertasCalidad,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraAlertaCalidad(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraAlertasCalidad, data, config);
}

export async function totalAlertasCalidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalAlertasCalidad, config);
}

export async function obtenerItemAlertasCalidad() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemAlertasCalidad, config);
}

// Para obtener todos los datos del pedido
export async function obtenerAlertasCalidad(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAlertasCalidad + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosAlertasCalidad(factura) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosAlertasCalidad + `/${factura}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNoAlerta(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoAlertaCalidad, config);
}

// Para listar todos los pedidos
export async function listarAlertasCalidad(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlertasCalidad +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarAlertasCalidadPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarAlertasCalidadPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaAlertasCalidad(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAlertasCalidad + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoAlertasCalidad(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoAlertasCalidad + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaAlertasCalidad(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarAlertasCalidad + `/${id}`, data, config);
}
