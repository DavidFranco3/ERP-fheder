import { useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import "./ModificaEtiquetasMoldes.scss";
import { actualizaEtiquetaMolde } from '../../../api/etiquetasMoldes';
import queryString from "query-string";
import { toast } from "react-toastify";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BasicModal from "../../Modal/BasicModal";
import BuscarCliente from '../../../page/BuscarCliente/BuscarCliente';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function ModificaEtiquetasMoldes(props) {
    const { datos, setShowModal, history } = props;

    const { id } = datos;

    // Para hacer uso del modal
    const [showModal2, setShowModal2] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarCliente = (content) => {
        setTitulosModal("Buscar cliente");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    // Para guardar los datos del formulario
    const [formDataCliente, setFormDataCliente] = useState(initialFormDataCliente(datos));

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.idInterno || !formData.noInterno || !formData.noParte || !formData.cavidad || !formData.descripcion || !formDataCliente.nombreCliente) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación

            const dataTemp = {
                idInterno: formData.idInterno,
                noInterno: formData.noInterno,
                noParte: formData.noParte,
                cavidad: formData.cavidad,
                descripcion: formData.descripcion,
                cliente: formDataCliente.nombreCliente
            }

            actualizaEtiquetaMolde(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se ha actualizado el molde " + formData.folio, dataTemp);
                toast.success(data.mensaje)
                setTimeout(() => {
                    history({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }, 0)

            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataCliente({ ...formDataCliente, [e.target.name]: e.target.value })
    }

    const [direcciones, setDirecciones] = useState([]);

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Id. Interno
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Id. Interno"
                                        name="idInterno"
                                        defaultValue={formData.idInterno}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        No. Interno
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero interno"
                                        name="noInterno"
                                        defaultValue={formData.noInterno}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        No. Parte
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero parte"
                                        name="noParte"
                                        defaultValue={formData.noParte}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Cavidad
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cavidad"
                                        name="cavidad"
                                        defaultValue={formData.cavidad}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Descripción
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción"
                                        name="descripcion"
                                        defaultValue={formData.descripcion}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Cliente
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            type="text"
                                            placeholder="Cliente"
                                            name="nombreCliente"
                                            defaultValue={formDataCliente.nombreCliente}
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los clientes"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarCliente(
                                                    <BuscarCliente
                                                        formData={formData}
                                                        setFormData={setFormDataCliente}
                                                        setShowModal={setShowModal2}
                                                        setDirecciones={setDirecciones}
                                                    />)
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    title="Guardar la información del formulario"
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
                                        cancelarRegistro()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
            <BasicModal show={showModal2} setShow={setShowModal2} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormData(data) {
    return {
        folio: data.folio,
        idInterno: data.idInterno,
        noInterno: data.noInterno,
        noParte: data.noParte,
        cavidad: data.cavidad,
        descripcion: data.descripcion,
    }
}

function initialFormDataCliente(data) {
    return {
        nombreCliente: data.cliente,
    }
}

export default ModificaEtiquetasMoldes;
