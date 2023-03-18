import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { listarDepartamento } from "../../../api/departamentos";
import { isCurpValid, isEmailValid, isRFCValid } from "../../../utils/validations";
import { toast } from "react-toastify";
import { registraUsuarios } from "../../../api/usuarios";
import Dropzone from "../../Dropzone";
import { Button, Col, Form, Row, Spinner, Container, Alert } from "react-bootstrap";
import { map } from "lodash";
import { registraProveedores } from "../../../api/proveedores";
import queryString from "query-string";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";

function RegistroProveedores(props) {
    const { setRefreshCheckLogin, history } = props;

    const enrutamiento = useNavigate();

    const cierreAutomatico = () => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento("/Proveedores");
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
                tipoPersona: formData.tipoPersona,
                regimenFiscal: formData.regimenFiscal,
                sucursal: getSucursal(),
                personalContacto: formData.personalContacto,
                diasCredito: formData.diasCredito,
                direccion: {
                    calle: formData.calle,
                    numeroExterior: formData.numeroExterior,
                    numeroInterior: formData.numeroInterior,
                    colonia: formData.colonia,
                    municipio: formData.municipio,
                    estado: formData.estado,
                    pais: formData.pais,
                    codigoPostal: formData.codigoPostal
                },
                correo: formData.correo,
                telefonoCelular: formData.telefonoCelular,
                telefonoFijo: formData.telefonoFijo,
                estadoProveedor: "true"
            }
            setLoading(true);

            try {
                registraProveedores(dataTempFinal).then(response => {
                    const { data } = response;
                    LogsInformativos("Se ha registrado al proveedor " + dataTempFinal.nombre, dataTempFinal)
                    toast.success(data.mensaje)
                    setLoading(false);
                    regresaPagina();
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
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Registrando proveedor
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

                            <Form.Group as={Col} controlId="formGridCorreo">
                                <Form.Label>
                                    Tipo de persona
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    placeholder="Tipo de persona"
                                    name="tipoPersona"
                                    defaultValue={formData.tipoPersona}
                                >
                                    <option>Elige una opción</option>
                                    <option value="Fisica">Fisica</option>
                                    <option value="Moral">Moral</option>
                                </Form.Control>
                            </Form.Group>

                            {
                                formData.tipoPersona === "Moral" &&
                                (
                                    <>
                                        <Form.Group as={Col} controlId="formGridEstado">
                                            <Form.Label>
                                                Regimen fiscal
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                defaultValue={formData.regimenFiscal}
                                                name="regimenFiscal"
                                            >
                                                <option>Elige una opción</option>
                                                <option value="601-General de Ley Personas Morales">601-General de Ley Personas Morales</option>
                                                <option value="603-Personas Morales con Fines no Lucrativos">603-Personas Morales con Fines no Lucrativos</option>
                                                <option value="607-Régimen de Enajenación o Adquisición de Bienes">607-Régimen de Enajenación o Adquisición de Bienes</option>
                                                <option value="609-Consolidación">609-Consolidación</option>
                                                <option value="620-Sociedades Cooperativas de Producción que optan por Diferir sus Ingresos">620-Sociedades Cooperativas de Producción que optan por Diferir sus Ingresos</option>
                                                <option value="622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras">622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                                                <option value="623-Opcional para Grupos de Sociedades">623-Opcional para Grupos de Sociedades</option>
                                                <option value="624-Coordinados">624-Coordinados</option>
                                                <option value="628-Hidrocarburos">628-Hidrocarburos</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                )
                            }
                            
                            {
                                formData.tipoPersona === "Fisica" &&
                                (
                                    <>
                                        <Form.Group as={Col} controlId="formGridEstado">
                                            <Form.Label>
                                                Regimen fiscal
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                defaultValue={formData.regimenFiscal}
                                                name="regimenFiscal"
                                            >
                                                <option>Elige una opción</option>
                                                <option value="605-Sueldos y Salarios e Ingresos Asimilados a Salarios">605-Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                                                <option value="606-Arrendamiento">606-Arrendamiento</option>
                                                <option value="608-Demás ingresos">608-Demás ingresos</option>
                                                <option value="611-Ingresos por Dividendos (socios y accionistas)">611-Ingresos por Dividendos (socios y accionistas)</option>
                                                <option value="612-Personas Físicas con Actividades Empresariales y Profesionales">612-Personas Físicas con Actividades Empresariales y Profesionales</option>
                                                <option value="614-Ingresos por intereses">614-Ingresos por intereses</option>
                                                <option value="615-Régimen de los ingresos por obtención de premios">615-Régimen de los ingresos por obtención de premios</option>
                                                <option value="616-Sin obligaciones fiscales">616-Sin obligaciones fiscales</option>
                                                <option value="621-Incorporación Fiscal">621-Incorporación Fiscal</option>
                                                <option value="622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras">622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                                                <option value="629-De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales">629-De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales</option>
                                                <option value="630-Enajenación de acciones en bolsa de valores">630-Enajenación de acciones en bolsa de valores</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                )
                            }
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
                                    placeholder="Telefono fijo"
                                    name="telefonoFijo"
                                    defaultValue={formData.telefonoFijo}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTelefonoFijo">
                                <Form.Label>
                                    Dias de credito
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Dias de credito"
                                    name="diasCredito"
                                    defaultValue={formData.diasCredito}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTelefonoFijo">
                                <Form.Label>
                                    Personal de contacto
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Personal de contacto"
                                    name="personalContacto"
                                    defaultValue={formData.personalContacto}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label align="center">
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

                            <Form.Group as={Col} controlId="formGridNumeroInterior">
                                <Form.Label>
                                    Codigo postal
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Codigo postal"
                                    name="codigoPostal"
                                    defaultValue={formData.codigoPostal}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEstado">
                                <Form.Label>
                                    Estado
                                </Form.Label>
                                <Form.Control
                                    as="select"
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

                            <Form.Group as={Col} controlId="formGridColonia">
                                <Form.Label>
                                    Pais
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Pais"
                                    name="pais"
                                    defaultValue={formData.pais}
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
        </>
    );
}

function initialFormData() {
    return {
        nombre: "",
        apellidos: "",
        diasCredito: "",
        rfc: "",
        regimenFiscal: "",
        telefonoCelular: "",
        telefonoFijo: "",
        personalContacto: "",
        tipoPersona: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        correo: "",
        tipo: "",
        codigoPostal: ""
    }
}

export default RegistroProveedores;
