import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
// Inician importaciones para la tabla
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
import ProveedoresenCompras from "./ProveedoresenCompras";
import EliminacionFisicaCompras from "../EliminacionFisica";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { map } from "lodash";
import ListProductosCompras from '../ListProductosCompras';

function ListCompras(props) {
    const { setRefreshCheckLogin, listCompras, history, location } = props;

    moment.locale("es");

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

    //Para la modificacion de compras
    const modificacionCompraAlmacen = (folio) => {
        enrutamiento.push(`/Compras/AlmacenMP/Modificacion/${folio}`)
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
                                moment(row.fechaSolicitud).format('LL')
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
                                moment(row.fechaEntrega).format('LL')
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
                        className="evaluacionProveedor"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    {
                        row.departamento === "Compras" ?
                            (
                                <>
                                    <Badge
                                        bg="success"
                                        className="editarProveedor"
                                        onClick={() => {
                                            modificacionCompra(row.folio)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                                    </Badge>
                                </>
                            ) : (
                                <>
                                    <Badge
                                        bg="success"
                                        className="editarProveedor"
                                        onClick={() => {
                                            modificacionCompraAlmacen(row.folio)
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                                    </Badge>
                                </>
                            )
                    }
                    <Badge
                        bg="danger"
                        className="eliminarProveedor"
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
