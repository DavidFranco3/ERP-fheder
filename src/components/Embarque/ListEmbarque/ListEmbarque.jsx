import React from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";

function ListEmbarque(props) {
    const { setRefreshCheckLogin } = props;

    return (
        <>
            <LayoutPrincipal className="ListEmbarque" paginaSeleccionada="Embarque" setRefreshCheckLogin={setRefreshCheckLogin}>
                ListEmbarque
            </LayoutPrincipal>
        </>
    );
}

export default ListEmbarque;

