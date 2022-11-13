import {actualizaPlaneacion, obtenerFolioActualPlaneacion, registraPlaneacion} from "../../../api/planeacion";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import {map} from "lodash";
import {obtenerProductoPorNoInternoCatalogo} from "../../../api/catalogoProductos";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroPlaneacion(ordenVenta, productos) {
    try {
        obtenerFolioActualPlaneacion().then(response => {
            const { data } = response;
            const { noPlaneacion } = data;

            //let tempDataDetalles = []

            /*map(productos, (producto, index) => {
                //console.log(producto)
                //console.log(index)
                const { idProducto, ID, item, cantidad, descripcion, observaciones, ordenCompra, um } = producto;
                obtenerProductoPorNoInternoCatalogo(ID).then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { datosPieza:{ pesoPiezas }, materiaPrima } = data;
                    tempDataDetalles.push({ numeroInterno: ID, item: item, descripcion:descripcion, material: materiaPrima, cantidadxUnidad: pesoPiezas, cantidadPedido: cantidad, cantidadTotalUsar: pesoPiezas * cantidad, existenciaStock: "0", diferencia: "0", cantidadProduce: 0, autorizado: "false" })
                })
            })*/

            // Generacion de dataTemp para registro de planeacion
            const dataTemp = {
                folio: noPlaneacion,
                ordenVenta: ordenVenta,
                productos: productos
            }
            // console.log(dataTemp)

            registraPlaneacion(dataTemp).then(response => {
                const { data } = response;
                const { mensaje, datos } = data;
                const { ordenVenta, _id } = datos
                LogsInformativos(`Se ha registrado la información inicial de la planeación para la orden de venta ${ordenVenta}`, datos)

                /*const dataTempActualiza = {
                    detalles: tempDataDetalles
                }
                console.log("final datos")
                console.log(dataTempActualiza)

                actualizaPlaneacion(_id, dataTempActualiza).then(response => {
                    const { data } = response;
                    // console.log(data)
                }).catch(e => {
                    console.log(e)
                })*/

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
