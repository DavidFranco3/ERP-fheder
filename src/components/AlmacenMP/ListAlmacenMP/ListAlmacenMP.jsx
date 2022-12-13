import { useState, useEffect } from 'react';
import BasicModal from "../../Modal/BasicModal";
// Terminan importaciones para la tabla
import { useHistory } from "react-router-dom";
import "./ListAlmacenMP.scss"
import moment from "moment";
import { Badge, Container } from "react-bootstrap";
import EliminaAlmacenMateriaPrima from "../EliminaAlmacenMateriaPrima";
import FechaUltimaModificacion from "./fechaUltimaModificacion";
import TipoUltimoMovimiento from "./TipoUltimoMovimiento";
import CantidadUltimoMovimiento from "./CantidadUltimoMovimiento";
import ModificarAlmacenMP from "../ModificarAlmacenMP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';

function ListAlmacenMp(props) {
    const { listAlmacenMP, location, history, setRefreshCheckLogin } = props;

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
            name: "ITEM",
            selector: row => row.item,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Folio",
            selector: row => row.folioAlmacen,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Materia prima",
            selector: row => row.nombreMP,
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
            name: "Existencia",
            selector: row => row.cantidadExistencia,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Último movimiento",
            selector: row => (
                <>
                    {
                        row.movimientos.length !== 0 ?
                            (
                                moment(row.fecha).format('LL')
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
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listAlmacenMP}
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

export default ListAlmacenMp;
