import { useState, useEffect } from 'react';
// Inician importaciones para la tabla
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
// Terminan importaciones para la tabla
import moment from "moment";
import {Alert, Badge, Button, Col, Container, Row} from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import "./ListMovimientosAlmacenes.scss"

function ListMovimientosAlmacenes(props) {
    const { listMovimientosAlmacenes } = props;

    moment.locale("es");
    //console.log(listClientes);

    const columns = [
        {
            name: 'Artículo',
            selector: row => row.articulo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: ' UM',
            selector: row => row.um,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Fecha',
            selector: row => moment(row.fecha).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Tipo',
            selector: row => row.tipo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Cantidad',
            selector: row => row.cantidadExistencia,
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listMovimientosAlmacenes);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
    };
    
       const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
        <Container fluid>
            <DataTable
                
                columns={columns}
                noDataComponent="No hay registros para mostrar"
                data={listMovimientosAlmacenes}
                progressPending={pending}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                paginationResetDefaultPage={resetPaginationToogle}
                customStyles={estilos}
                sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
            />
        </Container>
        </>
    );
}

export default ListMovimientosAlmacenes;
