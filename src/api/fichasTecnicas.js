import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraFichasTecnicas,
    ENDPOINTListarFichasTecnicas,
    ENDPOINTObtenerFichasTecnicas,
    ENDPOINTObtenerItemFichasTecnicas,
    ENDPOINTObtenerDatosFichasTecnicas,
    ENDPOINTEliminarFichasTecnicas,
    ENDPOINTActualizarFichasTecnicas,
    ENDPOINTActualizarEstadoFichasTecnicas,
    ENDPOINTListarFichasTecnicasPaginacion,
    ENDPOINTObtenerNoFichaTecnica,
    ENDPOINTTotalFichasTecnicas,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra pedidos de venta
export async function registraFichaTecnica(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraFichasTecnicas, data, config);
}

export async function totalFichasTecnicas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalFichasTecnicas, config);
}

export async function obtenerItemFichasTecnicas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemFichasTecnicas, config);
}

// Para obtener todos los datos del pedido
export async function obtenerFichasTecnicas(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFichasTecnicas + `/${params}`, config);
}

// Para obtener los datos del pedido de venta segun el folio
export async function obtenerDatosFichasTecnicas(factura) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosFichasTecnicas + `/${factura}`, config);
}

// Para obtener el numero de pedido de venta actual
export async function obtenerNoFicha(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoFichaTecnica, config);
}

// Para listar todos los pedidos
export async function listarFichasTecnicas(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarFichasTecnicas +`/?sucursal=${sucursal}`, config);
}

// Listar los pedidos de venta paginandolos
export async function listarFichasTecnicasPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarFichasTecnicasPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina pedido fisicamente de la bd
export async function eliminaFichasTecnicas(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarFichasTecnicas + `/${id}`, config);
}

// Para actualizar el estado del pedido de venta -- ENDPOINTActualizarEstadoPedidoVenta
export async function actualizaEstadoFichasTecnicas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoFichasTecnicas + `/${id}`, data, config);
}

// Modifica datos del departamentos
export async function actualizaFichasTecnicas(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarFichasTecnicas + `/${id}`, data, config);
}
