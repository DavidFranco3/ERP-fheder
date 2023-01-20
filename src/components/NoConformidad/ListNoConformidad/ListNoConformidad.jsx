import { useEffect, useMemo, useState } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { map } from "lodash";
import BasicModal from "../../Modal/BasicModal";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListNoConformidad.scss";
import { estilos } from "../../../utils/tableStyled";
import EliminacionLogicaNoConformidad from '../EliminacionLogica';
import EliminacionFisicaNoConformidad from '../EliminacionFisica';

function ListNoConformidad(props) {
    const { setRefreshCheckLogin, listNoConformidad, history, location } = props;

    const enrutamiento = useHistory();

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaNoConformidad = (content) => {
        setTitulosModal("Eliminando la ficha tecnica");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaNoConformidad = (content) => {
        setTitulosModal("Deshabilitando la no conformidad");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const habilitaNoConformidad = (content) => {
        setTitulosModal("Habilitando la no conformidad");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos del pedido
    const modificaFichaTecnica = (folio) => {
        enrutamiento.push(`/ModificaFichaTecnica/${folio}`);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = () => {
        // enrutamiento.push("")
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
            name: "No conformidad",
            selector: row => row.descripcionNoConformidad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "¿Requiere correccion?",
            selector: row => row.correccion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Causa raiz",
            selector: row => row.causaRaiz,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Accion correctiva",
            selector: row => row.accionCorrectiva,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha",
            selector: row => moment(row.fecha).format('LL'),
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
                                    eliminaLogicaNoConformidad(
                                        <EliminacionLogicaNoConformidad
                                            datos={row}
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
                                onClick={() => {
                                    habilitaNoConformidad(
                                        <EliminacionLogicaNoConformidad
                                            datos={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                Inactiva
                            </Badge>
                        </>
                    )
        },
        {
            name: "Status",
            selector: row => row.statusFinal,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Responsables",
            selector: row => row.responsables,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de cierre",
            selector: row => moment(row.fechaCierre).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        bg="primary"
                        title="Generar PDF"
                        className="ver"
                        onClick={() => {
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    {/*<Badge
                        bg="success"
                        title="Modificar"
                        className="editar"
                        onClick={() => {
                            modificaFichaTecnica(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>*/}
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaNoConformidad(
                                <EliminacionFisicaNoConformidad
                                    datos={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />)
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                    </Badge>
                </>
            )
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listNoConformidad);
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
                    data={listNoConformidad}
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

export default ListNoConformidad;
