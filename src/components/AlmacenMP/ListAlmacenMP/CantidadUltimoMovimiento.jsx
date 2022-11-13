import { useState, useEffect } from 'react';
import {listarMovimientosAlmacenMP} from "../../../api/almacenMP";

function CantidadUltimoMovimiento(props) {
    const { folioMP } = props;

    // Almacena la cantidad del ultimo movimiento
    const [cantidadUltimoMovimiento, setCantidadUltimoMovimiento] = useState("");

    useEffect(() => {
        try {
            listarMovimientosAlmacenMP(folioMP).then(response => {
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

export default CantidadUltimoMovimiento;
