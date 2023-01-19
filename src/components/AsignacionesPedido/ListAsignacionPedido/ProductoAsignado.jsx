import { useState, useEffect } from 'react';
import { obtenerAlmacenesID } from "../../../api/almacenes";
import { toast } from "react-toastify";

function ProductoAsignado(props) {
    const { id } = props;

    // Para almacenar el nombre del cliente
    const [nombreProducto, setNombreProducto] = useState("");

    useEffect(() => {
        //
        try {
            obtenerAlmacenesID(id).then(response => {
                const { data } = response;
                // console.log(data)
                const { nombreProducto } = data;
                setNombreProducto(nombreProducto)
            }).catch(e => {
                //console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, [id]);

    return (
        <>
            {nombreProducto}
        </>
    );
}

export default ProductoAsignado;
