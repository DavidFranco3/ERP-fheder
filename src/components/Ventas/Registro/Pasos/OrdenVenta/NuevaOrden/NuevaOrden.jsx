import { useState, useEffect } from 'react';
import { listarClientes } from "../../../../../../api/clientes";
import {Button, Col, Form, Row, Spinner, Badge} from "react-bootstrap";
import DatePicker, {CalendarContainer} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import "./NuevaOrden.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import { listarCatalogoProductosActivos } from "../../../../../../api/catalogoProductos";
import {map} from "lodash";
import { convierteMoneda } from "../../../../../../utils/monedaALetra";
import {toast} from "react-toastify";

registerLocale('es', es)

function NuevaOrden(props) {
    const { folio, setFormDataNuevaOrden, formDataNuevaOrden, setStartDate, startDate, setListProductosSeleccionados, listProductosSeleccionados, remove, listFinalProductos, setListFinalProductos, setEstadoListaFinal, fechaEstimadaEntrega, setFechaEstimadaEntrega } = props;

    // Calcula el total a pagar
    const totalProducts = listProductosSeleccionados.reduce((cantidad, item) => (cantidad+parseInt(item.precioUnitario)),0);

    // Calcula el subtotal
    const subTotalProducts = listProductosSeleccionados.reduce((cantidad, item) => (cantidad+parseInt(item.precioUnitario)),0);

    const contenedorFechas = ({ className, children }) => {
        return (
            <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
                <CalendarContainer className={className}>
                    <div style={{ background: "#f0f0f0" }}>
                        Seleccione la fecha de solicitud
                    </div>
                    <div style={{ position: "relative" }}>{children}</div>
                </CalendarContainer>
            </div>
        );
    };

    // Para almacenar el listado de productos activos
    const [listProductosActivos, setListProductosActivos] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarCatalogoProductosActivos().then(response => {
                const { data } = response;
                //console.log(data)

                if(!listProductosActivos &&data) {
                    setListProductosActivos(formatModelMatrizProductos(data));
                } else {
                    const datosProductos = formatModelMatrizProductos(data);
                    setListProductosActivos(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    let productosSelecc = []

    const handleProducto = (producto) => {
        //console.log(producto)
        const productoTemp = producto.split("/")
        const idTemp = productoTemp[0]
        const noInternoTemp = productoTemp[1]
        const descripcionTemp = productoTemp[2]
        //console.log(productoTemp)
        productosSelecc.push({id: idTemp, noInterno: noInternoTemp, descripcion: descripcionTemp, cantidad: "1", precioUnitario: "50", monto: "50"})
        setListProductosSeleccionados(listProductosSeleccionados.concat(productosSelecc))
        setEstadoListaFinal(true)
        //setListProductosSeleccionados.push(producto)
        /*if(listProductosSeleccionados) {
            setListProductosSeleccionados(listProductosSeleccionados.concat(productosSelecc))
        } else {
            setListProductosSeleccionados({productosSelecc})
        }*/
        //console.log(listProductosSeleccionados)
    }

    const handleDeleteProduct = (item) => {
        remove(item)
    }

    const onChange = e => {
        setFormDataNuevaOrden({ ...formDataNuevaOrden, [e.target.name]: e.target.value })
    }

    const agregarCantidad = (producto) => {
        // console.log(producto.cantidad)
        //console.log(producto.id + " " + producto.cantidad)
        const tempID = producto.id
        const tempCantidad = parseInt(producto.cantidad) + 1
        //console.log(tempCantidad)

        map(listProductosSeleccionados, (producto, index) => {
            if(producto.id === tempID) {
                producto.cantidad = tempCantidad.toString()
            }
        })
        setEstadoListaFinal(true)
    }

    const restarCantidad = (producto) => {
        // console.log(producto.cantidad)
        if(producto.cantidad === "1") {
            toast.success("Producto eliminado de la lista")
            handleDeleteProduct(producto)
        } else {
            const tempID = producto.id
            const tempCantidad = parseInt(producto.cantidad) - 1
            console.log(tempCantidad)

            map(listProductosSeleccionados, (producto, index) => {
                if(producto.id === tempID) {
                    producto.cantidad = tempCantidad.toString()
                }
            })
            setEstadoListaFinal(true)
        }
    }

    return (
        <>
            <div className="formularioNuevaOrden">
                <Form onChange={onChange}>
                    {/* Folio, referencia, fecha de solicitud */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridReferencia">
                            <Form.Label>Folio {productosSelecc}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la referencia"
                                name="folio"
                                defaultValue={"FD-" + folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridReferencia">
                            <Form.Label>Referencia</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la referencia"
                                name="referencia"
                                defaultValue={formDataNuevaOrden.referencia}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFechaCreacion">
                            <Form.Label>Fecha de creación</Form.Label>
                            <DatePicker
                                locale="es"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                calendarContainer={contenedorFechas}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                todayButton="Fecha actual"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFechaEntrega">
                            <Form.Label>Fecha estimada de entrega</Form.Label>
                            {/* fechaEstimadaEntrega, setFechaEstimadaEntrega */}
                            <DatePicker
                                locale="es"
                                selected={fechaEstimadaEntrega}
                                onChange={(date) => setFechaEstimadaEntrega(date)}
                                calendarContainer={contenedorFechas}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                todayButton="Fecha actual"
                            />
                        </Form.Group>
                    </Row>
                    {/* Vendedor, cliente, termino de pago */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridVendedor">
                            <Form.Label>Vendedor</Form.Label>
                            <Form.Select defaultValue="Elige un vendedor....">
                                <option>Elige....</option>
                                <option>....</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCliente">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Select defaultValue="Elige un cliente....">
                                <option>Elige....</option>
                                <option>....</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridMetodoPago">
                            <Form.Label>Termino de pago</Form.Label>
                            <Form.Select
                                defaultValue={formDataNuevaOrden.terminoPago}
                            >
                                <option>Elige....</option>
                                <option value="Contado">Contado</option>
                                <option value="Credito">Credito</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    {/* Observaciones */}
                    <Form.Group as={Col} controlId="formGridObservaciones">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control as="textarea" rows={3}
                            type="text"
                            placeholder="Escribe las observaciones"
                            name="observaciones"
                            defaultValue={formDataNuevaOrden.observaciones}
                            required
                        />
                    </Form.Group>
                    {/* Desplegable de productos */}
                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                        <Form.Label>
                            Selecciona los productos
                        </Form.Label>
                        {
                            listProductosActivos ?
                                (
                                    <>
                                        <Form.Control as="select"
                                                      onChange={(e) => {
                                                          handleProducto(e.target.value)
                                                      }}
                                                      name="materiaPrima"
                                                      required
                                        >
                                            <option>Elige una opción</option>
                                            {map(listProductosActivos, (producto, index) => (
                                                <option
                                                    key={index}
                                                    value={producto.id + "/" + producto.noInterno + "/" + producto.descripcion}
                                                >
                                                    {producto?.descripcion}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <h4>No hay productos registrados</h4>
                                    </>
                                )
                        }
                    </Form.Group>
                </Form>
                {/* Vista de tabla de los productos */}
                <div className="productosSeleccionados">
                    <h3>Productos seleccionados</h3>

                    <table className="responsive-table-productos"
                    >
                        <thead>
                        <tr>
                            <th scope="col">No. Interno</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Precio Unitario</th>
                            <th scope="col">Monto</th>
                            <th scope="col">Acciones</th>
                        </tr>
                        </thead>
                        <tfoot>
                        <tr>
                            <td colSpan="7">
                                Lista de productos
                            </td>
                        </tr>
                        </tfoot>
                        {map (listFinalProductos, (producto, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {producto?.noInterno}
                                </th>
                                <td data-title="Nombre">
                                    {producto?.descripcion}
                                </td>
                                <td data-title="Cantidad" className="cantidad">
                                    <Row>
                                        <Col>
                                            <FontAwesomeIcon
                                                icon={faCirclePlus}
                                                onClick={() => {
                                                    agregarCantidad(producto)
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            {producto?.cantidad}
                                        </Col>
                                        <Col>
                                            <FontAwesomeIcon
                                                icon={faCircleMinus}
                                                onClick={() => {
                                                    restarCantidad(producto)
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </td>
                                <td data-title="Precio unitario" className="precioUnitario">
                                    <Badge bg="success">$ {producto.precioUnitario} MXN</Badge>
                                </td>
                                <td data-title="Monto" className="monto">
                                    <Badge bg="success">$ {producto.monto} MXN</Badge>
                                </td>
                                <td data-title="Acciones" onClick={() => handleDeleteProduct(producto)} className="eliminar">
                                    ❌
                                </td>
                            </tr>
                        ))}
                    </table>
                    {/* Vista de detalles de venta */}
                    <Row>
                        <Col sm={8}>
                            {convierteMoneda(totalProducts)}
                        </Col>
                        <Col sm={4}>
                            <Row xs={1} md={2}>
                                <Col>Subtotal</Col>
                                <Col>
                                    <Badge bg="success">$ {subTotalProducts} MXN</Badge>
                                </Col>
                            </Row>
                            <Row xs={1} md={2}>
                                <Col>Descuento</Col>
                                <Col>
                                    <Badge bg="success">$ 0 MXN</Badge>
                                </Col>
                            </Row>
                            <Row xs={1} md={2}>
                                <Col>Total</Col>
                                <Col>
                                    <Badge bg="success">$ {totalProducts} MXN</Badge>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <hr />

                </div>
            </div>
        </>
    );
}

function formatModelMatrizProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data.noInterno,
            noParte: data.noParte,
            materiaPrima: data.materiaPrima,
            estado: data.estado,
            descripcion: data.descripcion,
            cliente: data.cliente,
            datosMolde: data.datosMolde,
            datosPieza: data.datosPieza,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default NuevaOrden;
