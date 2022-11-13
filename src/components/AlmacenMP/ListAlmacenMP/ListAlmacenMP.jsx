import { useState, useEffect } from 'react';
import BasicModal from "../../Modal/BasicModal";
// Terminan importaciones para la tabla
import { useHistory } from "react-router-dom";
import "./ListAlmacenMP.scss"
import moment from "moment";
import {Badge, Container} from "react-bootstrap";
import EliminaAlmacenMateriaPrima from "../EliminaAlmacenMateriaPrima";
import FechaUltimaModificacion from "./fechaUltimaModificacion";
import TipoUltimoMovimiento from "./TipoUltimoMovimiento";
import CantidadUltimoMovimiento from "./CantidadUltimoMovimiento";
import ModificarAlmacenMP from "../ModificarAlmacenMP";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';

function ListAlmacenMp(props) {
    const { listAlmacenMP, location, history, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalAlmacenMP } = props;

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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // define el uso del enrutamiento
    const enrutamiento = useHistory()

    // Para el modal de eliminación de materias primas
    const eliminacionMateriasprimas = (content) => {
        setTitulosModal("Eliminando materia prima");
        setContentModal(content);
        setShowModal(true);
    }

    // Para editar los detalles de la materia prima que esta en almacen
    const modificarMateriasPrimas = (content) => {
        setTitulosModal("Modificando");
        setContentModal(content);
        setShowModal(true);
    }

    // Para ir hacia la ruta de ver los movimientos de la materia prima
    const irRutaverMovimientos = (folioMP) => {
        enrutamiento.push(`/MovimientosAlmacenMP/${folioMP}`)
    }


const columns = [
        {
                    name: "Folio",
                    selector: row => row.folioMP,
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
                                        <FechaUltimaModificacion
                                            folioMP={row.folioMP}
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
                                        <TipoUltimoMovimiento
                                            folioMP={row.folioMP}
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
                                        <CantidadUltimoMovimiento
                                            folioMP={row.folioMP}
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
                    name: "Existencia para la OV",
                    selector: row => row.existenciasOV,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "Existencia Stock",
                    selector: row => row.existenciasStock,
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
                                                irRutaverMovimientos(row.folioMP)
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
                                modificarMateriasPrimas(
                                    <ModificarAlmacenMP
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
                                eliminacionMateriasprimas(
                                    <EliminaAlmacenMateriaPrima
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
            setRows(listAlmacenMP);
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
                    data={listAlmacenMP}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalAlmacenMP}
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

export default ListAlmacenMp;
