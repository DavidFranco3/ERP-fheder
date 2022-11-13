import { API_HOST } from "../utils/constants";
import {
    ENDPOINTEnviarCorreoNoReply,
    ENDPOINTEnviarCorreo
} from "./endpoints";

import { getTokenApi } from "./auth";
import axios from "axios";

// Envio de correos con uso del remitente como no-reply@fredher.com
export async function enviaCorreoNoReply(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTEnviarCorreoNoReply, data, config);
}

// Envio de correos especificando remitente y destinatario
export async function enviaCorreo(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTEnviarCorreo, data, config);
}
