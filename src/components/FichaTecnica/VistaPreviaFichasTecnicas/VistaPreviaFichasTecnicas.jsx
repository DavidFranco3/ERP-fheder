import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner, Image, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import "./VistaPreviaFichasTecnicas.scss";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { toast } from "react-toastify";
import { actualizaEstadoFichasTecnicas, actualizaFichasTecnicas, obtenerFichasTecnicas } from "../../../api/fichasTecnicas";
import { map } from "lodash";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaFichasTecnicas(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }
    
    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

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

    const params = useParams();
    const { id } = params

    // Para guardar los datos del formulario
    const [formData, setFormData] = useState(initialFormDataInitial());
    const [listFichasCargadas, setListFichasCargadas] = useState([]);

    useEffect(() => {
        //
        obtenerFichasTecnicas(id).then(response => {
            const { data } = response;
            //console.log(data)
            setFormData(initialFormData(data))
            // setFechaCreacion(fechaElaboracion)
            setListFichasCargadas(data.fichas)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento("/FichaTecnica")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const [cargaFichas, setCargaFichas] = useState(initialFormDataFichas());

    const addItems = () => {
        const propiedades = document.getElementById("propiedades").value
        const especificaciones = document.getElementById("especificaciones").value
        const tolerancia = document.getElementById("tolerancia").value
        const unidad = document.getElementById("unidad").value
        const referencia = document.getElementById("referencia").value

        if (!propiedades || !especificaciones || !tolerancia || !unidad || !referencia) {
            toast.warning("Completa la información de la ficha");
        } else {
            const dataTemp = {
                propiedades: propiedades,
                especificaciones: especificaciones,
                tolerancia: tolerancia,
                unidad: unidad,
                referencia: referencia
            }
            // console.log(dataTemp)

            setListFichasCargadas(
                [...listFichasCargadas, dataTemp]
            );

            //document.getElementById("descripcion").value = ""
            document.getElementById("propiedades").value = ""
            document.getElementById("especificaciones").value = ""
            document.getElementById("tolerancia").value = ""
            document.getElementById("unidad").value = ""
            document.getElementById("referencia").value = ""
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //document.getElementById("descripcion").value = ""
        document.getElementById("propiedades").value = ""
        document.getElementById("especificaciones").value = ""
        document.getElementById("tolerancia").value = ""
        document.getElementById("unidad").value = ""
        document.getElementById("referencia").value = ""
    }

    // Para eliminar productos del listado
    const removeItem = (ficha) => {
        let newArray = listFichasCargadas;
        newArray.splice(newArray.findIndex(a => a.propiedades === ficha.propiedades), 1);
        setListFichasCargadas([...newArray]);
    }

    const onSubmit = e => {
        e.preventDefault();
        console.log(e)

        if (!formData.descripcionMaterial || !formData.realizo || !formData.fecha || !formData.autorizo) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);

            const dataTemp = {
                descripcion: formData.descripcionMaterial,
                fechaElaboracion: formData.fecha,
                realizo: formData.realizo,
                autorizo: formData.autorizo,
                fichas: listFichasCargadas,
            }
            // console.log(dataTemp)

            // Modificar el pedido creado recientemente
            actualizaFichasTecnicas(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                // Log acerca del registro inicial del tracking
                LogsInformativos("Se han actualizado la ficha tecnica con folio " + formData.folio, dataTemp)
                // Registro inicial del tracking
                rutaRegreso();
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    console.log(formData)

    const renglon = listFichasCargadas.length + 1;

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Detalles de la ficha tecnica
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

            <br />

            <Container fluid>
                <br />
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Descripcion de material
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion de material"
                                        name="descripcionMaterial"
                                        defaultValue={formData.descripcionMaterial}
                                        disabled
                                    />
                                </Col>

                                <Col sm="2">
                                    <Form.Label>
                                        Realizo
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Realizo"
                                        name="realizo"
                                        defaultValue={formData.realizo}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Fecha de elaboración
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                        defaultValue={formData.fecha}
                                        disabled
                                    />
                                </Col>

                                <Col sm="2">
                                    <Form.Label>
                                        Autorizó
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Autorizó"
                                        name="autorizo"
                                        defaultValue={formData.autorizo}
                                        disabled
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        {/* Listado de productos  */}
                        <div className="tablaProductos">

                            {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                            {/* Inicia tabla informativa  */}
                            <Badge bg="secondary" className="tituloFormularioDetalles">
                                <h4>Listado de Fichas agregadas</h4>
                            </Badge>
                            <br />
                            <hr />
                            <table className="responsive-tableRegistroVentas"
                            >
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Propiedades</th>
                                        <th scope="col">Especificaciones</th>
                                        <th scope="col">Tolerancia</th>
                                        <th scope="col">Unidad</th>
                                        <th scope="col">Referencia</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                </tfoot>
                                <tbody>
                                    {map(listFichasCargadas, (producto, index) => (
                                        <tr key={index}>
                                            <th scope="row">
                                                {index + 1}
                                            </th>
                                            <td data-title="Descripcion">
                                                {producto.propiedades}
                                            </td>
                                            <td data-title="Material">
                                                {producto.especificaciones}
                                            </td>
                                            <td data-title="UM">
                                                {producto.tolerancia}
                                            </td>
                                            <td data-title="Descripción">
                                                {producto.unidad}
                                            </td>
                                            <td data-title="Descripción">
                                                {producto.referencia}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <br/>

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
        </>
    );
}

function initialFormDataInitial() {
    return {
        folio: "",
        descripcionMaterial: "",
        realizo: "",
        fecha: "",
        autorizo: ""
    }
}

function initialFormData(data) {
    return {
        folio: data.folio,
        descripcionMaterial: data.descripcion,
        realizo: data.realizo,
        fecha: data.fechaElaboracion,
        autorizo: data.autorizo
    }
}

function initialFormDataFichas() {
    return {
        propiedades: "",
        especificaciones: "",
        tolerancia: "",
        unidad: "",
        referencia: "",
    }
}

export default VistaPreviaFichasTecnicas;
