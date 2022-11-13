import { useState, useEffect } from 'react';
import {obtenerProductoCatalogo} from "../../../../api/catalogoProductos";
import {obtenerMateriaPrimaPorFolio} from "../../../../api/materiaPrima";

function MaterialUsado(props) {
    const { folio } = props;

    // Para almacenar el nombre del material usado
    const [materialUsado, setMaterialUsado] = useState("");

    useEffect(() => {
        try {
            obtenerProductoCatalogo(folio).then(response => {
                const { data } = response;
                // console.log(data)
                const { materiaPrima } = data;

                obtenerMateriaPrimaPorFolio(materiaPrima).then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { folio, descripcion } = data;
                    setMaterialUsado(folio + " -- " + descripcion)
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    return (
        <>
            {
                materialUsado ?
                    (
                        <>
                            {materialUsado}
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

export default MaterialUsado;
