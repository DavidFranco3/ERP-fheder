import { useState, useEffect } from 'react';
import {listarMovimientosAlmacenMP} from "../../../api/almacenMP";

function TipoUltimoMovimiento(props) {
    const { folioMP } = props;

    // Almacena el tipo del ultimo movimiento
    const [tipoUltimoMovimiento, setTipoUltimoMovimiento] = useState("");

    useEffect(() => {
        try {
            listarMovimientosAlmacenMP(folioMP).then(response => {
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

export default TipoUltimoMovimiento;
