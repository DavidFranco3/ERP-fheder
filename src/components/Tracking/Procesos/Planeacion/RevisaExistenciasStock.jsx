import { useState, useEffect } from 'react';
import {obtenerProductoCatalogo} from "../../../../api/catalogoProductos";
import {obtenerDatosAlmacenMPFolio} from "../../../../api/almacenMP";

function RevisaExistenciasStock(props) {
    const { folio } = props;

    // Almacena las existencias totales de stock de la materia prima solicitada
    const [totalStockMP, setTotalStockMP] = useState("0");

    // Valida si hay existencias
    const [hayExistencias, setHayExistencias] = useState(false);

    useEffect(() => {
        try {
            obtenerProductoCatalogo(folio).then(response => {
                const { data } = response;
                // console.log(data)
                const { materiaPrima } = data;
                obtenerDatosAlmacenMPFolio(materiaPrima).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(data) {
                        setHayExistencias(true)
                        const { existenciasStock } = data;
                        setTotalStockMP(existenciasStock)
                    } else {
                        setTotalStockMP("0")
                        setHayExistencias(false)
                    }
                }).catch(e => {
                    console.log(e)
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
                hayExistencias ?
                    (
                        <>
                            {totalStockMP}
                        </>
                    )
                    :
                    (
                        <>
                            0
                        </>
                    )
            }
        </>
    );
}

export default RevisaExistenciasStock;
