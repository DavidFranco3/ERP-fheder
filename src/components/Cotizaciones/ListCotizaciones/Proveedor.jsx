import { useState, useEffect } from 'react';
import {obtenerProveedores} from "../../../api/proveedores";
import {toast} from "react-toastify";

function Proveedor(props) {
    const { id } = props;

    // Para almacenar el nombre del cliente
    const [nombreProveedor, setNombreProveedor] = useState("");

    useEffect(() => {
        //
        try {
            obtenerProveedores(id).then(response => {
                const { data } = response;
                // console.log(data)
                const { nombre } = data;
                setNombreProveedor(nombre)
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
    }, [id]);

    return (
        <>
            {nombreProveedor}
        </>
    );
}

export default Proveedor;
