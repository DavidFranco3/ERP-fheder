import React, { useState, useEffect } from 'react';
import {obtenerProveedores} from "../../../api/proveedores";

function ProveedoresenCompras(props) {
    const { id } = props;

    // Almacenar el nombre del proveedor
    const [nombreProveedor, setNombreProveedor] = useState("");

    useEffect(() => {
        try {
            obtenerProveedores(id).then(response => {
                const { data } = response;
                const { nombre } = data;
                setNombreProveedor(nombre)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    return (
        <>
            {
                nombreProveedor ?
                    (
                        <>
                            {nombreProveedor}
                        </>
                    )
                    :
                    (
                        <>
                            ----
                        </>
                    )
            }
        </>
    );
}

export default ProveedoresenCompras;
