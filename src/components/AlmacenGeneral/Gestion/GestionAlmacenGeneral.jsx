import { obtenerFolioActualAlmacenGeneral, registraGestionAlmacenGeneral, listarAlmacenGeneral, obtenerDatosAlmacenGeneral, obtenerDatosxFolioAlmacenGeneral, registraMovimientosAlmacenGeneral, obtenerDatosxFolioInsumo } from "../../../api/almacenGeneral";
import { obtenerInsumoPrimaPorFolio } from "../../../api/insumos";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroAlmacenGeneral(folioInsumo, nombreInsumo, um, cantidadExistencia) {
    try {
        obtenerFolioActualAlmacenGeneral().then(response => {
            const { data } = response;
            const { folio } = data;

            obtenerInsumoPrimaPorFolio(folioInsumo).then(response => {
                const { data } = response;
                const { _id } = data;

                // Generacion de dataTemp para registro de planeacion
                const dataTemp = {
                    folioAlmacen: folio,
                    idInsumo: _id,
                    folioInsumo: folioInsumo,
                    nombre: nombreInsumo,
                    descripcion: "No disponible",
                    um: um,
                    existenciasOV: cantidadExistencia,
                    existenciasStock: cantidadExistencia,
                    existenciasTotales: cantidadExistencia,
                    estado: "activo"
                }
                // console.log(dataTemp)

                registraGestionAlmacenGeneral(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    const { folio, _id } = datos
                    //console.log("se ha registrado la materia prima en el almacen")
                    LogsInformativos(`Se ha registrado el insumo en el almacen general ${folio}`, datos);

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
export function LogRegistroMovimientoAlmacenGeneral(fecha, folioInsumo, nombreInsumo, um, cantidad) {
    try {
        obtenerDatosxFolioInsumo(folioInsumo).then(response => {
            const { data } = response;
            const { _id, folioAlmacen, existenciasTotales, existenciasOV, existenciasStock } = data;

            obtenerDatosAlmacenGeneral(folioAlmacen).then(response => {
                const { data } = response;

                const nuevoExistenciaStock = parseInt(existenciasStock) + parseInt(cantidad)
                const nuevaExistenciaOV = parseInt(existenciasOV) + parseInt(cantidad)
                const nuevaExistenciaTotal = parseInt(existenciasTotales) + parseInt(cantidad)

                const dataMovimiento = {
                    fecha: fecha,
                    materiaPrima: nombreInsumo,
                    um: um,
                    tipo: "Entrada",
                    referencia: "No disponible",
                    descripcion: "No disponible",
                    cantidad: cantidad,
                    existenciasOV: nuevaExistenciaOV.toString(),
                    existenciasStock: nuevoExistenciaStock.toString(),
                    existenciasTotales: nuevaExistenciaTotal.toString()
                }

                const finalEntrada = data.concat(dataMovimiento)

                const dataTempFinal = {
                    movimientos: finalEntrada,
                    existenciasOV: nuevaExistenciaOV.toString(),
                    existenciasStock: nuevoExistenciaStock.toString(),
                    existenciasTotales: nuevaExistenciaTotal.toString()
                }

                registraMovimientosAlmacenGeneral(_id, dataTempFinal).then(response => {
                    const { data } = response;

                    //LogTrackingActualizacion(ordenVenta, "En almacen de materia prima", "5")
                    //console.log(response)
                    const { mensaje, datos } = data;
                    LogsInformativos(`Se han actualizado el movimiento del almacen general ${data.folioAlmacen}`, datos)
                })
            }).catch(e => {
                console.log(e)
            })
        })
    } catch (e) {
        console.log(e)
    }
}
