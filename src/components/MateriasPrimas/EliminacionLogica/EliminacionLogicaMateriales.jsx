import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaMateriales.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaDepartamento } from "../../../api/departamentos";
import { toast } from "react-toastify";
import { actualizaEstadoMateriaPrima } from "../../../api/materiaPrima";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaMateriales(props) {
    const { dataMaterial, setShowModal, history } = props;
    const { id, folio, descripcion, um, precio, estado } = dataMaterial;

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estado: estado === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            actualizaEstadoMateriaPrima(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha actualizado el estado del material " + folio, dataMaterial);
                setShowModal(false);
                setLoading(false);
                history({
                    search: queryString.stringify(""),
                });
            })
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <>
            <Form onSubmit={onSubmit}>

                {estado == "true" ?
                    (
                        <>
                            <Alert variant="danger">
                                <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción deshabilitara en el sistema el material.
                                </p>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara en el sistema el material.
                                </p>
                            </Alert>
                        </>
                    )
                }

                <Row>
                    <Form.Group as={Col} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={folio}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Escribe la descripcion"
                            name="descripcion"
                            defaultValue={descripcion}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            UM
                        </Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={um}
                            disabled
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Escribe la descripcion"
                            name="descripcion"
                            defaultValue={precio}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="success"
                            title={estado === "true" ? "Deshabilitar" : "Habilitar"}
                            type="submit"
                            className="registrar">
                            {!loading ? (estado === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelar()
                            }}
                        >
                            Cancelar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminacionLogicaMateriales;
