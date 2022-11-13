import React from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";

function ModificacionTiquets(props) {
    const { setRefreshCheckLogin } = props;

    return (
        <>
            <LayoutPrincipal className="ModificacionTiquets" paginaSeleccionada="Tiquets" setRefreshCheckLogin={setRefreshCheckLogin}>
                Formulario
            </LayoutPrincipal>
        </>
    );
}

export default ModificacionTiquets;
