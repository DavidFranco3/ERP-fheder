import { useState, useEffect } from 'react';
import moment from "moment";
import {Badge, Button, Container} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./ListPlaneacion.scss"
// Inician importaciones para la tabla
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaPlaneacion from "../EliminacionFisica";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import DataTable  from 'react-data-table-component';
// Terminan importaciones para la tabla

function ListPlaneacion(props) {
    const { listPlaneaciones, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalPlaneaciones } = props;

    // console.log(listPlaneaciones)

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    //Para eliminar la planeación
    const eliminacionPlaneacion = (content) => {
        setTitulosModal("Eliminando planeación");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de planeaciones
    const modificacionPlaneacion = (folio) => {
        enrutamiento.push(`/ModificacionPlaneacion/${folio}`)
    }
    
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
                    name: "Folio",
                    selector: row => row.folio,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Orden de venta",
                    selector: row => (
                            <>
                            {row.ordenVenta ?
                            (
                                row.ordenVenta
                            )
                            :
                            (
                                "No disponible"
                            )
                        }
                        </>),
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Fecha de solicitud",
                    selector: row => moment(row.fechaCreacion).format('LL'),
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: 'Acciones',
                    center: true,
                    reorder: false,
                    selector: row => (
                        <>
                            <Badge
                            bg="info"
                            className="evaluacionProveedor"
                        >
                            <FontAwesomeIcon icon={faEye} className="text-lg" />
                        </Badge>
                        <Badge
                            bg="success"
                            className="editarProveedor"
                            onClick={() => {
                                modificacionPlaneacion(row.folio)
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                        </Badge>
                        <Badge
                            bg="danger"
                            className="eliminarProveedor"
                            onClick={() => {
                                eliminacionPlaneacion(
                                    <EliminacionFisicaPlaneacion
                                        datos={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                        </Badge>
                        </>
                    )
                }
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
            setRows(listPlaneaciones);
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
                    data={listPlaneaciones}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalPlaneaciones}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListPlaneacion;
