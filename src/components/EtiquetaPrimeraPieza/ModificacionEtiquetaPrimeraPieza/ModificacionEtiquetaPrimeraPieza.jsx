import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { obtenerCliente } from '../../../api/clientes';
import { actualizaEtiquetasPiezas } from '../../../api/etiquetaPrimeraPieza'
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BuscarMaquina from '../../../page/BuscarMaquina';
import BuscarProducto from '../../../page/BuscarProducto';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function RegistraReporte(props) {
    const { data, setShowModal, history } = props;

    const { id, descripcionProducto } = data;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData(data));

    // Para guardar los datos del formulario
    const [formDataMaquina, setFormDataMaquina] = useState(initialFormDataMaquina(data));

    // Para guardar los datos del formulario
    const [formDataProducto, setFormDataProducto] = useState(initialFormDataProducto(data));

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

    // Para la eliminacion fisica de usuarios
    const buscarProducto = (content) => {
        setTitulosModal("Buscar producto");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para almacenar la materia prima seleccionada
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);

    const handleProducto = (producto) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = producto.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setProductoSeleccionado({
            id: temp[0],
            cliente: temp[1],
            peso: temp[2],
            noCavidades: temp[3]
        })
    }

    const [nombreCliente, setNombreCliente] = useState("");

    const cargarDatosProductos = () => {
        try {
            obtenerCliente(productoSeleccionado != "" ? productoSeleccionado?.cliente : formData.cliente).then(response => {
                const { data } = response;
                const { nombre, apellidos } = data;
                setNombreCliente(nombre + " " + apellidos)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
       cargarDatosProductos();
    }, [formData.producto]);

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);


    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.fecha || !formDataMaquina.noMaquina || !formData.inspector || !formData.supervisor || !formData.turno) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación

            const dataTemp = {
                fecha: formData.fecha,
                noMaquina: formDataMaquina.noMaquina,
                descripcionProducto: formDataProducto.nombreProducto,
                cliente: formDataProducto.nombreCliente,
                peso: formDataProducto.peso,
                noCavidades: formDataProducto.noCavidades,
                turno: formData.turno,
                inspector: formData.inspector,
                supervisor: formData.supervisor
            }

            actualizaEtiquetasPiezas(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Informacion de la primera pieza actualizada " + id, dataTemp)
                toast.success(data.mensaje);
                history({
                    search: queryString.stringify(""),
                });
                setShowModal(false)

            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Fecha
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Escribe la fecha"
                                        name="fecha"
                                        defaultValue={formData.fecha}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        No. Maquina
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el numero de la maquina"
                                            name="noMaquina"
                                            defaultValue={formDataMaquina.noMaquina}
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre las maquinas"
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
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Descripcion producto
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <div className="flex items-center mb-1">
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe la descripcion del producto"
                                            name="nombreProducto"
                                            defaultValue={formDataProducto.nombreProducto}
                                        />
                                        <FontAwesomeIcon
                                            className="cursor-pointer py-2 -ml-6"
                                            title="Buscar entre los productos"
                                            icon={faSearch}
                                            onClick={() => {
                                                buscarProducto(
                                                    <BuscarProducto
                                                        formData={formDataProducto}
                                                        setFormData={setFormDataProducto}
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
                                    <Form.Label>
                                        Cliente
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el numero el nombre del cliente"
                                        name="nombreCliente"
                                        value={formDataProducto.nombreCliente}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Peso
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        placeholder="Escribe el peso del producto"
                                        name="peso"
                                        value={formDataProducto.peso}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        No. Cavidades
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Escribe el numero de cavidades"
                                        name="numeroCavidades"
                                        value={formDataProducto.noCavidades}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Turno
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        as="select"
                                        placeholder="Escribe el nombre del inspector"
                                        name="turno"
                                        defaultValue={formData.turno}
                                    >
                                        <option >Elige....</option>
                                        <option value="1" selected={formData.turno == "1"}>1</option>
                                        <option value="2" selected={formData.turno == "2"}>2</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Inspector
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el nombre del inspector"
                                        name="inspector"
                                        defaultValue={formData.inspector}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label>
                                        Supervisor
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el nombre del supervisor"
                                        name="supervisor"
                                        defaultValue={formData.supervisor}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Actualizar el registro"
                                    variant="success"
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

    const { fecha, noMaquina, producto, cliente, peso, noCavidades, turno, inspector, supervisor } = data;

    return {
        fecha: fecha,
        noMaquina: noMaquina,
        producto: producto,
        cliente: cliente,
        peso: peso,
        noCavidades: noCavidades,
        turno: turno,
        inspector: inspector,
        supervisor: supervisor,
    }
}

function initialFormDataMaquina(data) {
    return {
        noMaquina: data.noMaquina,
    }
}

function initialFormDataProducto(data) {
    return {
        nombreProducto: data.descripcionProducto,
        nombreCliente: data.cliente,
        peso: data.peso,
        noCavidades: data.noCavidades,
    }
}

function formatModelMatrizProductos(data) {
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data.noInterno,
            cliente: data.cliente,
            datosMolde: data.datosMolde,
            noParte: data.noParte,
            descripcion: data.descripcion,
            datosPieza: data.datosPieza,
            materiaPrima: data.materiaPrima,
            pigmentoMasterBach: data.pigmentoMasterBach,
            tiempoCiclo: data.tiempoCiclo,
            noOperadores: data.noOperadores,
            piezasxHora: data.piezasxHora,
            piezasxTurno: data.piezasxTurno,
            materialEmpaque: data.materialEmpaque,
            opcionMaquinaria: data.opcionMaquinaria,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistraReporte;
