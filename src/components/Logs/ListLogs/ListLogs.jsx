import { useState, useEffect } from 'react';
import moment from "moment";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import DataTable from 'react-data-table-component';
import "./ListLogs.scss";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';


function ListLogs(props) {
    const { listLogs, history, location, setRefreshCheckLogin } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

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
            selector: row => dayjs(row.fechaCreacion).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listLogs);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
       cargarDatos();
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
                    noDataComponent="No hay registros para mostrar"
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
