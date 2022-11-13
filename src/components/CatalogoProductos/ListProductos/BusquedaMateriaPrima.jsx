import { useState, useEffect } from 'react';
import {obtenerFolioActualMP, obtenerMateriaPrima, obtenerMateriaPrimaPorFolio} from "../../../api/materiaPrima";

function BusquedaMateriaPrima(props) {
    const { idmateriaPrima } = props;

    // para almacenar la descripcion de la materia prima
    const [descripcionMateriaPrima, setDescripcionMateriaPrima] = useState("");

    // Para buscar la materia prima
    useEffect(() => {
        try {
            obtenerMateriaPrimaPorFolio(idmateriaPrima).then(response => {
                const { data } = response;
                // console.log(data)
                setDescripcionMateriaPrima(data.descripcion)
            }).catch(e => {
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
        }
    }, []);


    return (
        <>
            {
                descripcionMateriaPrima ?
                    (
                        <>
                            {descripcionMateriaPrima}
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

export default BusquedaMateriaPrima;
