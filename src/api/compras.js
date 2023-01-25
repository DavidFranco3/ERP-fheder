import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroCompras,
    ENDPOINTListarCompras,
    ENDPOINTListarComprasActivas,
    ENDPOINTListarPaginandoCompras,
    ENDPOINTObtenerCompras,
    ENDPOINTObtenerDatosCompras,
    ENDPOINTListarProductosCompras,
    ENDPOINTObtenerNoCompra,
    ENDPOINTObtenerItem,
    ENDPOINTEliminarCompras,
    ENDPOINTActualizarEstadoCompras,
    ENDPOINTActualizarCompras,
    ENDPOINTTotalCompras,
    ENDPOINTListarPaginandoDeptoCompras,
    ENDPOINTTotalDeptoCompras,
    ENDPOINTListarDeptoCompras,
    ENDPOINTListarPaginandoOVCompras,
    ENDPOINTTotalOVCompras
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra orden de compra
export async function registraOrdenCompra(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroCompras, data, config);
}

// Obten el total de registros de la colección
export async function totalCompras() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCompras, config);
}

// Para obtener todos los datos de una orden de compra
export async function obtenerOrdenCompra(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCompras + `/${id}`, config);
}

// Para obtener los datos de una compra segun el folio
export async function obtenerDatosCompra(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosCompras + `/${folio}`, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerNumeroOrdenCompra() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoCompra, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItem() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItem, config);
}

// Para listar todas las órdenes de compra
export async function listarOrdenesCompra(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCompras +`/?sucursal=${sucursal}`, config);
}

// Para listar todas las órdenes de compra
export async function listarOrdenesCompraActivas(sucursal) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarComprasActivas +`/?sucursal=${sucursal}`, config);
}

// Listar los productos de cada orden de compra con detalles
export async function listarProductosCompras(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProductosCompras, config);
}

// Lista las ordenes de compra paginándolas
export async function listarOrdenesCompraPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCompras + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina órdenes de compra
export async function eliminaOrdenesCompra(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCompras + `/${id}`, config);
}

// Actualiza estado de una orden de compra
export async function cambiaStatusOrdenCompra(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoCompras + `/${id}`, data, config);
}

// Modifica datos de una orden de compra
export async function actualizaOrdenCompra(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCompras + `/${id}`, data, config);
}

// Listar paginando las compras indicando el departamento depto
export async function listarPaginacionDeptoCompras(pagina, limite, depto) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoDeptoCompras + `/?pagina=${pagina}&&limite=${limite}&&depto=${depto}`, config);
}

// Obtener el total de compras registradas por departamento depto
export async function totalDeptoCompras(depto) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalDeptoCompras + `/?depto=${depto}`, config);
}

// Obtener el total de registros de compras por orden de venta
export async function totalOVCompras(ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalOVCompras + `/?ordenVenta=${ordenVenta}`, config);
}

// Listar todas las compras especificando el departamento depto
export async function listarDeptoCompras(depto) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDeptoCompras + `/?depto=${depto}`, config);
}

// Listar paginando las compras por departamento y orden de venta depto, ordenVenta --- Especial para el tracking
export async function listarPaginacionOVCompras(pagina, limite, ordenVenta) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST +  ENDPOINTListarPaginandoOVCompras + `/?pagina=${pagina}&&limite=${limite}&&ordenVenta=${ordenVenta}`, config);
}
