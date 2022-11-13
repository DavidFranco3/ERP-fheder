import {actualizaTracking, obtenerDatosTracking, obtenerNumeroTracking, registraTracking} from "../../../api/tracking";

// Para el registro del tracking
export function LogTrackingRegistro(ordenVenta, cliente, fechaElaboracion){
    try {
        // Inicia la obtención del folio correspondiente
        obtenerNumeroTracking().then(response => {
            const { data } = response;

            // Formación del data para registro de tracking
            const dataTemp = {
                folio: data.noTracking,
                ordenVenta: ordenVenta,
                cliente: cliente,
                fechaElaboracion: fechaElaboracion,
                // fechaEntrega: fechaEntrega,
                status: "En Orden de Venta",
                indicador: "1"
            }

            // Inicia el registro del tracking
            registraTracking(dataTemp).then(response => {
                const { data } = response;
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
export function LogTrackingActualizacion (ordenVenta, status, indicador) {
    try {
            const dataTemp = {
                
                status: status,
                indicador: indicador
            }

            // Inicia actualización de saldos de los socios
            actualizaTracking(ordenVenta, dataTemp).then(response => {
                const { data } = response;
                // console.log("Actualización de saldo personal")
            }).catch(e => {
                // console.log(e)
            })
            // Termina actualización de saldos de los socios

    } catch (e) {
        // console.log(e)
    }
}


// Para la modificación del status de cada pedido de venta
export function LogTrackingStatus(status, indicador, pedidoVenta){
    try {
        // Inicia la obtencion del numero actual de tracking
        obtenerNumeroTracking().then(response => {
            const { data: { noTracking } } = response;

            // Inicia la recuperación del id del tracking, según el pedido de venta indicado
            obtenerDatosTracking(pedidoVenta).then(response => {
                const { data: { _id, folio, ordenVenta, cliente, fechaElaboracion, fechaEntrega, status, indicador } } = response;

                // Inicia formación del data para la modificación del estado del tracking
                const dataTemp = {
                    status: status,
                    indicador: indicador
                }
                // Termina formación del data para la modificación del estado del tracking

                // Inicia la modificación del tracking
                actualizaTracking(_id, dataTemp).then(response => {
                    const { data } = response;
                })
                // Termina la modificación del tracking

            }).catch(e => {
                console.log(e)
            })
            // Termina la recuperación del id del tracking, según el pedido de venta indicado

        }).catch(e => {
            console.log(e)
        })
        // Termina la obtención del número de tracking actual
    } catch (e) {
        console.log(e)
    }
}
