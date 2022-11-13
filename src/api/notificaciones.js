import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroNotificaciones,
    ENDPOINTListarNotificaciones,
    ENDPOINTListarPaginandoNotificaciones,
    ENDPOINTListarDepartamentoNotificaciones,
    ENDPOINTObtenerNotificaciones,
    ENDPOINTEliminarNotificaciones,
    ENDPOINTCambiarEstadoNotificaciones,
    ENDPOINTEliminarVistaNotificaciones,
    ENDPOINTActualizarNotificaciones
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra notificaciones
export async function registraNotificaciones(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroNotificaciones, data, config);
}

// Para obtener una notificacion
export async function obtenerNotificaciones(params) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNotificaciones + `/${params}`, config);
}

// Para listar todas las notificaciones
export async function listarNotificaciones(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarNotificaciones, config);
}

// Listar las notificaciones paginandolas
export async function listarNotificacionesPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoNotificaciones + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las notificaciones por departamento
export async function listarNotificacionesPorDepartamento(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDepartamentoNotificaciones, config);
}

// Elimina notificacion de la bd
export async function eliminaNotificacion(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarNotificaciones + `/${id}`, config);
}

// Cambia estado de visualización
export async function cambiaEstadoNotificacion(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCambiarEstadoNotificaciones + `/${id}`, data, config);
}

// Eliminar de la vista notificacion
export async function cambiaVistaNotificacion(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTEliminarVistaNotificaciones + `/${id}`, data, config);
}

// Modifica datos de la notificación
export async function actualizaNotificacion(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarNotificaciones + `/${id}`, data, config);
}
