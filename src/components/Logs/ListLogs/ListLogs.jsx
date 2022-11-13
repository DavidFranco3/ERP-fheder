import { useState, useEffect } from 'react';
import moment from "moment";
import {Badge, Button, Container} from "react-bootstrap";
import { useHistory } from "react-router-dom";
// Inician importaciones para la tabla
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import DataTable  from 'react-data-table-component';
import "./ListLogs.scss";

function ListLogs(props) {
    const { listLogs, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalLogs } = props;

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);
    
    // Campos de las columnas
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = useState(false);

        return (
            <>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                </TableRow>
            </>
        );
    }
    //

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
                    reorder: false
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

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
        
    // Definiendo estilos para data table
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
                    data={listLogs}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalLogs}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>
        </>
    );
}

export default ListLogs;
