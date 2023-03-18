import { useState, useEffect } from 'react';
import {obtenerCliente} from "../../../api/clientes";
import {toast} from "react-toastify";

function ClientesPedido(props) {
    const { id } = props;

    // Para almacenar el nombre del cliente
    const [nombreCliente, setNombreCliente] = useState("");

    const cargarNombreCliente = () => {
        //
        try {
            obtenerCliente(id).then(response => {
                const { data } = response;
                // console.log(data)
                const { nombre } = data;
                setNombreCliente(nombre)
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarNombreCliente();
    }, [id]);

    return (
        <>
            {nombreCliente}
        </>
    );
}

export default ClientesPedido;
