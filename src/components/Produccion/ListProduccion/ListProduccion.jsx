import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Badge, Button, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaProduccion from "../EliminacionFisica";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListProduccion.scss";
//import ProductosPedido from "./ProductosPedido";
import { estilos } from "../../../utils/tableStyled";
import Cliente from "./Cliente";

function ListProduccion(props) {
    const { setRefreshCheckLogin, listProduccion, history, location } = props;

    const enrutamiento = useHistory();

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaProduccion = (content) => {
        setTitulosModal("Eliminando de la produccion");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos del pedido
    const modificaPedidoVenta = (id) => {
        enrutamiento.push(`/ModificacionProduccion/${id}`);
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
            name: "Fecha",
            selector: row => moment(row.planeacion.fecha).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Producto",
            selector: row => row.generalidades.producto,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad a producir",
            selector: row => row.planeacion.cantidadProducir,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => (
                <>
                    <Cliente
                        id={row.generalidades.cliente}
                    />
                </>
            ),
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
                            modificaPedidoVenta(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        onClick={() => {
                            eliminaProduccion(
                                <EliminacionFisicaProduccion
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
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listProduccion);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    // actions={descargaCSV}
                    data={listProduccion}
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

export default ListProduccion;
