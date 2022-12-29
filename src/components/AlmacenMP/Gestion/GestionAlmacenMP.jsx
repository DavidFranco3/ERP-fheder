import { obtenerFolioActualAlmacenMP, registroGestionAlmacenMP, obtenerItem, obtenerDatosMP, listarAlmacenMP, listarMovimientosAlmacenMP, obtenerDatosAlmacenMPFolio, registraMovimientosAlmacenMP } from "../../../api/almacenMP";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { getSucursal } from "../../../api/auth";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroAlmacenMP(folioMP, nombreMP, um, cantidadExistencia) {
    try {
        obtenerFolioActualAlmacenMP().then(response => {
            const { data } = response;
            const { noAlmacen } = data;

            obtenerItem().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;

                // Generacion de dataTemp para registro de planeacion
                const dataTemp = {
                    item: item,
                    folioAlmacen: noAlmacen,
                    folioMP: folioMP,
                    nombreMP: nombreMP,
                    sucursal: getSucursal(),
                    um: um,
                    fecha: "",
                    cantidadExistencia: cantidadExistencia,
                    estado: "true"
                }
                // console.log(dataTemp)

                registroGestionAlmacenMP(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    const { folioAlmacen, _id } = datos
                    //console.log("se ha registrado la materia prima en el almacen")
                    LogsInformativos("Se ha registrado la materia en el almacen de MP " + folioAlmacen, dataTemp)

                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroMovimientoAlmacenMP(fecha, folioMP, nombreMP, um, cantidad) {
    try {
        obtenerDatosMP(folioMP).then(response => {
            const { data } = response;
            const { _id, folioAlmacen, cantidadExistencia } = data;

            listarMovimientosAlmacenMP(folioAlmacen).then(response => {
                const { data } = response;

                const nuevaExistenciaTotal = parseInt(cantidadExistencia) + parseInt(cantidad)

                const dataMovimiento = {
                    fecha: fecha,
                    materiaPrima: nombreMP,
                    um: um,
                    tipo: "Entrada",
                    referencia: "No disponible",
                    ordenVenta: "No disponible",
                    lote: "No disponible",
                    descripcion: "No disponible",
                    cantidadExistencia: cantidad,
                }

                const finalEntrada = data.concat(dataMovimiento)

                const dataTempFinal = {
                    fecha: fecha,
                    movimientos: finalEntrada,
                    cantidadExistencia: nuevaExistenciaTotal.toString()
                }

                registraMovimientosAlmacenMP(_id, dataTempFinal).then(response => {
                    const { data } = response;

                    //LogTrackingActualizacion(ordenVenta, "En almacen de materia prima", "5")
                    //console.log(response)
                    const { mensaje, datos } = data;
                    LogsInformativos(`Se han actualizado el movimiento de la materia prima ${data.folioAlmacen}`, datos)
                })
            }).catch(e => {
                console.log(e)
            })
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}
