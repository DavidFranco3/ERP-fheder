import { useState, useEffect } from 'react';
import moment from "moment";
import {listarMovimientosAlmacenPT} from "../../../api/almacenPT";

function FechaUltimoMovimientoPt(props) {
    const { folioMP } = props;

    // Almacena la fecha del ultimo movimiento
    const [fechaUltimoMovimiento, setFechaUltimoMovimiento] = useState("");

    useEffect(() => {
        try {
            listarMovimientosAlmacenPT(folioMP).then(response => {
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

export default FechaUltimoMovimientoPt;
