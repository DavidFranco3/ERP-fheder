import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import "./RegistraInventarioMoldes.scss";
import { registraInventarioMolde, obtenerItemInventarioMolde } from '../../../api/inventarioMoldes';
import queryString from "query-string";
import { toast } from "react-toastify";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BasicModal from "../../Modal/BasicModal";
import BuscarMolde from '../../../page/BuscarMolde';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function RegistraInventarioMoldes(props) {
    const { setShowModal, history } = props;

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para hacer uso del modal
    const [showModal2, setShowModal2] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarMolde = (content) => {
        setTitulosModal("Buscar molde");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataMolde, setFormDataMolde] = useState(initialFormDataMolde());

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    useEffect(() => {
        try {
            obtenerItemInventarioMolde().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItemActual(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formDataMolde.noInterno || !formData.statusMolde) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación

            const dataTemp = {
                item: itemActual,
                noInterno: formDataMolde.noInterno,
                cliente: formDataMolde.cliente,
                noMolde: formDataMolde.noMolde,
                cavMolde: formDataMolde.cavMolde,
                noParte: formDataMolde.noParte,
                descripcion: formDataMolde.descripcion,
                sucursal: getSucursal(),
                statusMolde: formData.statusMolde,
                estado: "true"
            }

            registraInventarioMolde(dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a registrado el inventario del molde " + formDataMolde.noInterno, dataTemp);
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
        setFormDataMolde({ ...formDataMolde, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        No. Interno
                                    </Form.Label>
                                </Col>
                                <Col>
                                <div className="flex items-center mb-1">
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero interno"
                                        name="noInterno"
                                        defaultValue={formDataMolde.noInterno}
                                    />
                                    <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los clientes"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarMolde(
                                                    <BuscarMolde
                                                        formData={formDataMolde}
                                                        setFormData={setFormDataMolde}
                                                        setShowModal={setShowModal2}
                                                    />)
                                            }}
                                        />
                                    </div>
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
                                    <Form.Control
                                        type="text"
                                        placeholder="Cliente"
                                        name="cliente"
                                        defaultValue={formDataMolde.cliente}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        No. Molde
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero de Molde"
                                        name="noMolde"
                                        defaultValue={formDataMolde.noMolde}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Cav. Molde
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Cavidad de molde"
                                        name="cavMolde"
                                        defaultValue={formDataMolde.cavMolde}
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
                                        placeholder="Numero de parte"
                                        name="noParte"
                                        defaultValue={formDataMolde.noParte}
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
                                        defaultValue={formDataMolde.descripcion}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Status molde
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        placeholder="Status molde"
                                        name="statusMolde"
                                        defaultValue={formData.statusMolde}
                                    >
                                        <option>Elige una opción</option>
                                        <option value="Molde en planta">Molde en planta</option>
                                        <option value="Molde no existente">Molde no existente</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    variant="success"
                                    title="Guardar información del formulario"
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
                </div>
            </Container>
            <BasicModal show={showModal2} setShow={setShowModal2} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormData() {
    return {
        statusMolde: "",
    }
}

function initialFormDataMolde() {
    return {
        noInterno: "",
        cliente: "",
        noMolde: "",
        cavMolde: "",
        noParte: "",
        descripcion: "",

    }
}

export default RegistraInventarioMoldes;
