import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroInicialAlmacenes,
    ENDPOINTRegistroGestionAlmacenes,
    ENDPOINTListarRegistrosAlmacenes,
    ENDPOINTObtenerFolioAlmacenes,
    ENDPOINTListarPaginandoAlmacenes,
    ENDPOINTObtenerAlmacenes,
    ENDPOINTObtenerDatosFolioAlmacenes,
    ENDPOINTObtenerDatosArticulo,
    ENDPOINTListarMovimientosArticulos,
    ENDPOINTEliminarAlmacenes,
    ENDPOINTActualizarEstadoAlmacenes,
    ENDPOINTActualizaExistenciasAlmacenes,
    ENDPOINTRegistraMovimientosAlmacenes,
    ENDPOINTTotalMovimientosAlmacenes,
    ENDPOINTObtenerItemAlmacenes,
    ENDPOINTListarMovimientosGeneral
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registro inicial de almacen de materia prima
export async function registroInicialAlmacenes(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroInicialAlmacenes, data, config);
}

// Registro inicial de almacen de materia prima
export async function registroGestionAlmacenes(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroGestionAlmacenes, data, config);
}

// Obten el total de registros de la colección
export async function totalMovimientosAlmacenes() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosAlmacenes, config);
}

// Para obtener el número de orden de compra actual
export async function obtenerItemAlmacen() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerItemAlmacenes, config);
}

// Registra Movimientos del almacen
export async function registraMovimientosAlmacenes(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTRegistraMovimientosAlmacenes + `/${id}`, data, config);
}

// Listar todas las materias primas
export async function listarRegistrosAlmacen(sucursal, almacen) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarRegistrosAlmacenes + `/?sucursal=${sucursal}&&almacen=${almacen}`, config);
}

// Obtener el folio actual del almacen
export async function obtenerFolioActualAlmacenes() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerFolioAlmacenes, config);
}

// Listar los productos de cada orden de compra con detalles
export async function listarMovimientosGeneral(sucursal, almacen) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosGeneral + `/?sucursal=${sucursal}&&almacen=${almacen}`, config);
}

// Listar paginando las materias primas del almacen
export async function listarPaginacionAlmacenes(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoAlmacenes + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtener los datos de una materia prima segun el id
export async function obtenerAlmacenesID(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerAlmacenes + `/${id}`, config);
}

// Obtener los datos de una materia prima segun el folio de la MP
export async function obtenerDatosAlmacenesFolio(folio) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosFolioAlmacenes + `/${folio}`, config);
}

// Obtener los datos de una materia prima segun el folio de la MP
export async function obtenerDatosArticulo(folioArticulo) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerDatosArticulo + `/${folioArticulo}`, config);
}

// Listar todos los movimientos de una materia prima segun el folio de la mp
export async function listarMovimientosAlmacenes(folioArticulo) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosArticulos + `/${folioArticulo}`, config);
}

// Eliminar una materia prima del almacen
export async function eliminaAlmacenes(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarAlmacenes + `/${id}`, config);
}

// Actualizar el estado de las materias primas del almacen
export async function actualizaEstadoAlmacenes(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarEstadoAlmacenes + `/${id}`, data, config);
}

// Actualizar las existencias de almacen de una materia prima
export async function actualizaExistenciasAlmacenes(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizaExistenciasAlmacenes + `/${id}`, data, config);
}

