import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Badge, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListNotasPagarCargo.scss";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import EliminacionFisicaNotasPagar from '../EliminacionFisica';
import EliminacionLogicaNotasPagar from '../EliminacionLogica';

function ListNotasPagarCargo(props) {
    const { setRefreshCheckLogin, listNotas, history, location } = props;

    const enrutamiento = useNavigate();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaNota = (content) => {
        setTitulosModal("Eliminando la nota");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaNota = (content) => {
        setTitulosModal("Cancelando la nota");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos del pedido
    const modificaNotas = (id) => {
        enrutamiento(`/ModificacionNotasPagar/${id}`);
    }

    // Para la modificacion de datos del pedido
    const vistaPreviaNotas = (id) => {
        enrutamiento(`/VistaPreviaNotasPagar/${id}`);
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
            name: "CXP",
            selector: row => row.factura,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Concepto",
            selector: row => row.concepto,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Monto",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.totalSinIva)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "% de IVA",
            selector: row => (row.iva * 100) + "%",
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Monto de IVA",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.total - row.totalSinIva)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Total",
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.total)} MXN
                </>
            ),
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
                                    eliminaLogicaNota(
                                        <EliminacionLogicaNotasPagar
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
                            >
                                Cancelada
                            </Badge>
                        </>
                    )
        },
        {
            name: "Acciones",
            center: true,
            reorder: false,
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="primary"
                                title="Generar PDF"
                                className="ver"
                                onClick={() => {
                                    vistaPreviaNotas(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="editar"
                                onClick={() => {
                                    modificaNotas(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminar"
                                onClick={() => {
                                    eliminaNota(
                                        <EliminacionFisicaNotasPagar
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
                    :
                    (
                        "No disponibles"
                    )
            )
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos  = () => {
        const timeout = setTimeout(() => {
            setRows(listNotas);
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

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listNotas}
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

export default ListNotasPagarCargo;
