import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Container, Form, Button, Spinner } from "react-bootstrap"
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import "./BuscarProductosOrdenVenta.scss"
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function BuscarProductosOrdenVenta(props) {
    const { setFormData, setShowModal, listProductos } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
    }

    // Gestionar el socio seleccionado
    const ventaElegida = ({ ordenVenta, item, ID, cantidad }) => {
        // Almacena id, ficha y nombre del socio elegido
        const dataTemp = {
            ordenVenta: ordenVenta,
            cantidadRequerida: cantidad,
            cantidadProducirVenta: cantidad,
            producto: item,
            numeroInterno: ID,
        }
        setFormData(dataTemp);
        cancelarBusqueda();
    }

    const columns = [
        {
            name: 'Orden de venta',
            selector: row => row.ordenVenta,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Producto',
            selector: row => row.item,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Total',
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
            name: "Seleccionar",
            selector: row => (
                <>
                    <FontAwesomeIcon
                        className="eleccion"
                        icon={faCircleCheck}
                        onClick={() => {
                            ventaElegida(row);
                        }}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listProductos);
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

    const filteredItems = listProductos.filter(
        item => item.item && item.item.toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToogle(!resetPaginationToogle);
                setFilterText('');
            }
        };

        return (
            <>
                <Col>
                    <Form.Control
                        id="search"
                        type="text"
                        placeholder="Busqueda por nombre del cliente"
                        aria-label="Search Input"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </Col>
                <Col>
                    <ClearButton
                        title="Limpiar la busqueda"
                        type="button"
                        onClick={handleClear}>
                        X
                    </ClearButton>
                </Col>
            </>
        );
    }, [filterText, resetPaginationToogle]);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    noDataComponent="No hay registros para mostrar"
                    //actions={descargaCSV}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    progressPending={pending}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                />
                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelarBusqueda()
                            }}
                        >
                            Cancelar
                        </Button>
                    </Col>
                </Form.Group>

            </Container>
        </>
    );
}

export default BuscarProductosOrdenVenta;
