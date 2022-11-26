import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { registraCertificado, obtenerNumeroCertificado, obtenerItemCertificado } from "../../../api/certificadosCalidad";
import { toast } from "react-toastify";

function RegistraReporte(props) {

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/CertificadosCalidad")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const [item, setItem] = useState("");

    useEffect(() => {
        try {
            obtenerItemCertificado().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItem(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerNumeroCertificado().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: item,
                    folio: data.noCertificado,
                    fecha: formData.fecha,
                    noOrdenInterna: formData.ordenInterna,
                    tamañoLote: formData.tamañoLote,
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
                registraCertificado(dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje)
                    setLoading(false)
                    rutaRegreso()
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
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva certificado de calidad
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
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
                                                name="descripcion"
                                                defaultValue={formData.descripcion}
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
                                            <Form.Control
                                                type="number"
                                                placeholder="No. Orden interna"
                                                name="ordenInterna"
                                                defaultValue={formData.ordenInterna}
                                            />
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
                                                defaultValue={formData.numeroParte}
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
                                                defaultValue={formData.cliente}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon1"
                                                defaultValue={formData.renglon1}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon2"
                                                defaultValue={formData.renglon2}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon3"
                                                defaultValue={formData.renglon3}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon4"
                                                defaultValue={formData.renglon4}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon5"
                                                defaultValue={formData.renglon5}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon6"
                                                defaultValue={formData.renglon6}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon7"
                                                defaultValue={formData.renglon7}
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
                                                id="si"
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                name="renglon8"
                                                defaultValue={formData.renglon8}
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
                                    className="registrar"
                                    type="submit"
                                >
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    variant="danger"
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
        </>
    );
}

function initialFormData() {
    return {
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
    }
}

export default RegistraReporte;
