import React from 'react';

function CantidadUltimoMovimientoAg(props) {
    const { movimientos } = props;

    return (
        <>
            {
                movimientos ?
                    (
                        <>
                            {movimientos[0].cantidad}
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

export default CantidadUltimoMovimientoAg;
