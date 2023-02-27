import { actualizaTracking, obtenerDatosTracking, obtenerNumeroTracking, registraTracking, eliminaPedidoVenta } from "../../../api/tracking";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { registraCuentaCliente, obtenerCuentaCliente, obtenerNumeroCuentaCliente, actualizaCuentaCliente } from "../../../api/cuentasCliente";

// Para el registro del tracking
export function LogCuentaRegistro(cliente, nombreCliente, total) {
    try {
        // Inicia la obtención del folio correspondiente
        obtenerNumeroCuentaCliente().then(response => {
            const { data } = response;

            // Formación del data para registro de tracking
            const dataTemp = {
                folio: data.noCuenta,
                cliente: cliente,
                nombreCliente: nombreCliente,
                sucursal: getSucursal(),
                total: total,
            }

            // Inicia el registro del tracking
            registraCuentaCliente(dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se registrado una nueva cuenta para el cliente" + nombreCliente, data.datos);
            }).catch(e => {
                console.log(e)
            })
            // Termina el registro del tracking

        }).catch(e => {
            console.log(e)
        })
        // Termina la obtención del folio correspondiente
    } catch (e) {
        console.log(e)
    }
}

// Realiza la modificación de saldos al realizar un movimiento
export function LogCuentaActualizacion(cliente, nombreCliente, total) {
     console.log(total);
    try {
        obtenerCuentaCliente(cliente).then(response => {
            const { data } = response;
            console.log(data);

            const dataTemp = {

                total: parseFloat(data.total) + parseFloat(total)
            }

            console.log(dataTemp);

            // Inicia actualización de saldos de los socios
            actualizaCuentaCliente(cliente, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a actualizado la cuenta del cliente " + nombreCliente, dataTemp)
                // console.log("Actualización de saldo personal")
            }).catch(e => {
                // console.log(e)
            })
            // Termina actualización de saldos de los socios
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}
