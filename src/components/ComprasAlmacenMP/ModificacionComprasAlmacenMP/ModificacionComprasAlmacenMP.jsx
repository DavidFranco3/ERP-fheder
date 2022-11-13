import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { actualizaOrdenCompra, obtenerDatosCompra } from "../../../api/compras";
import { listarProveedores } from "../../../api/proveedores";
import { map, size, values } from "lodash";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { listarPedidosVenta } from "../../../api/pedidoVenta";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Badge, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ModificacionComprasAlmacenMp(props) {
    const { setRefreshCheckLogin } = props;

    // Define el enrutamiento
    const enrutamiento = useHistory()

    // Define el regreso hacia compras
    const regresaCompras = () => {
        enrutamiento.push("/Compras/AlmacenMP")
    }

    // Recupera la información de la compra
    useEffect(() => {
        try {
            obtenerDatosCompra(folio).then(response => {
                const { data } = response;
                // console.log(data)
                const { proveedor, tipo, ordenVenta, diasCredito, productos } = data;
                setListProductosCargados(productos)
                setFormData(dataCompras(proveedor, tipo, ordenVenta, diasCredito))
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    // Define el uso de los parametros
    const parametros = useParams()
    const { folio } = parametros

    // Define la animación de carga
    const [loading, setLoading] = useState(false);

    // Para almacenar el listado de proveedores
    const [listProveedores, setListProveedores] = useState(null);

    useEffect(() => {
        try {
            listarProveedores().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarProveedores() && data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProveedores = formatModelProveedores(data);
                    setListProveedores(datosProveedores);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos de los articulos
    const [formDataArticulos, setFormDataArticulos] = useState(initialFormDataArticulos());
    const [listProductosCargados, setListProductosCargados] = useState([]);

    // Inicia gestión de los articulos cargados
    // Para agregar productos al listado
    const addItems = () => {
        const cantidad = document.getElementById("cantidad").value
        const um = document.getElementById("um").value
        const descripcion = document.getElementById("descripcion").value
        const precio = document.getElementById("precio").value

        const dataTemp = {
            cantidad: cantidad,
            um: um,
            descripcion: descripcion,
            precio: precio,
            subtotal: parseInt(cantidad) * parseInt(precio)
        }
        // console.log(dataTemp)

        setListProductosCargados(
            [...listProductosCargados, dataTemp]
        );

        //setCargaProductos(initialFormDataProductos)
        document.getElementById("cantidad").value = ""
        document.getElementById("um").value = ""
        document.getElementById("descripcion").value = ""
        document.getElementById("precio").value = ""
        // document.getElementById("subtotal").value = ""
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //setCargaProductos(initialFormDataProductos)
        document.getElementById("cantidad").value = ""
        document.getElementById("um").value = ""
        document.getElementById("descripcion").value = ""
        document.getElementById("precio").value = ""
        // document.getElementById("subtotal").value = ""
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.descripcion === producto.descripcion), 1);
        setListProductosCargados([...newArray]);
    }
    // Termina gestión de los articulos cargados

    // Define el envio de datos actualizados
    const onSubmit = (e) => {
        e.preventDefault()

        //
        let validCount = 0;
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if (size(formData) !== validCount) {
            toast.warning("Completa el formulario");
        } else {
            //console.log(formData)
            setLoading(true)
            const dataTemp = {
                folio: folio,
                proveedor: formData.proveedor,
                fechaSolicitud: formData.fecha,
                tipo: formData.tipo,
                ordenVenta: formData.tipo !== "stock" && formData !== "otros" ? formData.ordenVenta : "",
                diasCredito: formData.diasCredito,
                productos: listProductosCargados,
                subtotal: subTotal,
                iva: "16%",
                total: total
            }
            // console.log(dataTemp)
            try {
                obtenerDatosCompra(folio).then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { _id } = data
                    actualizaOrdenCompra(_id, dataTemp).then(response => {
                        const { data: { mensaje, datos } } = response;
                        // console.log(response)
                        toast.success(mensaje)
                        LogsInformativos(`Se han actualizado los datos de la orden de compra con folio ${folio}`, datos)
                        setLoading(false)
                        regresaCompras()
                    }).catch(e => {
                        console.log(e)
                    })
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    // Para almacenar el listado de ordenes de venta
    const [listOrdenesVenta, setListOrdenesVenta] = useState(null);

    useEffect(() => {
        try {
            listarPedidosVenta().then(response => {
                const { data } = response;
                // console.log(data);
                if (!listOrdenesVenta && data) {
                    setListOrdenesVenta(formatModelOrdenesVenta(data));
                } else {
                    const datosOV = formatModelOrdenesVenta(data);
                    setListOrdenesVenta(datosOV);
                }

            }).catch((e) => {
                //console.log(e)
                if (e.message === "Network Error") {
                    toast.error("Conexión a Internet no Disponible");
                    // setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Calcula el subtotal de la lista de artículos cargados
    const subTotal = listProductosCargados.reduce((amount, item) => (amount + parseInt(item.subtotal)), 0);

    // Calcula el total con iva de la lista de productos seleccionados
    const total = subTotal + (subTotal * 0.16)

    // Define el uso del cambio de informacion
    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Modificación de la orden de compra
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    regresaCompras()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                <Form onChange={onChange} onSubmit={onSubmit}>
                    {/* Inicio del encabezado de la solicitud */}
                    {/* Folio, proveedor, fecha de elaboración */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFolio">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Folio de la orden de venta"
                                name="folio"
                                defaultValue={folio}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridProveedor">
                            <Form.Label>
                                Proveedor
                            </Form.Label>
                            <Form.Control as="select"
                                defaultValue={formData.proveedor}
                                name="proveedor"
                                required
                            >
                                <option>Elige una opción</option>
                                {map(listProveedores, (proveedor, index) => (
                                    <option
                                        key={index}
                                        value={proveedor?.id}
                                        selected={proveedor?.id === formData.proveedor}
                                    >
                                        {proveedor?.nombre}
                                    </option>
                                ))}*
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridFechaCreacion">
                            <Form.Label>Fecha de elaboración</Form.Label>
                            <Form.Control
                                className="mb-3"
                                type="datetime-local"
                                defaultValue={formData.fecha}
                                placeholder="Fecha"
                                name="fecha"
                            />
                        </Form.Group>
                    </Row>
                    {/* Tipo de compra, orden de venta ( si aplica solamente ), días de credito */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridTipoCompra">
                            <Form.Label>Tipo de compra</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue={formData.tipo}
                            >
                                <option>Elige....</option>
                                <option value="Orden de venta" selected={formData.tipo === "Orden de venta"}>Orden de Venta</option>
                                <option value="stock" selected={formData.tipo === "stock"}>Stock</option>
                                <option value="otros" selected={formData.tipo === "otros"}>Otros</option>
                            </Form.Control>
                        </Form.Group>

                        {
                            formData.tipo === "Orden de venta" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridOrdenVenta">
                                        <Form.Label>
                                            Orden de venta
                                        </Form.Label>
                                        <Form.Control as="select"
                                            defaultValue={formData.ordenVenta}
                                            name="ordenVenta"
                                            required
                                        >
                                            <option>Elige una opción</option>
                                            {map(listOrdenesVenta, (orden, index) => (
                                                <option key={index} value={orden.folio} selected={orden.folio === formData.ordenVenta}>{orden.folio}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </>
                            )
                        }

                        <Form.Group as={Col}>
                            <Form.Label>
                                Dias de credito
                            </Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                name="diasCredito"
                                placeholder="Escribe los días de credito"
                                defaultValue={formData.diasCredito}
                            />
                        </Form.Group>

                    </Row>
                    {/* Termino del encabezado de la solicitud */}
                    <hr />
                    <Badge bg="secondary" className="tituloFormularioDetalles">
                        <h4>A continuación, especifica los detalles del artículo y agregalo</h4>
                    </Badge>
                    <br />
                    <hr />
                    {/* Cantidad, um, descripción */}
                    <Row className="mb-3">

                        <Form.Group as={Col}>
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            <Form.Control
                                id="descripcion"
                                as="textarea" rows={2}
                                type="text"
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formDataArticulos.descripcion}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Unidad de medida
                            </Form.Label>
                            <Form.Control
                                as="select"
                                id="um"
                                name="um"
                                defaultValue={formDataArticulos.um}
                            >
                                <option >Elige....</option>
                                <option value="KG">KG</option>
                                <option value="Litros">Litros</option>
                                <option value="Piezas">Pieza</option>
                                <option value="Otros">Otros</option>
                            </Form.Control>
                        </Form.Group>

                    </Row>
                    {/* Precio, subtotal */}
                    <Row className="mb-3">

                        <Form.Group as={Col}>
                            <Form.Label>
                                Cantidad
                            </Form.Label>
                            <Form.Control
                                id="cantidad"
                                type="number"
                                min="0"
                                name="cantidad"
                                placeholder="Escribe la cantidad"
                                defaultValue={formDataArticulos.cantidad}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Precio
                            </Form.Label>
                            <Form.Control
                                id="precio"
                                type="number"
                                min="0"
                                name="precio"
                                placeholder="Escribe el precio"
                                defaultValue={formDataArticulos.precio}
                            />
                        </Form.Group>

                        {/*<Form.Group as={Col}>
                            <Form.Label>
                                Subtotal
                            </Form.Label>
                            <Form.Control
                                id="subtotal"
                                type="text"
                                name="subtotal"
                                value={"$ " + new Intl.NumberFormat('es-MX').format(parseInt("$ " + parseInt(formDataArticulos.cantidad) * parseInt(formDataArticulos.precio))) + " MXN"}
                                disabled
                            />
                        </Form.Group>*/}

                    </Row>
                    {/* Botones */}
                    <Form.Group as={Row} className="botones">
                        <Row>
                            <Col>
                                <Button
                                    variant="success"
                                    className="registrar"
                                    onClick={() => {
                                        addItems()
                                    }}
                                >
                                    Agregar producto
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    className="registrar"
                                    onClick={() => {
                                        cancelarCargaProducto()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>

                    <br />
                    <hr />

                    <Badge bg="secondary" className="tituloFormularioDetalles">
                        <h4>Listado de artículos agregados</h4>
                    </Badge>
                    <br />
                    <hr />
                    {/* Inicia tabla informativa del listado de articulos */}
                    <table className="responsive-tableRegistroVentas"
                    >
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">UM</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Subtotal</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                        </thead>
                        <tfoot>
                        </tfoot>
                        <tbody>
                            {map(listProductosCargados, (producto, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        {index + 1}
                                    </th>
                                    <td data-title="Cantidad">
                                        {producto.cantidad}
                                    </td>
                                    <td data-title="UM">
                                        {producto.um}
                                    </td>
                                    <td data-title="Descripción">
                                        {producto.descripcion}
                                    </td>
                                    <td data-title="Orden de compra">
                                        {new Intl.NumberFormat('es-MX', {
                                            style: "currency",
                                            currency: "MXN"
                                        }).format(producto.precio)} MXN
                                    </td>
                                    <td data-title="Observaciones">
                                        {new Intl.NumberFormat('es-MX', {
                                            style: "currency",
                                            currency: "MXN"
                                        }).format(producto.subtotal)} MXN
                                    </td>
                                    <td data-title="Eliminar">
                                        <div
                                            className="eliminarProductoListado"
                                            onClick={() => {
                                                removeItem(producto)
                                            }}
                                        >
                                            ❌
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Termina tabla informativa del listado de articulos */}

                    {/* Inicia tabla definida con totales */}
                    <Row>
                        <Col xs={12} md={8}>
                        </Col>
                        <Col xs={6} md={4}>
                            {/* Subtotal */}
                            <Row>
                                <Col>Subtotal</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(subTotal)} MXN
                                </Col>
                            </Row>
                            {/* IVA */}
                            <Row>
                                <Col>IVA</Col>
                                <Col>
                                    16%
                                </Col>
                            </Row>
                            {/* Total */}
                            <Row>
                                <Col>Total</Col>
                                <Col>
                                    {new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(total)} MXN
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* Termina tabla definida con totales */}

                    {/* Botones de envio del formulario */}
                    <br />
                    <hr />
                    <Form.Group as={Row} className="botones">
                        <Row>
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Actualizar Orden de Compra" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    className="registrar"
                                    onClick={() => {
                                        regresaCompras()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>

            </LayoutPrincipal>
        </>
    );
}

function initialFormData() {
    return {
        proveedor: "",
        tipo: "",
        ordenVenta: "",
        diasCredito: ""
    }
}
function dataCompras(proveedor, tipo, ordenVenta, diasCredito) {
    return {
        proveedor: proveedor,
        tipo: tipo,
        ordenVenta: ordenVenta,
        diasCredito: diasCredito
    }
}

function initialFormDataArticulos() {
    return {
        cantidad: 0,
        um: "",
        descripcion: "",
        precio: 0,
        subtotal: ""
    }
}

function formatModelProveedores(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            productoServicio: data.productoServicio,
            categoria: data.categoria,
            personalContacto: data.personalContacto,
            telefono: data.telefono,
            correo: data.correo,
            tiempoCredito: data.tiempoCredito,
            tiempoRespuesta: data.tiempoRespuesta,
            lugarRecoleccion: data.lugarRecoleccion,
            horario: data.horario,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelOrdenesVenta(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            fechaElaboracion: data.fechaElaboracion,
            entrega: data.entrega,
            cliente: data.cliente,
            credito: data.credito,
            recibe: data.recibe,
            condicionesGenerales: data.condicionesGenerales,
            tiemposEntrega: data.tiemposEntrega,
            lugarEntrega: data.lugarEntrega,
            productos: data.productos,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ModificacionComprasAlmacenMp;
