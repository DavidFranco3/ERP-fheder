import { useState, useEffect } from 'react';
import moment from "moment";
import { Badge, Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
// Inician importaciones para la tabla
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import DataTable from 'react-data-table-component';
import "./ListLogs.scss";

function ListLogs(props) {
    const { listLogs, history, location, setRefreshCheckLogin } = props;

    moment.locale("es");

    const columns = [
        {
            name: "Usuario",
            selector: row => row.usuario,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Correo",
            selector: row => row.correo,
            sortable: false,
            center: true,
            reorder: false

        },
        {
            name: "Dispositivo",
            selector: row => row.dispositivo,
            sortable: false,
            center: true,
            reorder: false,
        },
        {
            name: "IP",
            selector: row => row.ip,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acción realizada",
            selector: row => row.mensaje,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha",
            selector: row => row.fechaCreacion,
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
            setRows(listLogs);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listLogs}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
            </Container>
        </>
    );
}

export default ListLogs;
