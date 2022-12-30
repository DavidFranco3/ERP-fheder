import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./RegistroIdentificacionPT.scss";
import { listarProduccion } from "../../../api/produccion";
import { registraEtiquetaPT, obtenerNoEtiquetaPT, obtenerItemEtiquetaPT } from "../../../api/etiquetaIdentificacionPT";
import { map } from "lodash";
import { toast } from "react-toastify";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function RegistroIdentificacionPT(props) {
    const { setShowModal, history } = props;

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNoEtiquetaPT().then(response => {
                const { data } = response;
                // console.log(data)
                const { noEtiqueta } = data;
                setFolioActual(noEtiqueta)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el listado de productos activos
    const [listProduccion, setListProduccion] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarProduccion(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProduccion && data) {
                    setListProduccion(formatModelProduccion(data));
                } else {
                    const datosProduccion = formatModelProduccion(data);
                    setListProduccion(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la materia prima seleccionada
    const [producto, setProducto] = useState([]);

    const handleProducto = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setProducto({
            ordenProduccion: temp[0],
            descripcionProducto: temp[1],
            numeroParte: temp[2]
        })
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerItemEtiquetaPT().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: data.item,
                    folio: folioActual,
                    fecha: formData.fecha,
                    descripcion: producto.descripcionProducto,
                    noParte: producto.numeroParte,
                    noOrden: producto.ordenProduccion,
                    sucursal: getSucursal(),
                    cantidad: formData.cantidad,
                    turno: formData.turno,
                    operador: formData.operador,
                    supervisor: formData.supervisor,
                    inspector: formData.inspector
                }
                // console.log(dataTemp)
                // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
                // 
                // Modificar el pedido creado recientemente
                registraEtiquetaPT(dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    LogsInformativos("Nueva etiqueta de identificacion de PT" + folioActual, dataTemp)
                    // console.log(response)
                    toast.success(mensaje);
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false);
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Fecha
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                        defaultValue={formData.fecha}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalProducto">
                                <Col sm="2">
                                    <Form.Label>
                                        Orden de producción
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        onChange={(e) => {
                                            handleProducto(e.target.value)
                                        }}
                                        defaultValue={formData.ordenProduccion}
                                        name="ordenProduccion"
                                    >
                                        <option>Elige</option>
                                        {map(listProduccion, (produccion, index) => (
                                            <option
                                                key={index}
                                                value={produccion.folio + "/" + produccion.generalidades.producto + "/" + produccion.generalidades.noParte}
                                            >
                                                {produccion.folio}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Descripción producto
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción del producto"
                                        name="descripcion"
                                        value={producto.descripcionProducto}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        No. Parte
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero de parte"
                                        name="numeroParte"
                                        value={producto.numeroParte}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Cantidad
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Cantidad"
                                        name="cantidad"
                                        defaultValue={formData.cantidad}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Turno
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        name="turno"
                                        defaultValue={formData.turno}
                                    >
                                        <option >Elige</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Operador
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Operador"
                                        name="operador"
                                        defaultValue={formData.operador}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Supervisor
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Supervisor"
                                        name="supervisor"
                                        defaultvalue={formData.supervisor}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Inspector
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Inspector"
                                        name="inspector"
                                        defaultValue={formData.inspector}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar la informacion del formulario"
                                    variant="success"
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
                                        cancelarRegistro()
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
        fecha: "",
        ordenProduccion: "",
        descripcion: "",
        numeroParte: "",
        cantidad: "",
        turno: "",
        operador: "",
        supervisor: "",
        inspector: ""
    }
}

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            generalidades: data.generalidades,
            planeacion: data.planeacion,
            bom: data.bom,
            resultados: data.resultados,
            materiaPrima: data.materiaPrima,
            observaciones: data.observaciones,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistroIdentificacionPT;
