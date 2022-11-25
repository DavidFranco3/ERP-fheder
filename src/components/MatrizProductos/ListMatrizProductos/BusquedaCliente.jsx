import { useState, useEffect } from 'react';
import { obtenerCliente } from "../../../api/clientes";

function BusquedaCliente(props) {
    const { idCliente } = props;

    // Para almacenar el nombre del cliente
    const [nombreCliente, setNombreCliente] = useState("");

    // Para traer el nombre del cliente
    useEffect(() => {
        try {
            obtenerCliente(idCliente).then(response => {
                const { data } = response;
                //console.log(data)
                setNombreCliente(data.nombre)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            // console.log(e)
        }
    }, []);


    return (
        <>
            {nombreCliente}
        </>
    );
}

export default BusquedaCliente;
