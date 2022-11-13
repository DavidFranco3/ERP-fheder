import { useState, useEffect } from 'react';
import { eliminaMateriaPrima } from "../../../api/materiaPrima";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import queryString from "query-string";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function EliminaMateriasPrimas(props) {
    const { dataMaterial, location, history, setShowModal } = props;
    const { id, folio, descripcion } = dataMaterial;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault()

        setLoading(true)
        try {
            eliminaMateriaPrima(id).then(response => {
                const { data } = response;
                LogsInformativos("El material con descripción " + descripcion + " fue eliminado")
                toast.success(data.mensaje)
                setLoading(false)
                setShowModal(false)
                history.push({
                    search: queryString.stringify(""),
                });
            }).catch(e => {
                // console.log(e)
            })
        } catch (e) {
            // console.log(e)
        }
    }

    return (
        <>
            <div className="formularioDatos">
                <Form onSubmit={onSubmit}>
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
                                defaultValue={descripcion}
                                disabled
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="botones">
                        <Button
                            type="submit"
                            variant="success"
                            className="registrar"
                        >
                            {!loading ? "¿Desea eliminar el material?" : <Spinner animation="border" />}
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
}

export default EliminaMateriasPrimas;
