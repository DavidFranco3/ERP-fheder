import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
import EliminacionFisicaEtiquetasPT from "../EliminacionFisica";
import ModificaIdentificacionPT from '../ModificaIdentificacionPT';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import EliminacionLogicaEtiquetaPT from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListEtiquetasPT(props) {
    const { setRefreshCheckLogin, listEtiquetas, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useNavigate();

    //Para la eliminacion de compras
    const eliminacionEtiqueta = (content) => {
        setTitulosModal("Eliminando Etiqueta PT");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaEtiqueta = (content) => {
        setTitulosModal("Cancelando la etiqueta de PT");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de compras
    const modifcaEtiqueta = (content) => {
        setTitulosModal("Modificando etiqueta PT");
        setContentModal(content);
        setShowModal(true);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = (id) => {
        enrutamiento(`/VistaPreviaIdentificacionPT/${id}`);
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
            name: "Fecha",
            selector: row => dayjs(row.fecha).format('LL'),
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
            name: "No. de parte",
            selector: row => row.noParte,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Orden de produdcción",
            selector: row => row.noOrden,
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
            name: "Turno",
            selector: row => row.turno,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Operador",
            selector: row => row.operador,
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
                                    eliminaLogicaEtiqueta(
                                        <EliminacionLogicaEtiquetaPT
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
                                title="Generar PDF"
                                className="evaluacionProveedor"
                                onClick={() => {
                                    vistaPrevia(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="eliminarProveedor"
                                onClick={() => {
                                    modifcaEtiqueta(
                                        <ModificaIdentificacionPT
                                            data={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>

                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminarProveedor"
                                onClick={() => {
                                    eliminacionEtiqueta(
                                        <EliminacionFisicaEtiquetasPT
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
            setRows(listEtiquetas);
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

    // Defino barra de busqueda
    const ClearButton = styled(Button)` 
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 34px;
        width: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const TextField = styled.input` 
        height: 32px;
        border-radius: 3px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid #e5e5e5;
        padding: 0 32px 0 16px;
      &:hover {
        cursor: pointer;
      }
    `;

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    // actions={descargaCSV}
                    data={listEtiquetas}
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

export default ListEtiquetasPT;
