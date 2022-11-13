import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistraUsuarios,
    ENDPOINTListarUsuarios,
    ENDPOINTObtenerUsuario,
    ENDPOINTEliminarUsuario,
    ENDPOINTActualizarUsuario,
    ENDPOINTDeshabilitaUsuario,
    ENDPOINTListarUsuariosPaginacion,
    ENDPOINTTotalUsuarios
} from "./endpoints";
import axios from 'axios';
import {getTokenApi, obtenidusuarioLogueado} from "./auth";
export let nombreUsuario = "";
export let apellidosUsuario = "";
export let fotoPrincipal = null

// Recupera nombre del usuario
if(getTokenApi()) {
    try {
        obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response =>
        {
            //console.log(response);
            const { data: { nombre, apellidos } } = response;
            //console.log(response)
            nombreUsuario = nombre;
            apellidosUsuario = apellidos;
            return nombre, apellidos;
        })
    } catch (e) {
        //
    }
}

// Recupera la imagen del usuario
if(getTokenApi()) {
    try {
        obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response =>
        {
            //console.log(response);
            const { data } = response;

            //console.log(data.foto)
            //setFotoUsuario(data.foto);
            fotoPrincipal = data.foto
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}

// Registra usuarios
export async function registraUsuarios(data) {
    //console.log(data)

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistraUsuarios, data, config);
}

// Para obtener todos los datos del usuario
export async function obtenerUsuario(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerUsuario + `/${params}`, config);
}

// Obten el total de registros de la colección
export async function totalUsuarios() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalUsuarios, config);
}

// Para listar todos los usuarios
export async function listarUsuarios(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarUsuarios, config);
}

// Listar los usuarios paginandolos
export async function listarUsuariosPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarUsuariosPaginacion + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina cliente fisicamente de la bd
export async function eliminaUsuario(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarUsuario + `/${id}`, config);
}

// Deshabilita el usuario
export async function deshabilitaUsuario(id, data) {
    //console.log(data)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTDeshabilitaUsuario + `/${id}`, data, config);
}

// Modifica datos del usuario
export async function actualizaUsuario(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarUsuario + `/${id}`, data, config);
}
