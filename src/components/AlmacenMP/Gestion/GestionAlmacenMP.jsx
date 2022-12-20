import { obtenerFolioActualAlmacenMP, registroInicialAlmacenMP, obtenerItem } from "../../../api/almacenMP";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

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
                    um: um,
                    fecha: "",
                    cantidadExistencia: cantidadExistencia,
                    estado: "true"
                }
                // console.log(dataTemp)

                registroInicialAlmacenMP(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    const { folioAlmacen, _id } = datos
                    //console.log("se ha registrado la materia prima en el almacen")
                    LogsInformativos(`Se ha registrado la materia en el almacen de MP ${folioAlmacen}`, datos)

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
