import React from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";

function ListLogistica(props) {
    const { setRefreshCheckLogin } = props;

    return (
        <>
            <LayoutPrincipal className="ListLogistica" paginaSeleccionada="Logistica" setRefreshCheckLogin={setRefreshCheckLogin}>
                ListLogistica
            </LayoutPrincipal>
        </>
    );
}

export default ListLogistica;
