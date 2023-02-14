import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { obtenerCliente } from '../../../api/clientes';
import { registraEtiquetaPieza, obtenerNoEtiqueta } from '../../../api/etiquetaPrimeraPieza'
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BuscarMaquina from '../../../page/BuscarMaquina';
import BuscarProducto from '../../../page/BuscarProducto';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function RegistraReporte(props) {
    const { setShowModal, history } = props;

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [formDataMaquina, setFormDataMaquina] = useState(initialFormDataMaquina());

    // Para guardar los datos del formulario
    const [formDataProducto, setFormDataProducto] = useState(initialFormDataProducto());

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

    // Para almacenar el listado de productos activos
    const [listProductosActivos, setListProductosActivos] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarMatrizProductosActivos(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProductosActivos && data) {
                    setListProductosActivos(formatModelMatrizProductos(data));
                } else {
                    const datosProductos = formatModelMatrizProductos(data);
                    setListProductosActivos(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

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

    useEffect(() => {
        try {
            obtenerCliente(productoSeleccionado?.cliente).then(response => {
                const { data } = response;
                const { nombre, apellidos } = data;
                setNombreCliente(nombre + " " + apellidos)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formData.producto]);

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formDataMaquina.noMaquina || !formDataProducto.nombreProducto || !formData.inspector || !formData.supervisor || !formData.turno) {
            toast.warning("Completa el formulario")
        } else {

            setLoading(true)
            // Realiza registro de la aportación
            obtenerNoEtiqueta().then(response => {
                const { data } = response;
                const { noEtiqueta } = data;

                const dataTemp = {
                    folio: noEtiqueta,
                    fecha: fechaActual,
                    noMaquina: formDataMaquina.noMaquina,
                    descripcionProducto: formDataProducto.nombreProducto,
                    cliente: formDataProducto.nombreCliente,
                    peso: formDataProducto.peso,
                    noCavidades: formDataProducto.noCavidades,
                    sucursal: getSucursal(),
                    turno: formData.turno,
                    inspector: formData.inspector,
                    supervisor: formData.supervisor,
                    estado: "true"
                }

                registraEtiquetaPieza(dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("Nueva primera pieza registrada " + dataTemp.folio, dataTemp)
                    toast.success(data.mensaje)
                    setTimeout(() => {
                        setLoading(false)
                        history({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }, 0)

                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataMaquina({ ...formDataMaquina, [e.target.name]: e.target.value });
        setFormDataProducto({ ...formDataProducto, [e.target.name]: e.target.value });
    }

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaActual, setFechaActual] = useState(fecha);

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
                                        value={fechaActual}
                                        onChange={e => setFechaActual(e.target.value)}
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
                                        <option value="1">1</option>
                                        <option value="2">2</option>
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
        fecha: "",
        noMaquina: "",
        producto: "",
        turno: "",
        inspector: "",
        supervisor: ""
    }
}

function initialFormDataMaquina() {
    return {
        noMaquina: "",
    }
}

function initialFormDataProducto() {
    return {
        nombreProducto: "",
        nombreCliente: "",
        peso: "",
        noCavidades: "",
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
