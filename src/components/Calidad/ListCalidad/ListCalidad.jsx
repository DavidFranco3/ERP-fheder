import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
import EliminaReporte from "../EliminaReporte";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import DataTable from 'react-data-table-component';
import EliminacionLogicaCalidad from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListCalidad(props) {
    const { setRefreshCheckLogin, listInspeccion, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useNavigate();

    //Para la eliminacion de compras
    const eliminacionInspeccion = (content) => {
        setTitulosModal("Eliminando inspeccion de calidad");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaCalidad = (content) => {
        setTitulosModal("Cancelando la inspeccion de calidad del material");
        setContentModal(content);
        setShowModal(true);
    }

    const modificacionCalidad = (id) => {
        enrutamiento(`/ModificacionReporte/${id}`)
    }

    const vistaPreviaCalidad = (id) => {
        enrutamiento(`/VistaPreviaReporteCalidad/${id}`)
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
            name: "Fecha de solicitud",
            selector: row => dayjs(row.fecha).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Lote",
            selector: row => row.lote,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Propiedad",
            selector: row => row.propiedad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo de material",
            selector: row => row.tipoMaterial,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Nombre / Descripción",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "UM",
            selector: row => row.unidadMedida,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Resultado final",
            selector: row => row.resultadoFinalInspeccion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Recibio",
            selector: row => row.nombreRecibio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Estado',
            center: true,
            reorder: false,
            selector: row =>
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="success"
                                title="Deshabilitar"
                                className="editar"
                                onClick={() => {
                                    eliminaLogicaCalidad(
                                        <EliminacionLogicaCalidad
                                            data={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />)
                                }}
                            >
                                Activa
                            </Badge>
                        </>
                    )
                    :
                    (
                        <>
                            <Badge
                                bg="danger"
                                title="Habilitar"
                                className="eliminar"
                            >
                                Cancelada
                            </Badge>
                        </>
                    )
        },
        {
            name: "Acciones",
            center: true,
            reorder: true,
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="info"
                                title="Modificar"
                                className="evaluacionProveedor"
                                onClick={() => {
                                    vistaPreviaCalidad(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>

                            <Badge
                                bg="success"
                                title="Modificar"
                                className="editarProveedor"
                                onClick={() => {
                                    modificacionCalidad(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>

                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminarProveedor"
                                onClick={() => {
                                    eliminacionInspeccion(
                                        <EliminaReporte
                                            data={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                            </Badge>
                        </>
                    )
                    :
                    (
                        "No disponibles"
                    )
            )
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listInspeccion);
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

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);


    return (
        <>
            <Container fluid>
                <DataTable
                    noDataComponent="No hay registros para mostrar"
                    columns={columns}
                    // actions={descargaCSV}
                    data={listInspeccion}
                    //expandableRows
                    //expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListCalidad;
