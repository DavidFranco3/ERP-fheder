import { obtenerFolioActualAlmacenGeneral, registraAlmacenGeneral } from "../../../api/almacenGeneral";
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
                    existenciasOV: "0",
                    existenciasStock: "0",
                    existenciasTotales: cantidadExistencia,
                    estado: "activo"
                }
                // console.log(dataTemp)

                registraAlmacenGeneral(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    const { folio, _id } = datos
                    //console.log("se ha registrado la materia prima en el almacen")
                    LogsInformativos(`Se ha registrado el insumo en el almacen general ${folio}`, datos)

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
