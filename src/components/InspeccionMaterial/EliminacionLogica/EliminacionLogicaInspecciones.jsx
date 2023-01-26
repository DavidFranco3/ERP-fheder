import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaInspecciones.scss";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaDepartamento } from "../../../api/departamentos";
import { toast } from "react-toastify";
import { actualizaEstadoInspeccionPieza } from "../../../api/inspeccionPieza";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import moment from "moment";

function EliminacionLogicaInspecciones(props) {
    const { data, setShowModal, history } = props;
    const { id, folio, fechaElaboracion, noOP, fechaArranqueMaquina, noMaquina, cliente, descripcionPieza, noParte, material, cantidadLote, status } = data;

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const cancelar = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();
        if (!formData.motivoCancelacion) {
            toast.warning("Especifica el motivo de la cancelacion");
        } else {
            setLoading(true);

            const dataTemp = {
                motivoCancelacion: formData.motivoCancelacion,
                status: status === "false" ? "true" : "false"
            }
            //console.log(dataTemp)

            try {
                actualizaEstadoInspeccionPieza(id, dataTemp).then(response => {
                    const { data } = response;
                    //console.log(data)
                    toast.success(data.mensaje);
                    LogsInformativos("Se ha cancelado la inspección de pieza " + folio, dataTemp)
                    setShowModal(false);
                    setLoading(false);
                    history.push({
                        search: queryString.stringify(""),
                    });
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
            <Form onSubmit={onSubmit} onChange={onChange}>

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción cancelara la inspeccion, no se podra revertir despues.
                    </p>
                </Alert>


                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={folio}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Fecha de elaboracion
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={fechaElaboracion}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Orden de produccion
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noOP}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Fecha de arranque de maquina
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={fechaArranqueMaquina}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Numero de maquina
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noMaquina}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Cliente
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={cliente}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Pieza
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={descripcionPieza}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Numero de parte
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={noParte}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Material
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={material}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Cantidad del lote
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={cantidadLote}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Motivo de la cancelacion
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            name="motivoCancelacion"
                            defaultValue={formData.motivoCancelacion}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="success"
                            title={status === "Activo" ? "Cancelar inspeccion" : "Habilitar"}
                            type="submit"
                            className="registrar">
                            {!loading ? "Cancelar" : <Spinner animation="border" />}
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
                            Cerrar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

function initialFormData() {
    return {
        motivoCancelacion: "",
    }
}

export default EliminacionLogicaInspecciones;
