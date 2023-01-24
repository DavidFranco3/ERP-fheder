import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
// Inician importaciones para la tabla
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
import ProveedoresenCompras from "./ProveedoresenCompras";
import EliminacionFisicaCompras from "../EliminacionFisica";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import EliminacionLogicaCompras from '../EliminacionLogica';
import DataTable from 'react-data-table-component';
import ListProductosCompras from '../ListProductosCompras';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListCompras(props) {
    const { setRefreshCheckLogin, listCompras, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useHistory();

    //Para la eliminacion de compras
    const eliminacionCompra = (content) => {
        setTitulosModal("Eliminando compra");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaCompras = (content) => {
        setTitulosModal("Deshabilitando la compra");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const habilitaCompras = (content) => {
        setTitulosModal("Habilitando la compra");
        setContentModal(content);
        setShowModal(true);
    }

    const modificacionCompra = (folio) => {
        enrutamiento.push(`/ModificacionCompras/${folio}`)
    }

    const ExpandedComponent = ({ data }) => (
        <ListProductosCompras
            ordenCompra={data.folio}
        />
    );

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
            selector: row => (
                <>
                    {
                        row.fechaSolicitud ?
                            (
                                dayjs(row.fechaSolicitud).format('LL')
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
            name: "Proveedor",
            selector: row => (
                <>
                    {row.proveedor ?
                        (
                            <>
                                <ProveedoresenCompras
                                    id={row.proveedor}
                                />
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
            name: "Fecha de entrega",
            selector: row => (
                <>
                    {
                        row.fechaEntrega ?
                            (
                                dayjs(row.fechaEntrega).format('LL')
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
                                    eliminaLogicaCompras(
                                        <EliminacionLogicaCompras
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
                                    habilitaCompras(
                                        <EliminacionLogicaCompras
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
            name: "Total",
            selector: row => (
                <>
                    {row.total ? new Intl.NumberFormat('es-MX', {
                        style: "currency",
                        currency: "MXN"
                    }).format(row.total) : "No disponible"}
                    { } MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Autoriza",
            selector: row => row.autoriza,
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
                        title="Generar PDF"
                        className="evaluacionProveedor"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="success"
                        title="Modificar"
                        className="editarProveedor"
                        onClick={() => {
                            modificacionCompra(row.folio)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>

                    <Badge
                        bg="danger"
                        className="eliminarProveedor"
                        title="Eliminar"
                        onClick={() => {
                            eliminacionCompra(
                                <EliminacionFisicaCompras
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
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listCompras);
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
                    data={listCompras}
                    noDataComponent="No hay registros para mostrar"
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

export default ListCompras;
