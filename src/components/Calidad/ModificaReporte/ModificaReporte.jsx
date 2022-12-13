import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import BuscarOV from "../../../page/BuscarOV";
import BasicModal from "../../Modal/BasicModal";
import { obtenerInspeccion, actualizaInspeccion } from "../../../api/inspeccionMaterial";
import { toast } from "react-toastify";

function ModificaReporte(props) {

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define el uso de los parametros
    const parametros = useParams()
    const { id } = parametros

    useEffect(() => {
        //
        obtenerInspeccion(id).then(response => {
            const { data } = response;
            //console.log(data)
            const { folio, ordenVenta, fecha, nombre, lote, cantidad, propiedad, unidadMedida, tipoMaterial, nombreRecibio, estadoMateriaPrima, contaminacion, presentaHumedad, certificadoCalidad, empaqueDañado, resultadoFinalInspeccion, observaciones } = data;
            const dataTemp = {
                folio: folio,
                ordenVenta: ordenVenta,
                fecha: fecha,
                nombre: nombre,
                lote: lote,
                cantidad: cantidad,
                propiedad: propiedad,
                unidadMedida: unidadMedida,
                tipoMaterial: tipoMaterial,
                nombreRecibio: nombreRecibio,
                estadoMateriaPrima: estadoMateriaPrima,
                contaminacion: contaminacion,
                presentaHumedad: presentaHumedad,
                certificadoCalidad: certificadoCalidad,
                empaqueDañado: empaqueDañado,
                resultadoFinalInspeccion: resultadoFinalInspeccion,
                observaciones: observaciones,
            }
            setFormData(valoresAlmacenados(dataTemp))
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/Calidad")
    }

    const [cantidadRequeridaOV, setCantidadRequeridaOV] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const [ordenVenta, setOrdenVenta] = useState("");

    const buscarOV = (content) => {
        setTitulosModal("Buscar orden de venta");
        setContentModal(content);
        setShowModal(true);
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            const dataTemp = {
                ordenVenta: ordenVenta == "" ? formData.ordenVenta : ordenVenta,
                fecha: formData.fecha,
                lote: formData.lote,
                propiedad: formData.propiedad,
                tipoMaterial: formData.tipoMaterial,
                nombre: formData.nombre,
                cantidad: formData.cantidad,
                unidadMedida: formData.unidadMedida,
                nombreRecibio: formData.nombreRecibio,
                estadoMateriaPrima: formData.estadoMateriaPrima,
                contaminacion: formData.contaminacion,
                presentaHumedad: formData.presentaHumedad,
                certificadoCalidad: formData.certificadoCalidad,
                empaqueDañado: formData.empaqueDañado,
                resultadoFinalInspeccion: formData.resultadoFinalInspeccion,
                observaciones: formData.observaciones
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
            // 
            // Modificar el pedido creado recientemente
            actualizaInspeccion(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;

                // Actualizacion del tracking
                //LogTrackingActualizacion(ordenVenta, "En inspeccion de calidad", "4")
                // console.log(response)
                toast.success(mensaje)
                setLoading(false)
                rutaRegreso()
            }).catch(e => {
                console.log(e)
            })
        }

    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    console.log(formData);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva inspeccion de material
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
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <div className="encabezado">
                            <Container fluid>
                                <br />

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Orden Venta
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Orden de venta"
                                            name="ordenVenta"
                                            value={ordenVenta == "" ? formData.ordenVenta : ordenVenta}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Col sm="5">
                                        <Button
                                            variant="success"
                                            title="Buscar entre las ordenes de venta"
                                            className="agregar"
                                            onClick={() => {
                                                buscarOV(
                                                    <BuscarOV
                                                        setOrdenVenta={setOrdenVenta}
                                                        setCantidadRequeridaOV={setCantidadRequeridaOV}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        >
                                            Orden venta
                                        </Button>
                                    </Col>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Folio
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Orden de venta"
                                            name="ordenVenta"
                                            value={formData.folio}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Fecha
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Fecha"
                                            name="fecha"
                                            defaultValue={formData.fecha}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Nombre/Descripcion
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre/Descripcion"
                                            name="nombre"
                                            defaultValue={formData.nombre}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Lote
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Lote"
                                            name="lote"
                                            defaultValue={formData.lote}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Cantidad
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Cantidad"
                                            name="cantidad"
                                            defaultValue={formData.cantidad}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Propiedad
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="propiedad"
                                            defaultValue={formData.propiedad}
                                        >
                                            <option >Elige....</option>
                                            <option value="Cliente" selected={formData.propiedad == "Cliente"}>Cliente</option>
                                            <option value="Proveedor" selected={formData.propiedad == "Proveedor"}>Proveedor</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        <Form.Label>
                                            UM
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="unidadMedida"
                                            defaultValue={formData.unidadMedida}
                                        >
                                            <option >Elige</option>
                                            <option value="KG" selected={formData.unidadMedida == "KG"}>KG</option>
                                            <option value="Litros" selected={formData.unidadMedida == "Litros"}>Litros</option>
                                            <option value="Piezas" selected={formData.unidadMedida == "Piezas"}>Pieza</option>
                                            <option value="Otros" selected={formData.unidadMedida == "Otros"}>Otros</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Tipo de material
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tipo de material"
                                            name="tipoMaterial"
                                            defaultValue={formData.tipoMaterial}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Nombre de quien recibio
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre de quien recibio"
                                            name="nombreRecibio"
                                            defaultValue={formData.nombreRecibio}
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Estado de materia prima:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="virgen"
                                                type="radio"
                                                label="Virgen"
                                                name="estadoMateriaPrima"
                                                id="virgen"
                                                defaultValue={formData.estadoMateriaPrima}
                                                checked={formData.estadoMateriaPrima == "virgen"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="paletizado"
                                                type="radio"
                                                label="Paletizado"
                                                name="estadoMateriaPrima"
                                                id="paletizado"
                                                defaultValue={formData.estadoMateriaPrima}
                                                checked={formData.estadoMateriaPrima == "paletizado"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="molido"
                                                type="radio"
                                                label="Molido"
                                                name="estadoMateriaPrima"
                                                id="molido"
                                                defaultValue={formData.estadoMateriaPrima}
                                                checked={formData.estadoMateriaPrima == "molido"}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Contaminación:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="contaminacion"
                                                id="si"
                                                defaultValue={formData.contaminacion}
                                                checked={formData.contaminacion == "si"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
                                                checked={formData.contaminacion == "no"}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Presenta humedad:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="presentaHumedad"
                                                id="si"
                                                defaultValue={formData.presentaHumedad}
                                                checked={formData.presentaHumedad == "si"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="presentaHumedad"
                                                id="no"
                                                defaultValue={formData.presentaHumedad}
                                                checked={formData.presentaHumedad == "no"}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Certificado de calidad:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="certificadoCalidad"
                                                id="si"
                                                defaultValue={formData.certificadoCalidad}
                                                checked={formData.certificadoCalidad == "si"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="certificadoCalidad"
                                                id="no"
                                                defaultValue={formData.certificadoCalidad}
                                                checked={formData.certificadoCalidad == "no"}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                El empaque esta dañado:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Si"
                                                name="empaqueDañado"
                                                id="si"
                                                defaultValue={formData.empaqueDañado}
                                                checked={formData.empaqueDañado == "si"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="No"
                                                name="empaqueDañado"
                                                id="no"
                                                defaultValue={formData.empaqueDañado}
                                                checked={formData.empaqueDañado == "no"}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col align="left" sm={3}>
                                            <Form.Label>
                                                Resultado de la inspección:
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="ok"
                                                type="radio"
                                                label="Si"
                                                name="resultadoFinalInspeccion"
                                                id="si"
                                                defaultValue={formData.resultadoFinalInspeccion}
                                                checked={formData.resultadoFinalInspeccion == "ok"}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no Ok"
                                                type="radio"
                                                label="No"
                                                name="resultadoFinalInspeccion"
                                                id="no"
                                                defaultValue={formData.resultadoFinalInspeccion}
                                                checked={formData.resultadoFinalInspeccion == "no Ok"}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row ClassName="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Observaciones
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Observaciones"
                                            name="observaciones"
                                            defaultValue={formData.observaciones}
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Actualizar la información del registro"
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
                                        rutaRegreso()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                        <br />
                    </Form>
                </div>
            </Container>
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormData() {
    return {
        folio: "",
        ordenVenta: "",
        fecha: "",
        nombre: "",
        lote: "",
        cantidad: "",
        propiedad: "",
        unidadMedida: "",
        tipoMaterial: "",
        nombreRecibio: "",
        estadoMateriaPrima: "",
        contaminacion: "",
        presentaHumedad: "",
        certificadoCalidad: "",
        empaqueDañado: "",
        resultadoFinalInspeccion: "",
        observaciones: "",
    }
}

function valoresAlmacenados(data) {
    const { folio, ordenVenta, fecha, nombre, lote, cantidad, propiedad, unidadMedida, tipoMaterial, nombreRecibio, estadoMateriaPrima, contaminacion, presentaHumedad, certificadoCalidad, empaqueDañado, resultadoFinalInspeccion, observaciones } = data;
    return {
        folio: folio,
        ordenVenta: ordenVenta,
        fecha: fecha,
        nombre: nombre,
        lote: lote,
        cantidad: cantidad,
        propiedad: propiedad,
        unidadMedida: unidadMedida,
        tipoMaterial: tipoMaterial,
        nombreRecibio: nombreRecibio,
        estadoMateriaPrima: estadoMateriaPrima,
        contaminacion: contaminacion,
        presentaHumedad: presentaHumedad,
        certificadoCalidad: certificadoCalidad,
        empaqueDañado: empaqueDañado,
        resultadoFinalInspeccion: resultadoFinalInspeccion,
        observaciones: observaciones,
    }
}

export default ModificaReporte;
