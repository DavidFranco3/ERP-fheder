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

function ListCompras(props) {
    const { setRefreshCheckLogin, listCompras, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalComprasDepto } = props;
    const { folio } = listCompras;
    console.log(listCompras)
    moment.locale("es");

    // Definicion de la paginacion
    const handlePageChange = (page) => {
        setPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage)
    }

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


    // Definicion de tabla
    const ExpandedComponent = () => (
        <>
            <Container fluid className="tablaProductos">
                <div className="tituloSeccion">
                    <h4>Listado de productos de la orden de compra</h4>
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
                        {map(listCompras, (datos, index) => (

                            <>
                                {map(datos.productos, (producto, indexProducto) => (
                                    <>
                                        <tr key={producto.descripcion}>
                                            <th>
                                                {indexProducto + 1}
                                            </th>
                                            <td>
                                                {producto.descripcion}
                                            </td>
                                            <td>
                                                {producto.cantidad}
                                            </td>
                                            <td>
                                                {producto.um}
                                            </td>
                                            <td>
                                                <>
                                                    {producto.precio ? new Intl.NumberFormat('es-MX', {
                                                        style: "currency",
                                                        currency: "MXN"
                                                    }).format(producto.precio) : "No disponible"}
                                                    { } MXN
                                                </>
                                            </td>
                                            <td>
                                                <>
                                                    {producto.subtotal ? new Intl.NumberFormat('es-MX', {
                                                        style: "currency",
                                                        currency: "MXN"
                                                    }).format(producto.subtotal) : "No disponible"}
                                                    { } MXN
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
                            const dataTemp = {
                                id: row.id,
                                folio: row.folio,
                                nombre: row.nombre
                            }
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

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    // Defino barra de busqueda
    const ClearButton = styled(Button)` 
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

    const TextField = styled.input` 
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
                    data={listCompras}
                    //expandableRows
                    //expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    paginationServer
                    paginationTotalRows={noTotalComprasDepto}
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

export default ListCompras;
