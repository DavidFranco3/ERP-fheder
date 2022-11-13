import React from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";

function ListTiquets(props) {
    const { setRefreshCheckLogin } = props;

    return (
        <>
            <LayoutPrincipal className="ListTiquets" paginaSeleccionada="Tiquets" setRefreshCheckLogin={setRefreshCheckLogin}>
                ListTiquets
            </LayoutPrincipal>
        </>
    );
}

export default ListTiquets;
