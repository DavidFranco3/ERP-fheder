import { useState, useEffect } from 'react';
import moment from "moment";
import {listarMovimientosAlmacenMP} from "../../../api/almacenMP";

function FechaUltimaModificacion(props) {
    const { folioMP } = props;

    // Almacena la fecha del ultimo movimiento
    const [fechaUltimoMovimiento, setFechaUltimoMovimiento] = useState("");

    useEffect(() => {
        try {
            listarMovimientosAlmacenMP(folioMP).then(response => {
                const { data } = response;
                // console.log(data)
                setFechaUltimoMovimiento(data[0].fecha)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    return (
        <>
            {
                fechaUltimoMovimiento ?
                    (
                        <>
                            {moment(fechaUltimoMovimiento).format('LL')}
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

export default FechaUltimaModificacion;
