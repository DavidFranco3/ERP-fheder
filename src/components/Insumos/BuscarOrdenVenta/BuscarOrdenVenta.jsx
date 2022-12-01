import { useState, useEffect } from 'react';
import {obtenerFolioActualMP, registraMateriaPrima} from "../../../api/materiaPrima";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {map, size, values} from "lodash";
import {toast} from "react-toastify";
import queryString from "query-string";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import RegistroMateriasPrimas from "../RegistroMateriasPrimas";
import BasicModal from "../../Modal/BasicModal";

function BuscarMateriasPrimas(props) {
    const { setShowModal, location, history, showModal } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    // Para recuperar el folio de la materia prima
    const [folioActualMP, setFolioActualMP] = useState("");
    
    const [showModal2, setShowModal2] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);
    
    // Para el registro en el almacen de PT
    const nuevoRegistro = (content) => {
        setTitulosModal("Nueva reserva");
        setContentModal(content);
        setShowModal2(true);
    }
    
    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
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
                                    <Button
                                        variant="success"
                                        className="registrar"
                                    >
                                        {"Buscar material"}
                                    </Button>
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <br/>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Orden de venta
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Orden de venta"
                                        name="ordenVenta"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                                <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col>
                                    <Form.Control
                                        as="textarea"
                                        name="ordenVenta"
                                    />
                                </Col>
                                </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                variant="success"
                                className="registrar"
                                onClick={() => {
                                    nuevoRegistro(  
                                        <RegistroMateriasPrimas
                                            setShowModal2={setShowModal2}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                 Seleccionar
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
                    <BasicModal show={showModal2} setShow={setShowModal2} title={titulosModal}>
                        {contentModal}
                    </BasicModal>
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

export default BuscarMateriasPrimas;
