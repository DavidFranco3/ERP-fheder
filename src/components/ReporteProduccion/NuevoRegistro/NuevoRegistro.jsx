import { useEffect, useMemo, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./NuevoRegistro.scss";
import { map } from "lodash";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { listarProduccion } from "../../../api/produccion";
import { toast } from "react-toastify";

function NuevoRegistro(props) {
    const { listRegistros, setListRegistros, setShowModal } = props;

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el listado de productos activos
    const [listProductosActivos, setListProductosActivos] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarMatrizProductosActivos().then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProductosActivos && data) {
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
    const [produccionAlmacenada, setProduccionAlmacenada] = useState([]);

    const handleProduccion = (produccion) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = produccion.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        
    }

    const addItems = () => {
        const producto = document.getElementById("producto").value
        const produccion = document.getElementById("produccion").value
        const eficiencia = document.getElementById("eficiencia").value
        const ciclo = document.getElementById("ciclo").value
        const estandar = document.getElementById("estandar").value
        const scrap = document.getElementById("scrap").value
        const observaciones = document.getElementById("observaciones").value

        const temp = document.getElementById("produccion").value.split("/")

        if (!producto || !produccion || !eficiencia || !ciclo || !estandar || !scrap || !observaciones) {
            toast.warning("Completa la información del registro");
        } else {
            setLoading(true);

            const dataTemp = {
                producto: producto,
                produccion: temp[0],
                OrdenVenta: temp[1],
                eficiencia: eficiencia,
                ciclo: ciclo,
                estandar: estandar,
                scrap: scrap,
                observaciones: observaciones
            }
            // console.log(dataTemp)

            setListRegistros(
                [...listRegistros, dataTemp]
            );

            setShowModal(false)
        }
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalProducto">
                                <Col sm="2">
                                    <Form.Label>
                                        Producto
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="producto"
                                        as="select"
                                        name="producto"
                                    >
                                        <option>Elige</option>
                                        {map(listProductosActivos, (producto, index) => (
                                            <option
                                                key={index}
                                                value={producto.descripcion}
                                            >
                                                {producto.descripcion}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Producción
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="produccion"
                                        as="select"
                                        name="produccion"
                                    >
                                        <option>Elige</option>
                                        {map(listProduccion, (produccion, index) => (
                                            <option
                                                key={index}
                                                value={produccion.folio +"/"+ produccion.generalidades.ordenVenta}
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
                                    <Form.Label align="center">
                                        Eficiencia
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="eficiencia"
                                        type="number"
                                        placeholder="Eficiencia"
                                        name="eficiencia"
                                        min="0"
                                        max="100"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Ciclo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="ciclo"
                                        type="number"
                                        min="0"
                                        placeholder="Ciclo"
                                        name="ciclo"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Estandar
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="estandar"
                                        type="number"
                                        min="0"
                                        placeholder="Estandar"
                                        name="estandar"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Scrap
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="scrap"
                                        type="text"
                                        placeholder="Scrap"
                                        name="scrap"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label align="center">
                                        Observacion
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        id="observaciones"
                                        as="textarea"
                                        placeholder="Observaciones"
                                        name="observaciones"
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    variant="success"
                                    title="Agregar registro"
                                    className="registrar"
                                    onClick={() => {
                                        addItems()
                                    }}
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

function formatModelMatrizProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data.noInterno,
            cliente: data.cliente,
            datosMolde: data.datosMolde,
            noParte: data.noParte,
            descripcion: data.descripcion,
            datosPieza: data.datosPieza,
            materiaPrima: data.materiaPrima,
            pigmentoMasterBach: data.pigmentoMasterBach,
            tiempoCiclo: data.tiempoCiclo,
            noOperadores: data.noOperadores,
            piezasxHora: data.piezasxHora,
            piezasxTurno: data.piezasxTurno,
            materialEmpaque: data.materialEmpaque,
            opcionMaquinaria: data.opcionMaquinaria,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
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

export default NuevoRegistro;
