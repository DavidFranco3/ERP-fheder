import { useEffect, useMemo, useState } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { map } from "lodash";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaVentas from "../EliminacionFisica";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListVentas.scss";
import ClientesPedido from "./ClientesPedido";
import { estilos } from "../../../utils/tableStyled";
import ListProductosVentas from '../ListProductosVentas';

function ListVentas(props) {
    const { setRefreshCheckLogin, listPedidosVenta, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas } = props;

    const { folio } = listPedidosVenta

    const enrutamiento = useHistory();

    // Definicion de la paginacion
    const handlePageChange = (page) => {
        setPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage)
    }

    //console.log(listPedidosVenta)

    moment.locale("es");

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

    // Para la modificacion de datos del pedido
    const modificaPedidoVenta = (folio) => {
        enrutamiento.push(`/ModificacionPedido/${folio}`);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = () => {
        // enrutamiento.push("")
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
            selector: row => moment(row.fechaElaboracion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha entrega",
            selector: row => moment(row.fechaEntrega).format('LL'),
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
            name: "Acciones",
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        bg="primary"
                        className="ver"
                        onClick={() => {
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="success"
                        className="editar"
                        onClick={() => {
                            modificaPedidoVenta(row.folio)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
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
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listPedidosVenta);
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
                    data={listPedidosVenta}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    paginationServer
                    paginationTotalRows={noTotalVentas}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
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
