import { useState, useEffect } from 'react';
import {listarMovimientosAlmacenPT} from "../../../api/almacenPT";

function TipoUltimoMovimientoPT(props) {
    const { folioMP } = props;

    // Almacena el tipo del ultimo movimiento
    const [tipoUltimoMovimiento, setTipoUltimoMovimiento] = useState("");

    useEffect(() => {
        try {
            listarMovimientosAlmacenPT(folioMP).then(response => {
                const { data } = response;
                // console.log(data)
                setTipoUltimoMovimiento(data[0].tipo)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <>
            {
                tipoUltimoMovimiento ?
                    (
                        <>
                            {tipoUltimoMovimiento}
                        </>
                    )
                    :
                    (
                        <>
                            ---
                        </>
                    )
            }
        </>
    );
}

export default TipoUltimoMovimientoPT;
