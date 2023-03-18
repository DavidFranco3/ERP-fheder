import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import "./RegistraInventarioMaquinas.scss";
import { registraInventarioMaquina, obtenerItemInventarioMaquina } from '../../../api/inventarioMaquinas';
import queryString from "query-string";
import { toast } from "react-toastify";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BasicModal from "../../Modal/BasicModal";
import BuscarMaquina from '../../../page/BuscarMaquina';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function RegistraInventarioMaquinas(props) {
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
    const buscarMaquina = (content) => {
        setTitulosModal("Buscar maquina");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataMaquina, setFormDataMaquina] = useState(initialFormDataMaquina());

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    const obtenerItem = () => {
        try {
            obtenerItemInventarioMaquina().then(response => {
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
    }

    useEffect(() => {
        obtenerItem();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formDataMaquina.noMaquina || !formData.unidades || !formData.capacidad || !formData.codigo) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación

            const dataTemp = {
                item: itemActual,
                tipo: formDataMaquina.tipo,
                codigo: formData.codigo,
                noMaquina: formDataMaquina.noMaquina,
                descripcion: formDataMaquina.descripcion,
                capacidad: formData.capacidad,
                unidades: formData.unidades,
                marca: formDataMaquina.marca,
                modelo: formDataMaquina.modelo,
                noSerie: formDataMaquina.noSerie,
                sucursal: getSucursal(),
                fechaAdquisicion: formDataMaquina.fechaAdquisicion,
                estado: "true"
            }

            registraInventarioMaquina(dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Se a registrado el inventario de la maquina " + formDataMaquina.noMaquina, dataTemp);
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
        setFormDataMaquina({ ...formDataMaquina, [e.target.name]: e.target.value })
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
                                        No. Maquina
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero de maquina"
                                            name="noMaquina"
                                            defaultValue={formDataMaquina.noMaquina}
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los clientes"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarMaquina(
                                                    <BuscarMaquina
                                                        formData={formDataMaquina}
                                                        setFormData={setFormDataMaquina}
                                                        setShowModal={setShowModal2}
                                                    />)
                                            }}
                                        />
                                    </div>
                                </Col>

                                <Col sm="3">
                                    <Form.Label align="center">
                                        Unidades
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Unidades"
                                        name="unidades"
                                        defaultValue={formData.unidades}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Codigo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Codigo"
                                        name="codigo"
                                        defaultValue={formData.codigo}
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label align="center">
                                        Marca
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Marca"
                                        name="marca"
                                        defaultValue={formDataMaquina.marca}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Tipo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tipo"
                                        name="tipo"
                                        defaultValue={formDataMaquina.tipo}
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label align="center">
                                        Modelo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Modelo"
                                        name="modelo"
                                        defaultValue={formDataMaquina.modelo}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Descripcion de maquina
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion de maquina"
                                        name="descripcion"
                                        defaultValue={formDataMaquina.descripcion}
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label>
                                        No. serie
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero de serie"
                                        name="noSerie"
                                        defaultValue={formDataMaquina.noSerie}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Capacidad
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Capacidad"
                                        name="capacidad"
                                        defaultValue={formData.capacidad}
                                    />
                                </Col>

                                <Col sm="3">
                                    <Form.Label align="center">
                                        Fecha de adquision
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de adquision"
                                        name="fechaAdquision"
                                        defaultValue={formDataMaquina.fechaAdquisicion}
                                    />
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
        codigo: "",
        capacidad: "",
        unidades: "",
    }
}

function initialFormDataMaquina() {
    return {
        tipo: "",
        noMaquina: "",
        descripcion: "",
        marca: "",
        modelo: "",
        noSerie: "",
        fechaAdquisicion: "",

    }
}

export default RegistraInventarioMaquinas;
