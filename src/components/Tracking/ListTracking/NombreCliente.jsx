import React, { useState, useEffect } from 'react';
import {obtenerDatosPedidoVenta} from "../../../api/pedidoVenta";
import {obtenerCliente} from "../../../api/clientes";

function NombreCliente(props) {
    const { folio } = props;

    // Almacena el nombre del cliente
    const [nombreCliente, setNombreCliente] = useState("");

    useEffect(() => {
        try {
            obtenerCliente(folio).then(response => {
                const { data } = response;
                // console.log(data)
                const { nombre, apellidos } = data;
                setNombreCliente(nombre + " " + apellidos)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    return (
        <>
            {nombreCliente}
        </>
    );
}

export default NombreCliente;
