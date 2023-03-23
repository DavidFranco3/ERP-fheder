import { obtenerDatosPedidoVenta, actualizaPedidoVenta } from "../../../api/pedidoVenta";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

// Realiza la modificación de saldos al realizar un movimiento
export function LogPedidoActualizacion(idProducto, numeroInterno, producto, cantidad, um, ordenVenta) {
    console.log(idProducto)
    console.log(numeroInterno)
    console.log(producto)
    console.log(cantidad)
    console.log(um)
    console.log(ordenVenta)
    try {
        obtenerDatosPedidoVenta(ordenVenta).then(response => {
            const { data: { _id, productos } } = response;
            console.log(_id)
            console.log(productos)

            const dataProductos = [{
                idProducto: idProducto,
                ID: numeroInterno,
                item: producto,
                material: numeroInterno,
                cantidad: parseFloat(cantidad) * -1,
                um: um,
                precioUnitario: "0",
                total: "0"
            }]

            const productosNuevos = dataProductos.concat(productos);

            const dataTemp = {
                productos: productosNuevos
            }

            // Inicia actualización de saldos de los socios
            actualizaPedidoVenta(_id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a actualizado el proceso del tranking de la OV " + ordenVenta, dataTemp)
                // console.log("Actualización de saldo personal")
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

