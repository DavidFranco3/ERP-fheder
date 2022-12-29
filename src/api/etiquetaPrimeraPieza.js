import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraEtiquetasPiezas,
    ENDPOINTListarEtiquetasPiezas,
    ENDPOINTObtenerEtiquetasPiezas,
    ENDPOINTObtenerItemEtiquetasPiezas,
    ENDPOINTObtenerDatosEtiquetasPiezas,
    ENDPOINTEliminarEtiquetasPiezas,
    ENDPOINTActualizarEtiquetasPiezas,
    ENDPOINTActualizarEstadoEtiquetasPiezas,
    ENDPOINTListarEtiquetasPiezasPaginacion,
    ENDPOINTObtenerNoEtiquetaPieza,
    ENDPOINTTotalEtiquetasPiezas,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraEtiquetaPieza(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraEtiquetasPiezas, data, config);
}

export async function totalEtiquetasPiezas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalEtiquetasPiezas, config);
}

export async function obtenerItemEtiquetasPiezas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemEtiquetasPiezas, config);
}

// Para obtener todos los datos del pedido
export async function obtenerEtiquetasPiezas(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerEtiquetasPiezas + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosEtiquetasPiezas(factura) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosEtiquetasPiezas + `/${factura}`, config);
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
    return await axios.get(API_HOST + ENDPOINTObtenerNoEtiquetaPieza, config);
}

// Para listar todos los pedidos
export async function listarEtiquetasPiezas(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetasPiezas +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarEtiquetasPiezasPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarEtiquetasPiezasPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaEtiquetasPiezas(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarEtiquetasPiezas + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoEtiquetasPiezas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoEtiquetasPiezas + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaEtiquetasPiezas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEtiquetasPiezas + `/${id}`, data, config);
}
