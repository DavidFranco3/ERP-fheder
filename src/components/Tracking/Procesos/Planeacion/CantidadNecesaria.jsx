import { useState, useEffect } from 'react';
import {obtenerProductoCatalogo} from "../../../../api/catalogoProductos";
import {obtenerMateriaPrimaPorFolio} from "../../../../api/materiaPrima";

function CantidadNecesaria(props) {
    const { folio, cantidadPedida } = props;

    // Para almacenar la cantidad total a usar
    const [cantidadTotalUsar, setCantidadTotalUsar] = useState(0);

    useEffect(() => {
        try {
            obtenerProductoCatalogo(folio).then(response => {
                const { data } = response;
                // console.log(data)
                const { descripcion, datosPieza:{ pesoPiezas }, materiaPrima } = data;
                const totalTemp = parseFloat(pesoPiezas) * parseInt(cantidadPedida)
                setCantidadTotalUsar(totalTemp.toString())
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
                cantidadTotalUsar !== 0 ?
                    (
                        <>
                            {cantidadTotalUsar}
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

export default CantidadNecesaria;
