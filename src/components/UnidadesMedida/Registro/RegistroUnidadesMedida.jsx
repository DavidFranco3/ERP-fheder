import { useState } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import "./RegistroUnidadesMedida.scss";
import { toast } from "react-toastify";
import { registraUM } from "../../../api/unidadesMedida";
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function RegistroUnidadesMedida(props) {
    const { setShowModal, history } = props;

    //setShowModal={setShowModal} history={history}

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para cancelar la actualizacion
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();
        if (!formData.nombre) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true);

            const dataTemp = {
                ...formData,
                sucursal: getSucursal(),
                estadoUM: "true"
            }

            try {
                registraUM(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Se a registrado una unidad de medida " + formData.nombre, dataTemp);
                    toast.success(data.mensaje);
                    setShowModal(false);
                    setLoading(false);
                    history({
                        search: queryString.stringify(""),
                    });
                }).catch(e => {
                    console.log(e)
                    if (e.message === 'Network Error') {
                        //console.log("No hay internet")
                        toast.error("Conexión al servidor no disponible");
                        setLoading(false);
                    } else {
                        if (e.response && e.response.status === 401) {
                            const { mensaje } = e.response.data;
                            toast.error(mensaje);
                            setLoading(false);
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                        type="text"
                            name="nombre"
                            placeholder='Unidad de medida'
                            defaultValue={formData.nombre}
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Guardar la información del formulario"
                            variant="success"
                            className="registrar"
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
        </>
    );
}

function initialFormData() {
    return {
        nombre: ""
    }
}

export default RegistroUnidadesMedida;
