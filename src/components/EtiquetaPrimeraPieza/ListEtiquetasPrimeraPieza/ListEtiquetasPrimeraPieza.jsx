import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Badge, Button, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionEtiquetasPrimeraPieza from "../EliminacionEtiquetasPrimeraPieza";
import ModificacionEtiquetaPrimeraPieza from "../ModificacionEtiquetaPrimeraPieza";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye, faArrowPointer } from "@fortawesome/free-solid-svg-icons";
import "./ListEtiquetasPrimeraPieza.scss";
import ClienteAsignado from "./ClienteAsignado";
import ProductoAsignado from "./ProductoAsignado"
import { estilos } from "../../../utils/tableStyled";
import EliminacionLogicaPrimeraPieza from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListEtiquetasPrimeraPieza(props) {
    const { setRefreshCheckLogin, listEtiquetas, history, location } = props;

    const enrutamiento = useHistory();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminacionEtiqueta = (content) => {
        setTitulosModal("Eliminar");
        setContentModal(content);
        setShowModal(true);
    }

     //Para la eliminacion logica de usuarios
     const eliminaLogicaPrimeraPieza = (content) => {
        setTitulosModal("Deshabilitando la etiqueta de primera pieza");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const habilitaPrimeraPieza = (content) => {
        setTitulosModal("Habilitando la etiqueta de primera pieza");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const modificacionEtiqueta = (content) => {
        setTitulosModal("Modificar");
        setContentModal(content);
        setShowModal(true);
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
            name: "Fecha",
            selector: row => dayjs(row.fecha).format('LL'),
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
            name: "Producto",
            selector: row => (
                <>
                    <ProductoAsignado
                        id={row.descripcionProducto}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => (
                <>
                    <ClienteAsignado
                        id={row.cliente}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Peso",
            selector: row => row.peso,
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
            name: "No. Cavidades",
            selector: row => row.noCavidades,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Inspector",
            selector: row => row.inspector,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Supervisor",
            selector: row => row.supervisor,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ultima modificacion",
            selector: row => dayjs(row.fechaActualizacion).format('LL'),
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
                                    eliminaLogicaPrimeraPieza(
                                        <EliminacionLogicaPrimeraPieza
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
                                onClick={() => {
                                    habilitaPrimeraPieza(
                                        <EliminacionLogicaPrimeraPieza
                                            data={row}
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
            name: "Acciones",
            center: true,
            reorder: true,
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
                    <Badge
                        bg="success"
                        className="editar"
                        title="Modificar"
                        onClick={() => {
                            modificacionEtiqueta(
                                <ModificacionEtiquetaPrimeraPieza
                                    data={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        title="Eliminar"
                        onClick={() => {
                            eliminacionEtiqueta(
                                <EliminacionEtiquetasPrimeraPieza
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
            setRows(listEtiquetas);
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
                    data={listEtiquetas}
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

export default ListEtiquetasPrimeraPieza;
