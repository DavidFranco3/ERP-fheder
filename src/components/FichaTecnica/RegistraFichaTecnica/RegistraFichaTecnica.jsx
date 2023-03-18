import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./RegistraFichaTecnica.scss";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";
import { registraFichaTecnica, obtenerNoFicha, obtenerItemFichasTecnicas } from "../../../api/fichasTecnicas";
import { map } from "lodash";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";

function RegistraFichaTecnica(props) {
    const { setRefreshCheckLogin } = props;
    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/FichaTecnica")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    const obtenerFolio = () => {
        try {
            obtenerNoFicha().then(response => {
                const { data } = response;
                // console.log(data)
                const { noFicha } = data;
                setFolioActual(noFicha)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerFolio();
    }, []);

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    const obtenerItem = () => {
        try {
            obtenerItemFichasTecnicas().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItemActual(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerItem();
    }, []);

    const [cargaFichas, setCargaFichas] = useState(initialFormDataFichas());
    const [listFichasCargadas, setListFichasCargadas] = useState([]);

    const addItems = () => {
        const propiedades = document.getElementById("propiedades").value
        const especificaciones = document.getElementById("especificaciones").value
        const tolerancia = document.getElementById("tolerancia").value
        const unidad = document.getElementById("unidad").value
        const referencia = document.getElementById("referencia").value

        if (!propiedades || !especificaciones || !tolerancia || !unidad || !referencia) {
            toast.warning("Completa la información de la ficha");
        } else {
            const dataTemp = {
                propiedades: propiedades,
                especificaciones: especificaciones,
                tolerancia: tolerancia,
                unidad: unidad,
                referencia: referencia
            }
            // console.log(dataTemp)

            setListFichasCargadas(
                [...listFichasCargadas, dataTemp]
            );

            //document.getElementById("descripcion").value = ""
            document.getElementById("propiedades").value = ""
            document.getElementById("especificaciones").value = ""
            document.getElementById("tolerancia").value = ""
            document.getElementById("unidad").value = ""
            document.getElementById("referencia").value = ""
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //document.getElementById("descripcion").value = ""
        document.getElementById("propiedades").value = ""
        document.getElementById("especificaciones").value = ""
        document.getElementById("tolerancia").value = ""
        document.getElementById("unidad").value = ""
        document.getElementById("referencia").value = ""
    }

    // Para eliminar productos del listado
    const removeItem = (ficha) => {
        let newArray = listFichasCargadas;
        newArray.splice(newArray.findIndex(a => a.propiedades === ficha.propiedades), 1);
        setListFichasCargadas([...newArray]);
    }

    const onSubmit = e => {
        e.preventDefault();
        console.log(e)

        if (!formData.descripcionMaterial || !formData.realizo || !formData.autorizo) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                item: itemActual,
                folio: folioActual,
                descripcion: formData.descripcionMaterial,
                fechaElaboracion: fechaActual,
                realizo: formData.realizo,
                sucursal: getSucursal(),
                autorizo: formData.autorizo,
                fichas: listFichasCargadas,
                estado: "true"
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            registraFichaTecnica(dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han registrado la ficha tecnica con folio " + folioActual, dataTemp)
                // Registro inicial del tracking
                rutaRegreso();
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    console.log(formData)

    const renglon = listFichasCargadas.length + 1;

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaActual, setFechaActual] = useState(fecha);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva ficha tecnica
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <br />

            <Container fluid>
                <br />
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Descripcion de material
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion de material"
                                        name="descripcionMaterial"
                                        defaultValue={formData.descripcionMaterial}
                                    />
                                </Col>

                                <Col sm="2">
                                    <Form.Label>
                                        Realizo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Realizo"
                                        name="realizo"
                                        defaultValue={formData.realizo}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Fecha de elaboración
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                        value={fechaActual}
                                        onChange={e => setFechaActual(e.target.value)}
                                    />
                                </Col>

                                <Col sm="2">
                                    <Form.Label>
                                        Autorizó
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Autorizó"
                                        name="autorizo"
                                        defaultValue={formData.autorizo}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <hr />
                        <Badge bg="secondary" className="tituloFormularioDetalles">
                            <h4>A continuación, especifica los detalles de la ficha y agregala</h4>
                        </Badge>
                        <br />
                        <hr />

                        <Row>

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    ITEM
                                </Form.Label>
                                <Form.Control type="number"
                                    id="index"
                                    value={renglon}
                                    name="index"
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                <Form.Label>
                                    Propiedades
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    id="propiedades"
                                    name="propiedades"
                                    placeholder='Propiedades'
                                />
                            </Form.Group>


                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Especificaciones
                                </Form.Label>
                                <Form.Control
                                    id="especificaciones"
                                    type="text"
                                    placeholder="Especificaciones"
                                    name="especificaciones"
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Tolerancia
                                </Form.Label>
                                <Form.Control
                                    id="tolerancia"
                                    type="text"
                                    placeholder="Tolerancia"
                                    name="tolerancia"
                                />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>
                                    Unidad
                                </Form.Label>
                                <Form.Control
                                    id="unidad"
                                    type="text"
                                    name="unidad"
                                    placeholder='Unidad'
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridCliente">
                                <Form.Label>
                                    Referencia
                                </Form.Label>
                                <Form.Control
                                    id="referencia"
                                    type="text"
                                    placeholder="Referencia"
                                    name="referencia"
                                />
                            </Form.Group>

                            <Col sm="1">
                                <Form.Group as={Row} className="formGridCliente">
                                    <Form.Label>
                                        &nbsp;
                                    </Form.Label>

                                    <Col>
                                        <Button
                                            variant="success"
                                            title="Agregar el producto"
                                            className="editar"
                                            onClick={() => {
                                                addItems()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant="danger"
                                            title="Cancelar el producto"
                                            className="editar"
                                            onClick={() => {
                                                cancelarCargaProducto()
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faX} className="text-lg" />
                                        </Button>
                                    </Col>

                                </Form.Group>
                            </Col>


                        </Row>

                        <hr />

                        {/* Listado de productos  */}
                        <div className="tablaProductos">

                            {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                            {/* Inicia tabla informativa  */}
                            <Badge bg="secondary" className="tituloFormularioDetalles">
                                <h4>Listado de Fichas agregadas</h4>
                            </Badge>
                            <br />
                            <hr />
                            <table className="responsive-tableRegistroVentas"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Propiedades</th>
                                        <th scope="col">Especificaciones</th>
                                        <th scope="col">Tolerancia</th>
                                        <th scope="col">Unidad</th>
                                        <th scope="col">Referencia</th>
                                        <th scope="col">Eliminar</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                </tfoot>
                                <tbody>
                                    {map(listFichasCargadas, (producto, index) => (
                                        <tr key={index}>
                                            <th scope="row">
                                                {index + 1}
                                            </th>
                                            <td data-title="Descripcion">
                                                {producto.propiedades}
                                            </td>
                                            <td data-title="Material">
                                                {producto.especificaciones}
                                            </td>
                                            <td data-title="UM">
                                                {producto.tolerancia}
                                            </td>
                                            <td data-title="Descripción">
                                                {producto.unidad}
                                            </td>
                                            <td data-title="Descripción">
                                                {producto.referencia}
                                            </td>
                                            <td data-title="Eliminar">
                                                <div
                                                    className="eliminarProductoListado"
                                                    title="Eliminar producto"
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
                        </div>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    title="Guardar la información del formulario"
                                    className="registrar"
                                >
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    title="Cerrar el formulario"
                                    className="cancelar"
                                    onClick={() => {
                                        rutaRegreso()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData() {
    return {
        descripcionMaterial: "",
        realizo: "",
        fecha: "",
        autorizo: ""
    }
}

function initialFormDataFichas() {
    return {
        propiedades: "",
        especificaciones: "",
        tolerancia: "",
        unidad: "",
        referencia: "",
    }
}

export default RegistraFichaTecnica;
