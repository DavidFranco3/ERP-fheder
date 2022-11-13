import { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {TablePagination} from "@mui/material";
import BasicModal from "../../Modal/BasicModal";
import FechaUltimoMovimientoPT from "../../AlmacenPT/ListAlmacenPT/FechaUltimoMovimientoPT";
import TipoUltimoMovimientoPT from "../../AlmacenPT/ListAlmacenPT/TipoUltimoMovimientoPT";
import {Badge, Container} from "react-bootstrap";
import ModificarAlmacenPT from "../../AlmacenPT/ModificarAlmacenPT/ModificarAlmacenPT";
import EliminaAlmacenPT from "../../AlmacenPT/EliminaAlmacenPT/EliminaAlmacenPT";
import ModificarAlmacenGeneral from "../ModificarAlmacenGeneral";
import EliminaAlmacenGeneral from "../EliminaAlmacenGeneral";
import {map} from "lodash";
import FechaUltimoMovimientoAG from "./FechaUltimoMovimientoAG";
import TipoUltimoMovimientoAG from "./TipoUltimoMovimientoAG";
import CantidadUltimoMovimientoAG from "./CantidadUltimoMovimientoAG";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';

function ListAlmacenGeneral(props) {
    const { listAlmacenGeneral, location, history, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalAlmacenGeneral } = props;

    // console.log(listAlmacenGeneral)

    // Para controlar la paginacion
    const handleChangePage = (event, newPage) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // define el uso del enrutamiento
    const enrutamiento = useHistory()

    // Para el modal de eliminación de materias primas
    const eliminacionAlmacenGeneral = (content) => {
        setTitulosModal("Eliminando");
        setContentModal(content);
        setShowModal(true);
    }

    // Para editar los detalles de la materia prima que esta en almacen
    const modificarAlmacenGeneral = (content) => {
        setTitulosModal("Modificando");
        setContentModal(content);
        setShowModal(true);
    }

    // Para ir hacia la ruta de ver los movimientos de la materia prima
    const irRutaverMovimientos = (folioAG) => {
        enrutamiento.push(`/AlmacenGeneral/Movimientos/${folioAG}`)
    }
    
    const columns = [
        {
                    name: "Folio",
                    selector: row => row.folioAlmacen,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Nombre",
                    selector: row => row.nombre,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Descripcion",
                    selector: row => row.descripcion,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "UM",
                    selector: row => row.um,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Última modificación",
                    selector: row => (
                        <>
                        {
                            row.movimientos.length !== 0 ?
                                (
                                    <>
                                        {/* Fecha de ultimo registro */}
                                        <FechaUltimoMovimientoAG
                                            movimientos={row.movimientos}
                                        />
                                    </>
                                )
                                :
                                (
                                    <>
                                        No hay movimientos
                                    </>
                                )
                        }
                        </>
                    ),
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Tipo",
                    selector: row => (
                            <>
                                 {
                            row.movimientos.length !== 0 ?
                                (
                                    <>
                                        {/* Tipo del ultimo movimiento */}
                                        <TipoUltimoMovimientoAG
                                            movimientos={row.movimientos}
                                        />
                                    </>
                                )
                                :
                                (
                                    <>
                                        No hay movimientos
                                    </>
                                )
                        }
                            </>
                        ),
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Cantidad",
                    selector: row => (
                            <>
                                {
                            row.movimientos.length !== 0 ?
                                (
                                    <>
                                        {/* Cantidad del ultimo movimiento */}
                                        <CantidadUltimoMovimientoAG
                                            movimientos={row.movimientos}
                                        />
                                    </>
                                )
                                :
                                (
                                    <>
                                        No hay movimientos
                                    </>
                                )
                        }
                            </>
                        ),
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Existencias Totales",
                    selector: row => row.existenciasTotales,
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
                           {
                            row.movimientos.length !== 0 &&
                            (
                                <>
                                    <Badge
                                        bg="info"
                                        className="evaluacionProveedor"
                                        onClick={() => {
                                            irRutaverMovimientos(row.folioAlmacen)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                                    </Badge>
                                </>
                            )
                        }
                        <Badge
                            bg="success"
                            className="editarProveedor"
                            onClick={() => {
                                modificarAlmacenGeneral(
                                    <ModificarAlmacenGeneral
                                        datos={row}
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                        </Badge>
                        <Badge
                            bg="danger"
                            className="eliminarProveedor"
                            onClick={() => {
                                eliminacionAlmacenGeneral(
                                    <EliminaAlmacenGeneral
                                        datos={row}
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
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
    
    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listAlmacenGeneral);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={listAlmacenGeneral}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalAlmacenGeneral}
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

export default ListAlmacenGeneral;
