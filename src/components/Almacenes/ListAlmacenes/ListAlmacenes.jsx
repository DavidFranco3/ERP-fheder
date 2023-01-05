import { useState, useEffect } from 'react';
import BasicModal from "../../Modal/BasicModal";
// Terminan importaciones para la tabla
import { useHistory } from "react-router-dom";
import "./ListAlmacenes.scss"
import moment from "moment";
import { Badge, Container } from "react-bootstrap";
import EliminaAlmacenes from '../EliminaAlmacenes';
import ModificarAlmacenes from '../ModificarAlmacenes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';

function ListAlmacenMp(props) {
    const { listAlmacenes, location, history, setRefreshCheckLogin } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // define el uso del enrutamiento
    const enrutamiento = useHistory()

    // Para el modal de eliminación de materias primas
    const eliminacionAlmacenes = (content) => {
        setTitulosModal("Eliminando el articulo");
        setContentModal(content);
        setShowModal(true);
    }

    // Para editar los detalles de la materia prima que esta en almacen
    const modificarAlmacenes = (content) => {
        setTitulosModal("Modificando");
        setContentModal(content);
        setShowModal(true);
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
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Articulo",
            selector: row => row.nombreArticulo,
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
            name: "Tipo",
            selector: row => row.tipo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad E/S",
            selector: row => row.cantidadExistencia,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Descripción",
            selector: row => row.descripcion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha",
            selector: row => (moment(row.fecha).format('LL')
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
                    <Badge
                        bg="success"
                        className="editarProveedor"
                        title="Modificar"
                        onClick={() => {
                            modificarAlmacenes(
                                <ModificarAlmacenes
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
                            eliminacionAlmacenes(
                                <EliminaAlmacenes
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
            setRows(listAlmacenes);
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
                    data={listAlmacenes}
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
