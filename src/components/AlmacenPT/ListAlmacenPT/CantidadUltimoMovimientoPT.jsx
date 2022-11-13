import { useState, useEffect } from 'react';
import {listarMovimientosAlmacenPT} from "../../../api/almacenPT";

function CantidadUltimoMovimientoPt(props) {
    const { folioMP } = props;

    // Almacena la cantidad del ultimo movimiento
    const [cantidadUltimoMovimiento, setCantidadUltimoMovimiento] = useState("");

    useEffect(() => {
        try {
            listarMovimientosAlmacenPT(folioMP).then(response => {
                const { data } = response;
                // console.log(data)
                setCantidadUltimoMovimiento(data[0].cantidad)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <>
            {
                cantidadUltimoMovimiento ?
                    (
                        <>
                            {cantidadUltimoMovimiento}
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

export default CantidadUltimoMovimientoPt;
