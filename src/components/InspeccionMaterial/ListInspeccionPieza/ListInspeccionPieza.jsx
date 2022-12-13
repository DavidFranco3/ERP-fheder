import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Badge, Button, Container } from "react-bootstrap";
import { map } from "lodash";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaInspeccion from '../EliminacionFisica';
import EliminacionLogicaInspecciones from '../EliminacionLogica';
//import ModificacionEtiquetaPrimeraPieza from "../ModificacionEtiquetaPrimeraPieza";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye, faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import "./ListInspeccionPieza.scss";
//import ClienteAsignado from "./ClienteAsignado";
//import ProductoAsignado from "./ProductoAsignado"
import { estilos } from "../../../utils/tableStyled";

function ListInspeccionPieza(props) {
    const { setRefreshCheckLogin, listInspeccion, history, location } = props;

    const enrutamiento = useHistory();

    moment.locale("es");

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
        setTitulosModal("Cancelando");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de la inspeccion
    const modificaInspeccion = (id) => {
        enrutamiento.push(`/ModificaInspeccionPieza/${id}`);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = () => {
        // enrutamiento.push("")
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
            selector: row => moment(row.fechaElaboracion).format('LL'),
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
            selector: row => moment(row.fechaArranqueMaquina).format('LL'),
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
            selector: row => row.status === "Activo" ?
                (
                    <>
                        <Badge
                            bg="success" className="activo"
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
                            Activo
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
                <>
                    <Badge
                        bg="info"
                        className="evaluacionProveedor"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>

                    {row.status != "Cancelado" &&
                        (
                            <Badge
                                bg="success"
                                className="editar"
                                onClick={() => {
                                    modificaInspeccion(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                        )}
                    <Badge
                        bg="danger"
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
