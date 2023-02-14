import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Badge, Button, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaInspeccion from '../EliminacionFisica';
import EliminacionLogicaInspecciones from '../EliminacionLogica';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye, faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import "./ListInspeccionPieza.scss";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListInspeccionPieza(props) {
    const { setRefreshCheckLogin, listInspeccion, history, location } = props;

    const enrutamiento = useNavigate();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminacionInspeccion = (content) => {
        setTitulosModal("Eliminar");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const cancelacionInspeccion = (content) => {
        setTitulosModal("Cancelando la inspección de pieza");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de la inspeccion
    const modificaInspeccion = (id) => {
        enrutamiento(`/ModificaInspeccionPieza/${id}`);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = (id) => {
        enrutamiento(`/VistaPreviaInspeccion/${id}`);
    }

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de elaboración",
            selector: row => dayjs(row.fechaElaboracion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. O.P",
            selector: row => row.noOP,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de. arranque",
            selector: row => dayjs(row.fechaArranqueMaquina).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. Maquina",
            selector: row => row.noMaquina,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Descripción del producto",
            selector: row => row.descripcionPieza,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => row.cliente,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Material",
            selector: row => row.material,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad lote",
            selector: row => row.cantidadLote,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Status",
            selector: row => row.status === "true" ?
                (
                    <>
                        <Badge
                            bg="success"
                            className="activo"
                            title="Deshabilitar"
                            onClick={() => {
                                cancelacionInspeccion(
                                    <EliminacionLogicaInspecciones
                                        data={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
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
                            bg="danger" className="obsoleto"
                            title="Deshabilitado"
                        >
                            Cancelado
                        </Badge>
                    </>
                ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Motivo cancelacion",
            selector: row => row.motivoCancelacion == "" ? "N/A" : row.motivoCancelacion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            center: true,
            reorder: true,
            selector: row => (
                row.status === "true" ?
                    (
                        <>
                            <Badge
                                bg="info"
                                className="evaluacionProveedor"
                                title="Generar PDF"
                                onClick={() => {
                                    vistaPrevia(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="editar"
                                onClick={() => {
                                    modificaInspeccion(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminar"
                                onClick={() => {
                                    eliminacionInspeccion(
                                        <EliminacionFisicaInspeccion
                                            data={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />)
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


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listInspeccion);
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
                    // actions={descargaCSV}
                    data={listInspeccion}
                    // expandableRows
                    // expandableRowsComponent={ExpandedComponent}
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

export default ListInspeccionPieza;
