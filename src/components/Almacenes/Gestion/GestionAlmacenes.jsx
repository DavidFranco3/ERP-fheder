import { obtenerFolioActualAlmacenes, registroInicialAlmacenes, obtenerItemAlmacen } from "../../../api/almacenes";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { getSucursal } from "../../../api/auth";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroAlmacenes(folio, nombre, almacen, um, cantidadExistencia) {
    try {
        obtenerFolioActualAlmacenes().then(response => {
            const { data } = response;
            const { noAlmacen } = data;

            obtenerItemAlmacen().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;

                // Generacion de dataTemp para registro de planeacion
                const dataTemp = {
                    item: item,
                    folio: noAlmacen,
                    idArticulo: "",
                    folioArticulo: folio,
                    nombreArticulo: nombre,
                    tipo: "Entrada",
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
                    LogsInformativos("Se ha registrado el material en el almacen "  + almacen + " " + folioAlmacen, dataTemp)

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
