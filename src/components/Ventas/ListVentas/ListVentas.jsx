import {useEffect, useMemo, useState} from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import {Badge, Button, Container, Table} from "react-bootstrap";
import {map} from "lodash";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaVentas from "../EliminacionFisica";
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import "./ListVentas.scss";
import ClientesPedido from "./ClientesPedido";
import {estilos} from "../../../utils/tableStyled";

function ListVentas(props) {
    const { setRefreshCheckLogin, listPedidosVenta, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalVentas } = props;

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
    
    // Definicion de tabla
    const ExpandedComponent = () => (
        <>
            <Container fluid className="tablaProductos">
            <div className="tituloSeccion">
            <h4>Listado de productos del pedido de venta</h4>
            </div>
                                <table className="responsive-tableTrackingOV"
                                >
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Productos</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Unidad de medida</th>
                                        <th scope="col">Precio</th>
                                        <th scope="col">Subtotal</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {map(listPedidosVenta, (datos, index) => (
                                        
                                        <>
                                        {map(datos.productos, (producto, indexProducto) => (
                                            <>
                                            <tr key={producto.item}>
                                                <th>
                                                    {indexProducto + 1}
                                                </th>
                                                <td>
                                                    {producto.item}
                                                </td>
                                                <td>
                                                    {producto.cantidad}
                                                </td>
                                                <td>
                                                    {producto.um}
                                                </td>
                                                <td>
                                                    <>
                                                        {producto.precioUnitario ? new Intl.NumberFormat('es-MX', {
                                                                style: "currency",
                                                                currency: "MXN"
                                                            }).format(producto.precioUnitario) : "No disponible"}
                                                            {} MXN
                                                    </>
                                                </td>
                                                <td>
                                                    <>
                                                        {producto.total ? new Intl.NumberFormat('es-MX', {
                                                                style: "currency",
                                                                currency: "MXN"
                                                            }).format(producto.total) : "No disponible"}
                                                            {} MXN
                                                    </>
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                    </>
                                     ))}
                                    </tbody>
                                </table>
                            </Container>
        </>
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
                            modificaPedidoVenta(row.folio)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        onClick={() => {
                            const datosPedido = {
                                id: row.id,
                                folio: row.folio
                            }

                            eliminaPedidoVenta(
                                <EliminacionFisicaVentas
                                    datosPedido={datosPedido}
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
            setRows(listPedidosVenta);
            setPending(false);
        }, 2000);
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
                    data={listPedidosVenta}
                    //expandableRows
                    //expandableRowsComponent={ExpandedComponent}
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
