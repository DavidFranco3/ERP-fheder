import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { obtenerCertificado, actualizaCertificado } from "../../../api/certificadosCalidad";
import { toast } from "react-toastify";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BuscarProduccion from "../../../page/BuscarProduccion";

function ModificaCertificado(props) {
    const { setRefreshCheckLogin } = props;
    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarProduccion = (content) => {
        setTitulosModal("Buscar producción");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataProduccion, setFormDataProduccion] = useState(initialFormDataProduccionInitial());

    const params = useParams();
    const { id } = params

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/CertificadosCalidad");
    }

    useEffect(() => {
        try {
            obtenerCertificado(id).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formData && data) {
                    setFormData(valoresAlmacenados(data));
                    setFormDataProduccion(initialFormDataProduccion(data));
                } else {
                    const datosInspeccion = valoresAlmacenados(data);
                    const datosProduccion = initialFormDataProduccion(data);
                    setFormData(datosInspeccion);
                    setFormDataProduccion(datosProduccion);
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
                noOrdenInterna: formData.ordenInterna,
                tamañoLote: formData.tamañoLote,
                piezasRechazadas: formDataProduccion.cantidadProducir == "" ? formData.piezasRechazadas : parseInt(formDataProduccion.cantidadProducir) - parseInt(formData.tamañoLote),
                cliente: formData.cliente,
                descripcion: formData.descripcion,
                numeroParte: formData.numeroParte,
                especificacionInforme: formData.especificacion,
                revisionAtributos: {
                    1: {
                        condicion: formData.completas,
                        observacion: formData.observacion1
                    },
                    2: {
                        condicion: formData.arillo,
                        observacion: formData.observacion2
                    },
                    3: {
                        condicion: formData.rechupe,
                        observacion: formData.observacion3
                    },
                    4: {
                        condicion: formData.rebaba,
                        observacion: formData.observacion4
                    },
                    5: {
                        condicion: formData.tono,
                        observacion: formData.observacion5
                    },
                    6: {
                        condicion: formData.rafaga,
                        observacion: formData.observacion6
                    },
                    7: {
                        condicion: formData.contaminacion,
                        observacion: formData.observacion7
                    },
                    8: {
                        condicion: formData.ensamble,
                        observacion: formData.observacion1
                    },
                    9: {
                        condicion: formData.ensamblar,
                        observacion: formData.observacion9
                    },
                    10: {
                        condicion: formData.etiqueta,
                        observacion: formData.observacion10
                    },
                },
                resultadoDimensional: {
                    1: {
                        especificacion: formData.hilos1,
                        tolerancia: formData.hilos2,
                        max: formData.hilos3,
                        min: formData.hilos4,
                        resultado: formData.hilos5,
                        cota: formData.renglon1,
                    },
                    2: {
                        especificacion: formData.sobre1,
                        tolerancia: formData.sobre2,
                        max: formData.sobre3,
                        min: formData.sobre4,
                        resultado: formData.sobre5,
                        cota: formData.renglon2,
                    },
                    3: {
                        especificacion: formData.interior1,
                        tolerancia: formData.interior2,
                        max: formData.interior3,
                        min: formData.interior4,
                        resultado: formData.interior5,
                        cota: formData.renglon3,
                    },
                    4: {
                        especificacion: formData.arillo1,
                        tolerancia: formData.arillo2,
                        max: formData.arillo3,
                        min: formData.arillo4,
                        resultado: formData.arillo5,
                        cota: formData.renglon4,
                    },
                    5: {
                        especificacion: formData.sello1,
                        tolerancia: formData.sello2,
                        max: formData.sello3,
                        min: formData.sello4,
                        resultado: formData.sello5,
                        cota: formData.renglon5,
                    },
                    6: {
                        especificacion: formData.diametro1,
                        tolerancia: formData.diametro2,
                        max: formData.diametro3,
                        min: formData.diametro4,
                        resultado: formData.diametro5,
                        cota: formData.renglon6,
                    },
                    7: {
                        especificacion: formData.boquilla1,
                        tolerancia: formData.boquilla2,
                        max: formData.boquilla3,
                        min: formData.boquilla4,
                        resultado: formData.boquilla5,
                        cota: formData.renglon7,
                    },
                    8: {
                        especificacion: formData.altura1,
                        tolerancia: formData.altura2,
                        max: formData.altura3,
                        min: formData.altura4,
                        resultado: formData.altura5,
                        cota: formData.renglon8,
                    }
                },
                observacionesResultados: formData.observaciones,
                equipoMedicion: formData.medicion,
                referencia: formData.referencia,
                realizo: formData.realizo,
                correo: formData.correo,
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
            // 
            // Modificar el pedido creado recientemente
            actualizaCertificado(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                LogsInformativos("Se ha modificado el certificado de calidad " + formData.folio, dataTemp);
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
        setFormDataProduccion({ ...formDataProduccion, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Modificar certificado de calidad
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

            <Container fluid>
                <div className="formularioDatos">
                    <br />
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Fecha (Lote)
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
                                        <Col sm="2">
                                            <Form.Label align="center">
                                                Descripción
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Descripcion"
                                                name="nombreProducto"
                                                defaultValue={formDataProduccion.nombreProducto}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                No. Orden interna
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <div className="flex items-center mb-1">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="No. Orden interna"
                                                    name="ordenInterna"
                                                    defaultValue={formDataProduccion.ordenInterna}
                                                />
                                                <FontAwesomeIcon
                                                    className="cursor-pointer py-2 -ml-6"
                                                    title="Agregar un resultado"
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        buscarProduccion(
                                                            <BuscarProduccion
                                                                setFormData={setFormDataProduccion}
                                                                formData={formDataProduccion}
                                                                setShowModal={setShowModal}
                                                            />)
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label>
                                                Numero de parte
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                placeholder="Numero de parte"
                                                name="numeroParte"
                                                defaultValue={formDataProduccion.numeroParte}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Tamaño del lote
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Tamaño del lote"
                                                name="tamañoLote"
                                                defaultValue={formData.tamañoLote}
                                            />
                                        </Col>
                                        <Col sm="2">
                                            <Form.Label>
                                                Especificación del informe
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Especificacion del informe"
                                                name="especificacion"
                                                defaultValue={formData.especificacion}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Cliente
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Cliente"
                                                name="cliente"
                                                defaultValue={formDataProduccion.cliente}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Revisión de atributos
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                1-Las piezas estan completas (Sin tiros cortos)
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="completas"
                                                defaultValue={formData.completas}
                                                checked={formData.completas == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="completas"
                                                defaultValue={formData.completas}
                                                checked={formData.completas == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion1"
                                                defaultValue={formData.observacion1}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                2-El arillo de sello no presenta deformidad
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="arillo"
                                                defaultValue={formData.arillo}
                                                checked={formData.arillo == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="arillo"
                                                defaultValue={formData.arillo}
                                                checked={formData.arillo == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion2"
                                                defaultValue={formData.observacion2}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                3-Rechupe de la pieza
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="rechupe"
                                                defaultValue={formData.rechupe}
                                                checked={formData.rechupe == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="rechupe"
                                                defaultValue={formData.rechupe}
                                                checked={formData.rechupe == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion3"
                                                defaultValue={formData.observacion3}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                4-La pieza esta libre de rebaba en el sello
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="rebaba"
                                                defaultValue={formData.rebaba}
                                                checked={formData.rebaba == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="rebaba"
                                                defaultValue={formData.rebaba}
                                                checked={formData.rebaba == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion4"
                                                defaultValue={formData.observacion4}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                5-El tono de la pieza corresponde a la pieza master
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="tono"
                                                defaultValue={formData.tono}
                                                checked={formData.tono == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="tono"
                                                defaultValue={formData.tono}
                                                checked={formData.tono == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion5"
                                                defaultValue={formData.observacion5}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                6-La pieza esta libre de rafaga
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="rafaga"
                                                defaultValue={formData.rafaga}
                                                checked={formData.rafaga == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="rafaga"
                                                defaultValue={formData.rafaga}
                                                checked={formData.rafaga == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion6"
                                                defaultValue={formData.observacion6}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                7-Las pieza esta libre de contaminación
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="contaminacion"
                                                defaultValue={formData.contaminacion}
                                                checked={formData.contaminacion == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="contaminacion"
                                                defaultValue={formData.contaminacion}
                                                checked={formData.contaminacion == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion7"
                                                defaultValue={formData.observacion7}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                8-Prueba funcional de ensamble de compotentes (bote y tapa)
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="ensamble"
                                                defaultValue={formData.ensamble}
                                                checked={formData.ensamble == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="ensamble"
                                                defaultValue={formData.ensamble}
                                                checked={formData.ensamble == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion8"
                                                defaultValue={formData.observacion8}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                9-Prueba de fuga de agua (ensamblar bote-tapa) y monitorear que no haya fuga
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="ensamblar"
                                                defaultValue={formData.ensamblar}
                                                checked={formData.ensamblar == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="ensamblar"
                                                defaultValue={formData.ensamblar}
                                                checked={formData.ensamblar == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion9"
                                                defaultValue={formData.observacion9}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                10-La etiqueta del producto esta correctamente llena y se encuentran las piezas completas de acuerda a Norma de empaque
                                            </Form.Label>
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="OK"
                                                name="etiqueta"
                                                defaultValue={formData.etiqueta}
                                                checked={formData.etiqueta == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="NO OK"
                                                name="etiqueta"
                                                defaultValue={formData.etiqueta}
                                                checked={formData.etiqueta == "no"}
                                                id="no"
                                            />
                                        </Col>

                                        <Col sm="2">
                                            <Form.Label>
                                                Observacion
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                placeholder="Observacion"
                                                name="observacion10"
                                                defaultValue={formData.observacion10}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosHerramientas">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Resultado dimensional
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                Especificación
                                            </Form.Label>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                Tolerancia
                                            </Form.Label>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                Max
                                            </Form.Label>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                Min
                                            </Form.Label>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                Resultado (mm)
                                            </Form.Label>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                COTA OK
                                            </Form.Label>
                                        </Col>

                                        <Col>
                                            <Form.Label align="center">
                                                COTA NO OK
                                            </Form.Label>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                1-Diametro bajo hilos "T"
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="hilos1"
                                                defaultValue={formData.hilos1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="hilos2"
                                                defaultValue={formData.hilos2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="hilos3"
                                                defaultValue={formData.hilos3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="hilos4"
                                                defaultValue={formData.hilos4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="hilos5"
                                                defaultValue={formData.hilos5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon1"
                                                defaultValue={formData.renglon1}
                                                checked={formData.renglon1 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon1"
                                                defaultValue={formData.renglon1}
                                                checked={formData.renglon1 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                2-Diametro sobre hilos "E"
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sobre1"
                                                defaultValue={formData.sobre1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sobre2"
                                                defaultValue={formData.sobre2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sobre3"
                                                defaultValue={formData.sobre3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sobre4"
                                                defaultValue={formData.sobre4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sobre5"
                                                defaultValue={formData.sobre5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon2"
                                                defaultValue={formData.renglon2}
                                                checked={formData.renglon2 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon2"
                                                defaultValue={formData.renglon2}
                                                checked={formData.renglon2 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                3-Altura interior "I"
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="interior1"
                                                defaultValue={formData.interior1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="interior2"
                                                defaultValue={formData.interior2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="interior3"
                                                defaultValue={formData.interior3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="interior4"
                                                defaultValue={formData.interior4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="interior5"
                                                defaultValue={formData.interior5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon3"
                                                defaultValue={formData.renglon3}
                                                checked={formData.renglon3 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon3"
                                                defaultValue={formData.renglon3}
                                                checked={formData.renglon3 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                4-Altura de arillo de sello
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="arillo1"
                                                defaultValue={formData.arillo1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="arillo2"
                                                defaultValue={formData.arillo2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="arillo3"
                                                defaultValue={formData.arillo3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="arillo4"
                                                defaultValue={formData.arillo4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="arillo5"
                                                defaultValue={formData.arillo5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon4"
                                                defaultValue={formData.renglon4}
                                                checked={formData.renglon4 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon4"
                                                defaultValue={formData.renglon4}
                                                checked={formData.renglon4 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                5-Diametro interior de arillo de sello
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sello1"
                                                defaultValue={formData.sello1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sello2"
                                                defaultValue={formData.sello2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sello3"
                                                defaultValue={formData.sello3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sello4"
                                                defaultValue={formData.sello4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="sello5"
                                                defaultValue={formData.sello5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon5"
                                                defaultValue={formData.renglon5}
                                                checked={formData.renglon5 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon5"
                                                defaultValue={formData.renglon5}
                                                checked={formData.renglon5 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                6-Diametro exterior de arillo de sello
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="diametro1"
                                                defaultValue={formData.diametro1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="diametro2"
                                                defaultValue={formData.diametro2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="diametro3"
                                                defaultValue={formData.diametro3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="diametro4"
                                                defaultValue={formData.diametro4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="diametro5"
                                                defaultValue={formData.diametro5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon6"
                                                defaultValue={formData.renglon6}
                                                checked={formData.renglon6 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon6"
                                                defaultValue={formData.renglon6}
                                                checked={formData.renglon6 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                7-Diametro exterior de arillo de boquilla
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="boquilla1"
                                                defaultValue={formData.boquilla1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="boquilla2"
                                                defaultValue={formData.boquilla2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="boquilla3"
                                                defaultValue={formData.boquilla3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="boquilla4"
                                                defaultValue={formData.boquilla4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="boquilla5"
                                                defaultValue={formData.boquilla5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon7"
                                                defaultValue={formData.renglon7}
                                                checked={formData.renglon7 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon7"
                                                defaultValue={formData.renglon7}
                                                checked={formData.renglon7 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Label>
                                                8-Altura de boquilla
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="altura1"
                                                defaultValue={formData.altura1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="altura2"
                                                defaultValue={formData.altura2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="altura3"
                                                defaultValue={formData.altura3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="altura4"
                                                defaultValue={formData.altura4}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="altura5"
                                                defaultValue={formData.altura5}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                name="renglon8"
                                                defaultValue={formData.renglon8}
                                                checked={formData.renglon8 == "si"}
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon8"
                                                defaultValue={formData.renglon8}
                                                checked={formData.renglon8 == "no"}
                                                id="no"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="encabezado">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Observaciones
                                            </Form.Label>
                                        </Col>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                placeholder="Observaciones"
                                                name="observaciones"
                                                defaultValue={formData.observaciones}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Descripción del equipo de medición
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Descripción del equipo de medición"
                                                name="medicion"
                                                defaultValue={formData.medicion}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Referencia
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Referencia"
                                                name="referencia"
                                                defaultValue={formData.referencia}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm="2">
                                            <Form.Label>
                                                Realizo
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
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
                                                Correo
                                            </Form.Label>
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control
                                                type="text"
                                                placeholder="Correo"
                                                name="correo"
                                                defaultValue={formData.correo}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    variant="success"
                                    title="Actualizar información"
                                    className="registrar"
                                    type="submit"
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

function initialFormDataProduccionInitial() {
    return {
        ordenInterna: "",
        cliente: "",
        nombreProducto: "",
        numeroParte: "",
        cantidadProducir: ""
    }
}

function initialFormDataProduccion(data) {
    return {
        ordenInterna: data.noOrdenInterna,
        cliente: data.cliente,
        nombreProducto: data.descripcion,
        numeroParte: data.numeroParte,
        cantidadProducir: ""
    }
}

function initialFormData() {
    return {
        folio: "",
        fecha: "",
        descripcion: "",
        ordenInterna: "",
        numeroParte: "",
        tamañoLote: "",
        especificacion: "",
        cliente: "",
        completas: "",
        observacion1: "",
        arillo: "",
        observacion2: "",
        rechupe: "",
        observacion3: "",
        rebaba: "",
        observacion4: "",
        tono: "",
        observacion5: "",
        rafaga: "",
        observacion6: "",
        contaminacion: "",
        observacion7: "",
        ensamble: "",
        observacion8: "",
        ensamblar: "",
        observacion9: "",
        etiqueta: "",
        observacion10: "",
        hilos1: "",
        hilos2: "",
        hilos3: "",
        hilos4: "",
        hilos5: "",
        sobre1: "",
        sobre2: "",
        sobre3: "",
        sobre4: "",
        sobre5: "",
        interior1: "",
        interior2: "",
        interior3: "",
        interior4: "",
        interior5: "",
        arillo1: "",
        arillo2: "",
        arillo3: "",
        arillo4: "",
        arillo5: "",
        sello1: "",
        sello2: "",
        sello3: "",
        sello4: "",
        sello5: "",
        diametro1: "",
        diametro2: "",
        diametro3: "",
        diametro4: "",
        diametro5: "",
        boquilla1: "",
        boquilla2: "",
        boquilla3: "",
        boquilla4: "",
        boquilla5: "",
        altura1: "",
        altura2: "",
        altura3: "",
        altura4: "",
        altura5: "",
        renglon1: "",
        renglon2: "",
        renglon3: "",
        renglon4: "",
        renglon5: "",
        renglon6: "",
        renglon7: "",
        renglon8: "",
        observaciones: "",
        medicion: "",
        referencia: "",
        realizo: "",
        correo: "",
        piezasRechazadas: ""
    }
}

function valoresAlmacenados(data) {
    return {
        folio: data.folio,
        fecha: data.fecha,
        descripcion: data.descripcion,
        ordenInterna: data.noOrdenInterna,
        numeroParte: data.numeroParte,
        tamañoLote: data.tamañoLote,
        especificacion: data.especificacionInforme,
        cliente: data.cliente,
        completas: data.revisionAtributos[0][1].condicion,
        observacion1: data.revisionAtributos[0][1].observacion,
        arillo: data.revisionAtributos[0][2].condicion,
        observacion2: data.revisionAtributos[0][2].observacion,
        rechupe: data.revisionAtributos[0][3].condicion,
        observacion3: data.revisionAtributos[0][3].observacion,
        rebaba: data.revisionAtributos[0][4].condicion,
        observacion4: data.revisionAtributos[0][4].observacion,
        tono: data.revisionAtributos[0][5].condicion,
        observacion5: data.revisionAtributos[0][5].observacion,
        rafaga: data.revisionAtributos[0][6].condicion,
        observacion6: data.revisionAtributos[0][6].observacion,
        contaminacion: data.revisionAtributos[0][7].condicion,
        observacion7: data.revisionAtributos[0][7].observacion,
        ensamble: data.revisionAtributos[0][8].condicion,
        observacion8: data.revisionAtributos[0][8].observacion,
        ensamblar: data.revisionAtributos[0][9].condicion,
        observacion9: data.revisionAtributos[0][9].observacion,
        etiqueta: data.revisionAtributos[0][10].condicion,
        observacion10: data.revisionAtributos[0][10].observacion,
        hilos1: data.resultadoDimensional[0][1].especificacion,
        hilos2: data.resultadoDimensional[0][1].tolerancia,
        hilos3: data.resultadoDimensional[0][1].max,
        hilos4: data.resultadoDimensional[0][1].min,
        hilos5: data.resultadoDimensional[0][1].resultado,
        sobre1: data.resultadoDimensional[0][2].especificacion,
        sobre2: data.resultadoDimensional[0][2].tolerancia,
        sobre3: data.resultadoDimensional[0][2].max,
        sobre4: data.resultadoDimensional[0][2].min,
        sobre5: data.resultadoDimensional[0][2].resultado,
        interior1: data.resultadoDimensional[0][3].especificacion,
        interior2: data.resultadoDimensional[0][3].tolerancia,
        interior3: data.resultadoDimensional[0][3].max,
        interior4: data.resultadoDimensional[0][3].min,
        interior5: data.resultadoDimensional[0][3].resultado,
        arillo1: data.resultadoDimensional[0][4].especificacion,
        arillo2: data.resultadoDimensional[0][4].tolerancia,
        arillo3: data.resultadoDimensional[0][4].max,
        arillo4: data.resultadoDimensional[0][4].min,
        arillo5: data.resultadoDimensional[0][4].resultado,
        sello1: data.resultadoDimensional[0][5].especificacion,
        sello2: data.resultadoDimensional[0][5].tolerancia,
        sello3: data.resultadoDimensional[0][5].max,
        sello4: data.resultadoDimensional[0][5].min,
        sello5: data.resultadoDimensional[0][5].resultado,
        diametro1: data.resultadoDimensional[0][6].especificacion,
        diametro2: data.resultadoDimensional[0][6].tolerancia,
        diametro3: data.resultadoDimensional[0][6].max,
        diametro4: data.resultadoDimensional[0][6].min,
        diametro5: data.resultadoDimensional[0][6].resultado,
        boquilla1: data.resultadoDimensional[0][7].especificacion,
        boquilla2: data.resultadoDimensional[0][7].tolerancia,
        boquilla3: data.resultadoDimensional[0][7].max,
        boquilla4: data.resultadoDimensional[0][7].min,
        boquilla5: data.resultadoDimensional[0][7].resultado,
        altura1: data.resultadoDimensional[0][8].especificacion,
        altura2: data.resultadoDimensional[0][8].tolerancia,
        altura3: data.resultadoDimensional[0][8].max,
        altura4: data.resultadoDimensional[0][8].min,
        altura5: data.resultadoDimensional[0][8].resultado,
        renglon1: data.resultadoDimensional[0][1].cota,
        renglon2: data.resultadoDimensional[0][2].cota,
        renglon3: data.resultadoDimensional[0][3].cota,
        renglon4: data.resultadoDimensional[0][4].cota,
        renglon5: data.resultadoDimensional[0][5].cota,
        renglon6: data.resultadoDimensional[0][6].cota,
        renglon7: data.resultadoDimensional[0][7].cota,
        renglon8: data.resultadoDimensional[0][8].cota,
        observaciones: data.observacionesResultados,
        medicion: data.equipoMedicion,
        referencia: data.referencia,
        realizo: data.realizo,
        correo: data.correo,
        piezasRechazadas: data.piezasRechazadas
    }
}

export default ModificaCertificado;
