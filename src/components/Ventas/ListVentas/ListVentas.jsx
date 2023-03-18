import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Badge, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaVentas from "../EliminacionFisica";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListVentas.scss";
import ClientesPedido from "./ClientesPedido";
import { estilos } from "../../../utils/tableStyled";
import EliminacionLogicaVentas from '../EliminacionLogica';
import ListProductosVentas from '../ListProductosVentas';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListVentas(props) {
    const { setRefreshCheckLogin, listPedidosVenta, history, location } = props;

    const enrutamiento = useNavigate();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaPedidoVenta = (content) => {
        setTitulosModal("Eliminando el pedido");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaVentas = (content) => {
        setTitulosModal("Cancelando la orden de venta");
        setContentModal(content);
        setShowModal(true);
    }


    // Para la modificacion de datos del pedido
    const modificaPedidoVenta = (folio) => {
        enrutamiento(`/ModificacionPedido/${folio}`);
    }

    // Para la modificacion de datos del pedido
    const vistaPreviaVentas = (folio) => {
        enrutamiento(`/VistaPreviaVenta/${folio}`);
    }

    // Para la modificacion de datos del pedido
    const registroCuentasCobrar = (folio) => {
        enrutamiento(`/FacturasOV/${folio}`);
    }

    const ExpandedComponent = ({ data }) => (
        <ListProductosVentas
            ordenVenta={data.folio}
        />
    );

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => (
                <>
                    <ClientesPedido
                        id={row.cliente}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha pedido",
            selector: row => dayjs(row.fechaElaboracion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha entrega",
            selector: row => dayjs(row.fechaEntrega).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Lugar entrega",
            selector: row => row.lugarEntrega,
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
                                    eliminaLogicaVentas(
                                        <EliminacionLogicaVentas
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
            name: "Orden venta",
            selector: row => (
                <>
                    {row.cotizacion !== "" && row.estado === "true" ?
                        (
                            <>
                                <a
                                    className="text-emerald-700 no-underline"
                                    //className="editar"
                                    //cursor= "pointer !important"
                                    title="Descargar la Orden de venta adjunta"
                                    href={row.cotizacion}
                                    target="_blank"
                                    rel="noreferrer"
                                >Descargar</a>
                            </>
                        )
                        :
                        (
                            "No disponible"
                        )
                    }
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cuenta por cobrar",
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="primary"
                                title="Generar una factura"
                                className="editar"
                                onClick={() => {
                                    registroCuentasCobrar(row.folio)
                                }}
                            >
                                Generar
                            </Badge>
                        </>
                    )
                    :
                    (
                        "No disponible"
                    )
            ),
            sortable: false,
            center: true,
            reorder: false
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
                                    vistaPreviaVentas(row.folio)
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="editar"
                                onClick={() => {
                                    modificaPedidoVenta(row.folio)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminar"
                                onClick={() => {
                                    eliminaPedidoVenta(
                                        <EliminacionFisicaVentas
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

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listPedidosVenta);
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
                    data={rows}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
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

export default ListVentas;
