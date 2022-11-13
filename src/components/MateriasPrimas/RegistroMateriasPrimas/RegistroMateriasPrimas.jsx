import { useState, useEffect } from 'react';
import {obtenerFolioActualMP, registraMateriaPrima} from "../../../api/materiaPrima";
import {Button, Col, Form, Row, Spinner, Container} from "react-bootstrap";
import {map, size, values} from "lodash";
import {toast} from "react-toastify";
import queryString from "query-string";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function RegistroMateriasPrimas(props) {
    const { setShowModal2, setShowModal, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    // Para recuperar el folio de la materia prima
    const [folioActualMP, setFolioActualMP] = useState("");
    
     // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal2(false)
    }

    useEffect(() => {
        try {
            obtenerFolioActualMP().then(response => {
                const { data } = response;
                // console.log(data)
                const { noMP } = data;
                setFolioActualMP(noMP)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    const onSubmit = e => {
        e.preventDefault();
        //console.log(formData)

        let validCount = 0;
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if(size(formData) !== validCount){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            const dataTemp = {
                folio: folioActualMP,
                descripcion: formData.descripcion,
                tiempoespera: formData.tiempoespera
            }
            try {
                registraMateriaPrima(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Nuevo material registrado", formData)
                    toast.success(data.mensaje)
                    setLoading(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }).catch(e => {
                    //console.log(e)
                })
            } catch (e) {
                //console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="formularioDatos">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Orden de venta
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Orden de venta"
                                        name="ordenVenta"
                                        disabled
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Producto
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Producto"
                                        name="producto"
                                        disabled
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label>
                                        Cantidad a producir
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cantidad a producir"
                                        name="cantidadProducir"
                                        disabled
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Planta asignada
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Planta asignada"
                                        name="plantaAsignada"
                                        disabled
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Container>
                        <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Material
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Material"
                                        name="material"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Material por unidad
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Material por unidad"
                                        name="materialUnidad"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Material necesario
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Material necesario"
                                        name="materialNecesario"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Material ya reservado
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Material ya reservado"
                                        name="materialReservado"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Material a reservar
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Material a reservar"
                                        name="materialReservar"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Material en almacen
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Material en almacen"
                                        name="materialAlmacen"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="4">
                                    <Form.Label align="center">
                                        Diferencia
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Diferencia"
                                        name="diferencia"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    </Container>

                   <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                variant="success"
                                className="registrar"
                            >
                            Registrar
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
                </Form>
            </div>
        </>
    );
}

function initialFormData() {
    return {
        descripcion: "",
        tiempoespera: ""
    }
}

export default RegistroMateriasPrimas;
