import React from 'react';

function TipoUltimoMovimientoAg(props) {
    const { movimientos } = props;

    return (
        <>
            {
                movimientos ?
                    (
                        <>
                            {movimientos[0].tipo}
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

export default TipoUltimoMovimientoAg;
