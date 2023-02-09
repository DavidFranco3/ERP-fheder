import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Alert, Button, Col, Form, Row, Container, Image, Spinner } from "react-bootstrap";
import { map } from "lodash";
import { toast } from "react-toastify";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { obtenerCliente } from '../../../api/clientes';
import { actualizaEtiquetasPiezas, obtenerEtiquetasPiezas } from '../../../api/etiquetaPrimeraPieza';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import queryString from "query-string";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import BuscarMaquina from '../../../page/BuscarMaquina';
import BuscarProducto from '../../../page/BuscarProducto';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "./VistaPreviaPrimeraPieza";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaPrimeraPieza(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    // Define el uso de los parametros
    const parametros = useParams()
    const { id } = parametros

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/EtiquetaPrimeraPieza")
    }

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormDataInitial());

    // Para guardar los datos del formulario
    const [formDataMaquina, setFormDataMaquina] = useState(initialFormDataMaquinaInitial());

    // Para guardar los datos del formulario
    const [formDataProducto, setFormDataProducto] = useState(initialFormDataProductoInitial());


    useEffect(() => {
        //
        obtenerEtiquetasPiezas(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(initialFormData(data));
            setFormDataMaquina(initialFormDataMaquina(data));
            setFormDataProducto(initialFormDataProducto(data));
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

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
                rutaRegreso();

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
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Vista detallada de etiquetas de etiqueta de primera pieza
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <Container>
                <br />
                <br />
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
                                        disabled
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
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el numero de la maquina"
                                        name="noMaquina"
                                        defaultValue={formDataMaquina.noMaquina}
                                        disabled
                                    />
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
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe la descripcion del producto"
                                        name="nombreProducto"
                                        defaultValue={formDataProducto.nombreProducto}
                                        disabled
                                    />
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
                                        disabled
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
                                        disabled
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
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <div className="botones">
                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <div
                                            className="generacionPDF"
                                        >
                                            <Image
                                                src={LogoPDF}
                                                className="logoPDF"
                                                onClick={() => {
                                                    descargaPDF()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className="regreso"
                                        >
                                            <Image
                                                src={Regreso}
                                                className="regresarVistaAnterior"
                                                onClick={() => {
                                                    rutaRegreso()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>
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
        fecha: data.fecha,
        noMaquina: data.noMaquina,
        producto: data.producto,
        cliente: data.cliente,
        peso: data.peso,
        noCavidades: data.noCavidades,
        turno: data.turno,
        inspector: data.inspector,
        supervisor: data.supervisor,
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

function initialFormDataInitial() {
    return {
        fecha: "",
        noMaquina: "",
        producto: "",
        cliente: "",
        peso: "",
        noCavidades: "",
        turno: "",
        inspector: "",
        supervisor: ""
    }
}

function initialFormDataMaquinaInitial(data) {
    return {
        noMaquina: "",
    }
}

function initialFormDataProductoInitial(data) {
    return {
        nombreProducto: "",
        nombreCliente: "",
        peso: "",
        noCavidades: ""
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

export default VistaPreviaPrimeraPieza;
