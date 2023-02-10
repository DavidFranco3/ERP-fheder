import { obtenerFolioActualAlmacenes, registroInicialAlmacenes, obtenerItemAlmacen } from "../../../api/almacenes";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { getSucursal } from "../../../api/auth";
import { obtenerMateriaPrimaPorFolio } from "../../../api/materiaPrima";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroAlmacenes(folio, nombre, almacen, um, cantidadExistencia, movimiento) {
    try {
        obtenerFolioActualAlmacenes().then(response => {
            const { data } = response;
            const { noAlmacen } = data;

            const temp = noAlmacen.split("-");

            obtenerMateriaPrimaPorFolio(folio).then(response => {
                const { data } = response;
                const { _id } = data;
                // Generacion de dataTemp para registro de planeacion
                const dataTemp = {
                    item: temp[1],
                    folio: noAlmacen,
                    idArticulo: _id,
                    folioArticulo: folio,
                    nombreArticulo: nombre,
                    tipo: movimiento,
                    tipoArticulo: "Materiales",
                    sucursal: getSucursal(),
                    almacen: almacen,
                    fecha: new Date(),
                    descripcion: "No disponible",
                    um: um,
                    cantidadExistencia: cantidadExistencia,
                    estado: "true"
                }
                // console.log(dataTemp)

                registroInicialAlmacenes(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    const { folioAlmacen, _id } = datos
                    //console.log("se ha registrado la materia prima en el almacen")
                    LogsInformativos("Se ha registrado el material en el almacen " + almacen + " " + folioAlmacen, dataTemp)

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
