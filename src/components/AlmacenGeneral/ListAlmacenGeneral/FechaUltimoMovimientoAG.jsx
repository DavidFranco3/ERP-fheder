import React from 'react';
import moment from "moment";
import "moment/locale/es-mx"

function FechaUltimoMovimientoAg(props) {
    const { movimientos } = props;

    moment.locale("es")

    // console.log(movimientos)

    return (
        <>
            {
                movimientos ?
                    (
                        <>
                            {moment(movimientos[0].fecha).format('LL')}
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

export default FechaUltimoMovimientoAg;
