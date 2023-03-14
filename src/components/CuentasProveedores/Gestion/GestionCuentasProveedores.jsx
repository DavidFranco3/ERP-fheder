import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { registraCuentaProveedor, obtenerCuentaProveedor, obtenerNumeroCuentaProveedor, actualizaCuentaProveedor } from "../../../api/cuentasProveedor";

// Para el registro del tracking
export function LogCuentaRegistro(proveedor, nombreProveedor, total) {
    try {
        // Inicia la obtención del folio correspondiente
        obtenerNumeroCuentaProveedor().then(response => {
            const { data } = response;

            // Formación del data para registro de tracking
            const dataTemp = {
                folio: data.noCuenta,
                proveedor: proveedor,
                nombreProveedor: nombreProveedor,
                sucursal: getSucursal(),
                total: total,
            }

            // Inicia el registro del tracking
            registraCuentaProveedor(dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se registrado una nueva cuenta para el proveedor " + nombreProveedor, data.datos);
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
export function LogCuentaActualizacion(proveedor, nombreProveedor, total) {
    console.log(total);
    try {
        obtenerCuentaProveedor(proveedor).then(response => {
            const { data } = response;
            console.log(data);

            const dataTemp = {

                total: parseFloat(data.total) + parseFloat(total)
            }

            console.log(dataTemp);

            // Inicia actualización de saldos de los socios
            actualizaCuentaProveedor(proveedor, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a actualizado la cuenta del proveedor " + nombreProveedor, dataTemp)
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
