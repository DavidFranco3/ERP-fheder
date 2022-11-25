import { useEffect, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import { listarDepartamento } from "../../../api/departamentos";
import { isCurpValid, isEmailValid, isRFCValid } from "../../../utils/validations";
import { toast } from "react-toastify";
import { registraUsuarios } from "../../../api/usuarios";
import Dropzone from "../../Dropzone";
import { Button, Col, Form, Row, Spinner, Container, Alert } from "react-bootstrap";
import { map } from "lodash";
import { registraClientes } from "../../../api/clientes";
import queryString from "query-string";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function RegistroClientes(props) {
    const { setRefreshCheckLogin, history } = props;

    const enrutamiento = useHistory();


    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento.push("/Clientes");
    }

    // Para almacenar la foto de perfil del usuario
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        //console.log(formData);

        //console.log(fotoUsuario)

        try {
            // Almacenamiento de la foto

            const dataTempFinal = {
                nombre: formData.nombre,
                rfc: formData.rfc,
                direccion: {
                    calle: formData.calle,
                    numeroExterior: formData.numeroExterior,
                    numeroInterior: formData.numeroInterior,
                    colonia: formData.colonia,
                    municipio: formData.municipio,
                    estado: formData.estado,
                },
                correo: formData.correo,
                telefonoCelular: formData.telefonoCelular,
                telefonoFijo: formData.telefonoFijo,
                estadoCliente: "true"
            }
            setLoading(true);

            try {
                registraClientes(dataTempFinal).then(response => {
                    const { data } = response;
                    LogsInformativos("Se ha registrado al cliente " + dataTempFinal.nombre + " " + dataTempFinal.apellidos, dataTempFinal)
                    toast.success(data.mensaje)
                    setLoading(false);
                    enrutamiento.push("/Clientes");
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
        } catch (e) {
            // console.log(e)
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <LayoutPrincipal className="RegistroClientes" paginaSeleccionada="Clientes" setRefreshCheckLogin={setRefreshCheckLogin}>
            <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Registrando cliente
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    regresaPagina()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </Col>
                    </Row>
                </Alert>
                <Container fluid>
                    <br /><br />

                    <div className="formularioDatos">
                        <Form onChange={onChange} onSubmit={onSubmit}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalNombre">
                                    <Form.Label>
                                        Nombre
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el nombre"
                                        name="nombre"
                                        defaultValue={formData.nombre}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridCorreo">
                                    <Form.Label>
                                        Correo
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Correo electronico"
                                        name="correo"
                                        defaultValue={formData.correo}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formHorizontalRFC">
                                    <Form.Label>
                                        RFC
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe el rfc"
                                        name="rfc"
                                        defaultValue={formData.rfc}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridTelefonoCelular">
                                    <Form.Label>
                                        Telefono celular
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Telefono celular"
                                        name="telefonoCelular"
                                        defaultValue={formData.telefonoCelular}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridTelefonoFijo">
                                    <Form.Label>
                                        Telefono fijo
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Numero interior"
                                        name="numeroInterior"
                                        defaultValue={formData.telefonoFijo}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Label>
                                    Datos del domicilio
                                </Form.Label>
                                <Form.Group as={Col} controlId="formHorizontalCalle">
                                    <Form.Label>
                                        Calle
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Escribe la calle"
                                        name="calle"
                                        defaultValue={formData.calle}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridNumeroExterior">
                                    <Form.Label>
                                        Numero exterior
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero exterior"
                                        name="numeroExterior"
                                        defaultValue={formData.numeroExterior}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridNumeroInterior">
                                    <Form.Label>
                                        Numero interior
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Numero interior"
                                        name="numeroInterior"
                                        defaultValue={formData.numeroInterior}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEstado">
                                    <Form.Label>
                                        Estado
                                    </Form.Label>

                                    <Form.Control as="select"
                                        defaultValue={formData.estado}
                                        name="estado"
                                    >
                                        <option>Elige una opción</option>
                                        <option value="Aguascalientes">Aguascalientes</option>
                                        <option value="Baja California">Baja California</option>
                                        <option value="Baja California Sur">Baja California Sur</option>
                                        <option value="Campeche">Campeche</option>
                                        <option value="Chiapas">Chiapas</option>
                                        <option value="Chihuahua">Chihuahua</option>
                                        <option value="CDMX">Ciudad de México</option>
                                        <option value="Coahuila">Coahuila</option>
                                        <option value="Colima">Colima</option>
                                        <option value="Durango">Durango</option>
                                        <option value="Estado de México">Estado de México</option>
                                        <option value="Guanajuato">Guanajuato</option>
                                        <option value="Guerrero">Guerrero</option>
                                        <option value="Hidalgo">Hidalgo</option>
                                        <option value="Jalisco">Jalisco</option>
                                        <option value="Michoacán">Michoacán</option>
                                        <option value="Morelos">Morelos</option>
                                        <option value="Nayarit">Nayarit</option>
                                        <option value="Nuevo León">Nuevo León</option>
                                        <option value="Oaxaca">Oaxaca</option>
                                        <option value="Puebla">Puebla</option>
                                        <option value="Querétaro">Querétaro</option>
                                        <option value="Quintana Roo">Quintana Roo</option>
                                        <option value="San Luis Potosí">San Luis Potosí</option>
                                        <option value="Sinaloa">Sinaloa</option>
                                        <option value="Sonora">Sonora</option>
                                        <option value="Tabasco">Tabasco</option>
                                        <option value="Tamaulipas">Tamaulipas</option>
                                        <option value="Tlaxcala">Tlaxcala</option>
                                        <option value="Veracruz">Veracruz</option>
                                        <option value="Yucatán">Yucatán</option>
                                        <option value="Zacatecas">Zacatecas</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridMunicipio">
                                    <Form.Label>
                                        Municipio
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Municipio"
                                        name="municipio"
                                        defaultValue={formData.municipio}
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridColonia">
                                    <Form.Label>
                                        Colonia
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Colonia"
                                        name="colonia"
                                        defaultValue={formData.colonia}
                                    />
                                </Form.Group>
                            </Row>
                            {/**/}

                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <Button
                                            type="submit"
                                            variant="success"
                                            className="registrar"
                                        >
                                            {!loading ? "Registrar" : <Spinner animation="border" />}
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant="danger"
                                            className="cancelar"
                                            onClick={() => {
                                                regresaPagina()
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </div>
                </Container>
            </LayoutPrincipal>
        </>
    );
}

function initialFormData() {
    return {
        nombre: "",
        apellidos: "",
        rfc: "",
        telefonoCelular: "",
        telefonoFijo: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        correo: "",
        tipo: ""
    }
}

export default RegistroClientes;
