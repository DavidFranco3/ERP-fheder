import { useState, useEffect } from 'react';
import { actualizaMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { size, values } from "lodash";
import { toast } from "react-toastify";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ModificaMateriasPrimas(props) {
    const { dataMateriaPrima, location, history, setShowModal } = props;
    const { id, folio, descripcion } = dataMateriaPrima;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(dataMateriaPrima));

    const onSubmit = e => {
        e.preventDefault();
        //console.log(formData)

        let validCount = 0;
        values(formData).some(value => {
            value && validCount++;
            return null;
        });

        if (size(formData) !== validCount) {
            toast.warning("Comapleta el formulario")
        } else {
            setLoading(true)
            try {
                actualizaMateriaPrima(id, formData).then(response => {
                    const { data } = response;
                    LogsInformativos("El material con descripción: " + descripcion + " fue modificado", dataMateriaPrima)
                    toast.success(data.mensaje)
                    setLoading(false)
                    setShowModal(false)
                    history.push({
                        search: queryString.stringify(""),
                    });
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
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
                    <Form.Group as={Row} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                defaultValue={folio}
                                disabled
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formData.descripcion}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Tiempo de espera
                        </Form.Label>
                        <Col>
                            <Form.Control
                                type="number"
                                placeholder="Tiempo de espera"
                                name="tiempoespera"
                                defaultValue={formData.tiempoespera}
                                required
                                min="0"
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                variant="success"
                                className="registrar"
                            >
                                {!loading ? "Actualizar" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="danger"
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
        </>
    );
}

function initialFormData(data) {
    const { id, descripcion, tiempoespera } = data;

    return {
        descripcion: descripcion,
        tiempoespera: tiempoespera
    }
}

export default ModificaMateriasPrimas;
