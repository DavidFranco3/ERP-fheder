import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Container, Form, Button, Spinner } from "react-bootstrap"
import moment from "moment";
//import NombreCliente from "../../ListTracking/NombreCliente";
import { map } from "lodash";
import "./BuscarOrdenVenta.scss"
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { obtenerDatosPedidoVenta, listarPedidosVenta } from "../../../api/pedidoVenta";
import { toast } from "react-toastify";

function BuscarOrdenVenta(props) {
    const { setProducto, setOrdenVentaPrincipal, setOrdenVenta, setCantidadRequeridaOV, setIdCliente, setNombreCliente, setFechaPedido, setFechaEntrega, setShowModal, listVentas } = props;
    // console.log(ordenVenta)

    console.log(listVentas)

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [listProducto, setListProducto] = useState([]);

    const [cliente, setCliente] = useState("");
    const [nombre, setNombre] = useState("");
    const [pedido, setPedido] = useState("");
    const [entrega, setEntrega] = useState("");
    const [productoElegido, setProductoElegido] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {

            obtenerDatosPedidoVenta(formData.seleccion).then(response => {
                const { data } = response;
                const { cliente, nombreCliente, fechaElaboracion, fechaEntrega, productos } = data;
                setListProducto(productos)
                setIdCliente(cliente)
                setNombreCliente(nombreCliente)
                setFechaPedido(fechaElaboracion)
                setFechaEntrega(fechaEntrega)
            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.seleccion]);

    const cantidad = listProducto.reduce((amount, item) => (amount + parseInt(item.cantidad)), 0);

    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onSubmit = e => {
        //e.preventDefault();
        if (!formData.seleccion) {
            toast.warning("Selecciona un registro")
        } else {
            //setNombreCliente()
            //console.log(formData)
            setLoading(true);
            setOrdenVenta(formData.seleccion);
            setOrdenVentaPrincipal(formData.seleccion);
            setCantidadRequeridaOV(cantidad);
            setProducto(listProducto)
            setShowModal(false);
        }
    }

    console.log(formData.seleccion)

    const columns = [
        {
            name: 'Orden de venta',
            selector: row => (
                <>
                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                        <Col>
                            <Form.Check
                                value={row.folio}
                                type="radio"
                                //label="Paletizado"
                                name="seleccion"
                                onChange={onChange}
                                id={row.folio}
                                defaultValue={formData.seleccion}
                            />
                        </Col>
                        <Col>
                            {row.folio}
                        </Col>
                    </Form.Group>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Cliente',
            selector: row => row.nombreCliente,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.productos.reduce((amount, item) => (amount + parseInt(item.cantidad)), 0),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de pedido",
            selector: row => moment(row.fechaPedido).format('LL'),
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
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listVentas);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    // Procesa documento para descargar en csv
    function convertArrayOfObjectsToCSV(array) {
        let result;
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(filteredItems[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
        const filename = 'Datos.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Descargar CSV</Button>;

    const descargaCSV = useMemo(() => <Export onExport={() => downloadCSV(filteredItems)} />, []);

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


    const filteredItems = listVentas.filter(
        item => item.nombreCliente && item.nombreCliente.toLowerCase().includes(filterText.toLowerCase())
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
                    <ClearButton type="button" onClick={handleClear}>
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

                            variant="success"
                            className="registrar"
                            onClick={() => {
                                onSubmit()
                            }}

                        >
                            {!loading ? "Seleccionar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
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

function initialFormData() {
    return {
        seleccion: ""
    }
}

export default BuscarOrdenVenta;
