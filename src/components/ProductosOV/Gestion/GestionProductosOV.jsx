import { registraProductosOV } from "../../../api/productosOV";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroProductosOV(ordenVenta, numeroParte, descripcion, cantidad, um, precioUnitario, total, setListProductosCargados) {
    try {
        // Generacion de dataTemp para registro de planeacion

        setListProductosCargados(null);

        const dataTemp = {
            ordenVenta: ordenVenta,
            numeroParte: numeroParte,
            descripcion: descripcion,
            cantidad: cantidad,
            um: um,
            precioUnitario: precioUnitario,
            total: total
        }
        // console.log(dataTemp)

        registraProductosOV(dataTemp).then(response => {
            setListProductosCargados([]);
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}
