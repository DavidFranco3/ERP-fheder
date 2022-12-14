import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./ModificaIdentificacionPT.scss";
import { listarProduccion } from "../../../api/produccion";
import { actualizaEtiquetaPT, obtenerEtiquetaPT } from "../../../api/etiquetaIdentificacionPT";
import { map } from "lodash";
import { toast } from "react-toastify";
import queryString from "query-string";

function ModificaIdentificacionPT(props) {
    const { history, setShowModal, data } = props;

    const { id } = data;

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    useEffect(() => {
        //
        obtenerEtiquetaPT(id).then(response => {
            const { data } = response;
            //console.log(data)
            const { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = data;
            const dataTemp = {
                fecha: fecha,
                descripcion: descripcion,
                noParte: noParte,
                noOrden: noOrden,
                cantidad: cantidad,
                turno: turno,
                operador: operador,
                supervisor: supervisor,
                inspector: inspector
            }
            setFormData(valoresAlmacenados(dataTemp))
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Para almacenar el listado de productos activos
    const [listProduccion, setListProduccion] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarProduccion().then(response => {
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
            const dataTemp = {
                fecha: formData.fecha,
                descripcion: producto == "" ? formData.descripcion : producto.descripcionProducto,
                noParte: producto == "" ? formData.noParte : producto.numeroParte,
                noOrden: producto == "" ? formData.noorden : producto.ordenProduccion,
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
            actualizaEtiquetaPT(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;

                // console.log(response)
                toast.success(mensaje);
                setShowModal(false);
                history.push({
                    search: queryString.stringify(""),
                });
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
                                        defaultValue={formData.noOrden}
                                        name="noOrden"
                                    >
                                        <option>Elige</option>
                                        {map(listProduccion, (produccion, index) => (
                                            <option
                                                key={index}
                                                value={produccion.folio + "/" + produccion.generalidades.producto + "/" + produccion.generalidades.noParte} selected={formData.noOrden == produccion.folio}
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
                                        value={producto == "" ? formData.descripcion : producto.descripcionProducto}
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
                                        name="noParte"
                                        value={producto == "" ? formData.noParte : producto.numeroParte}
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
                                        <option value="1" selected={formData.turno=="1"}>1</option>
                                        <option value="2" selected={formData.turno=="2"}>2</option>
                                        <option value="3" selected={formData.turno=="3"}>3</option>
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
                                        defaultValue={formData.supervisor}
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
                                    title="Actualizar el registro"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Modificar" : <Spinner animation="border" />}
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
        descripcion: "",
        noParte: "",
        noOrden: "",
        cantidad: "",
        turno: "",
        operador: "",
        supervisor: "",
        inspector: ""
    }
}

function valoresAlmacenados(data) {
    const { fecha, descripcion, noParte, noOrden, cantidad, turno, operador, supervisor, inspector } = data;
    return {
        fecha: fecha,
        descripcion: descripcion,
        noParte: noParte,
        noOrden: noOrden,
        cantidad: cantidad,
        turno: turno,
        operador: operador,
        supervisor: supervisor,
        inspector: inspector
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

export default ModificaIdentificacionPT;
