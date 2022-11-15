import {useEffect, useMemo, useState} from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import {Badge, Button, Container, Table} from "react-bootstrap";
import {map} from "lodash";
import BasicModal from "../../Modal/BasicModal";
import EliminacionAsignacionPedido from "../EliminacionAsignacionPedido";
import AsignarPedido from "../AsignarPedido"
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye, faArrowPointer} from "@fortawesome/free-solid-svg-icons";
import "./ListAsignacionPedido.scss";
import ProductoAsignado from "./ProductoAsignado";
import ClienteAsignado from "./ClienteAsignado";
import {estilos} from "../../../utils/tableStyled";

function ListAsignacionPedido(props) {
    const { setRefreshCheckLogin, listAsignacionPedido, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalAsignaciones } = props;

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
    const eliminacionAsignacion = (content) => {
        setTitulosModal("Eliminando la asignacion del pedido");
        setContentModal(content);
        setShowModal(true);
    }
    
    // Para la eliminacion fisica de usuarios
    const asignarPedido = (content) => {
        setTitulosModal("Asignar");
        setContentModal(content);
        setShowModal(true);
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
            name: "Fecha pedido",
            selector: row => moment(row.fechaPedido).format('LL'),
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
            name: "Producto",
            selector: row => (
                <>
                    <ProductoAsignado
                        id={row.producto}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "UM",
            selector: row => row.um,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad pedida",
            selector: row => row.cantidadPedida,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Planta asignada",
            selector: row => row.plantaAsignada,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad asignada",
            selector: row => row.cantidadAsignada,
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
                        {
                            row.plantaAsignada && row.cantidadAsignada === "N/A" ?
                            (
                        <>
                            <Badge
                            bg="warning"
                            className="editarProveedor"
                            onClick={() => {
                                asignarPedido(
                                    <AsignarPedido
                                        data={row}
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowPointer} className="text-lg" />
                        </Badge>
                        </>
                        ):(
                        <>
                        <Badge
                            bg="danger"
                            className="editarProveedor"
                            onClick={() => {
                                asignarPedido(
                                    <AsignarPedido
                                        data={row}
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowPointer} className="text-lg" />
                        </Badge>
                        </>
                            )
                            }
                        <Badge
                            bg="danger"
                            className="eliminarProveedor"
                            onClick={() => {
                                eliminacionAsignacion(
                                    <EliminacionAsignacionPedido
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
            setRows(listAsignacionPedido);
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

    // Defino barra de busqueda
    const ClearButton = styled(Button) ` 
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

    const TextField = styled.input ` 
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
                    // actions={descargaCSV}
                    data={listAsignacionPedido}
                    // expandableRows
                    // expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    paginationServer
                    paginationTotalRows={noTotalAsignaciones}
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

export default ListAsignacionPedido;
