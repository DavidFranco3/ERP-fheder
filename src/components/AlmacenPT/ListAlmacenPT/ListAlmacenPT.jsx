import { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom";
import BasicModal from "../../Modal/BasicModal";
import {Badge, Container} from "react-bootstrap";
import EliminaAlmacenPT from "../EliminaAlmacenPT";
import ModificarAlmacenPT from "../ModificarAlmacenPT";
import {map} from "lodash";
import FechaUltimoMovimientoPT from "./FechaUltimoMovimientoPT";
import TipoUltimoMovimientoPT from "./TipoUltimoMovimientoPT";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
import CantidadUltimoMovimiento from "./CantidadUltimoMovimientoPT";

function ListAlmacenPt(props) {
    const { listAlmacenPT, location, history, setRefreshCheckLogin } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // define el uso del enrutamiento
    const enrutamiento = useHistory()

    // Para el modal de eliminación
    const eliminacionPT = (content) => {
        setTitulosModal("Eliminando PT");
        setContentModal(content);
        setShowModal(true);
    }

    // Para editar los detalles del PT que esta en almacen
    const modificarPT = (content) => {
        setTitulosModal("Modificando PT");
        setContentModal(content);
        setShowModal(true);
    }

        // Para ir hacia la ruta de ver los movimientos de la materia prima
    const irRutaverMovimientos = (folioPT) => {
        enrutamiento.push(`/MovimientosAlmacenPT/${folioPT}`)
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
                                        <FechaUltimoMovimientoPT
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
                                        <TipoUltimoMovimientoPT
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
                                        title="Ver movimientos"
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
                            title="Modificar"
                            onClick={() => {
                                modificarPT(
                                    <ModificarAlmacenPT
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
                            title="Eliminar"
                            onClick={() => {
                                eliminacionPT(
                                    <EliminaAlmacenPT
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
            setRows(listAlmacenPT);
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
                    data={listAlmacenPT}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListAlmacenPt;
