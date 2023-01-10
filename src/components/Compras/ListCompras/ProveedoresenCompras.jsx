import React, { useState, useEffect } from 'react';
import {obtenerEvaluacionProveedores} from "../../../api/evaluacionProveedores";

function ProveedoresenCompras(props) {
    const { id } = props;

    // Almacenar el nombre del proveedor
    const [nombreProveedor, setNombreProveedor] = useState("");

    useEffect(() => {
        try {
            obtenerEvaluacionProveedores(id).then(response => {
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
