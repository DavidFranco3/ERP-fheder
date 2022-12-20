import { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { listarDepartamento } from "../../../api/departamentos";
import { actualizaUsuario, obtenerUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import { isCurpValid, isEmailValid, isRFCValid } from "../../../utils/validations";
import Dropzone from "../../Dropzone";
import { Button, Col, Form, Row, Spinner, Container, Alert } from "react-bootstrap";
import { map } from "lodash";
import { actualizaCliente, obtenerCliente, registraClientes } from "../../../api/clientes";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ModificacionClientes(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    const params = useParams();

    //console.log(params)

    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento.push("/Clientes");
    }

    // Para almacenar la foto de perfil del usuario
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para validar si hay conexion a internet o la api
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            obtenerCliente(params.id).then(response => {
                const { data } = response;

                //console.log(data);
                setFormData(initialFormDataFinal(data))

            }).catch((e) => {
                //console.log(e)
                if (e.message == 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    enrutamiento.push("/Clientes");
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);


    const onSubmit = e => {
        e.preventDefault();

        //console.log(formData);

        //console.log(fotoUsuario)

        try {
            const dataTempFinal = {
                rfc: formData.rfc,
                nombre: formData.nombre,
                regimenFiscal: formData.regimenFiscal,
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
                estadoCliente: "true"
            }
            setLoading(true);

            try {
                actualizaCliente(params.id, dataTempFinal).then(response => {
                    const { data } = response;
                    LogsInformativos("Los datos del cliente " + dataTempFinal.nombre + " " + dataTempFinal.apellidos + " fueron modificados")
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
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Modificando cliente
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
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
                                    <option value="601-General de Ley Personas Morales" selected={formData.regimenFiscal === "601-General de Ley Personas Morales"}>601-General de Ley Personas Morales</option>
                                    <option value="603-Personas Morales con Fines no Lucrativos" selected={formData.regimenFiscal === "603-Personas Morales con Fines no Lucrativos"}>603-Personas Morales con Fines no Lucrativos</option>
                                    <option value="607-Régimen de Enajenación o Adquisición de Bienes" selected={formData.regimenFiscal === "607-Régimen de Enajenación o Adquisición de Bienes"}>607-Régimen de Enajenación o Adquisición de Bienes</option>
                                    <option value="609-Consolidación" selected={formData.regimenFiscal === "609-Consolidación"}>609-Consolidación</option>
                                    <option value="620-Sociedades Cooperativas de Producción que optan por Diferir sus Ingresos" selected={formData.regimenFiscal === "620-Sociedades Cooperativas de Producción que optan por Diferir sus Ingresos"}>620-Sociedades Cooperativas de Producción que optan por Diferir sus Ingresos</option>
                                    <option value="622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" selected={formData.regimenFiscal === "622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras"}>622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                                    <option value="623-Opcional para Grupos de Sociedades" selected={formData.regimenFiscal === "623-Opcional para Grupos de Sociedades"}>623-Opcional para Grupos de Sociedades</option>
                                    <option value="624-Coordinados" selected={formData.regimenFiscal === "624-Coordinado"}>624-Coordinados</option>
                                    <option value="628-Hidrocarburos" selected={formData.regimenFiscal === "628-Hidrocarburos"}>628-Hidrocarburos</option>
                                    </Form.Control>
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

                                <Form.Control as="select"
                                    defaultValue={formData.estado}
                                    name="estado"
                                >
                                    <option>Elige una opción</option>
                                    <option value="Aguascalientes" selected={formData.estado === "Aguascalientes"}>Aguascalientes</option>
                                    <option value="Baja California" selected={formData.estado === "Baja California"}>Baja California</option>
                                    <option value="Baja California Sur" selected={formData.estado === "Baja California Sur"}>Baja California Sur</option>
                                    <option value="Campeche" selected={formData.estado === "Campeche"}>Campeche</option>
                                    <option value="Chiapas" selected={formData.estado === "Chiapas"}>Chiapas</option>
                                    <option value="Chihuahua" selected={formData.estado === "Chihuahua"}>Chihuahua</option>
                                    <option value="CDMX" selected={formData.estado === "CDMX"}>Ciudad de México</option>
                                    <option value="Coahuila" selected={formData.estado === "Coahuila"}>Coahuila</option>
                                    <option value="Colima" selected={formData.estado === "Colima"}>Colima</option>
                                    <option value="Durango" selected={formData.estado === "Durango"}>Durango</option>
                                    <option value="Estado de México" selected={formData.estado === "Estado de México"}>Estado de México</option>
                                    <option value="Guanajuato" selected={formData.estado === "Guanajuato"}>Guanajuato</option>
                                    <option value="Guerrero" selected={formData.estado === "Guerrero"}>Guerrero</option>
                                    <option value="Hidalgo" selected={formData.estado === "Hidalgo"}>Hidalgo</option>
                                    <option value="Jalisco" selected={formData.estado === "Jalisco"}>Jalisco</option>
                                    <option value="Michoacán" selected={formData.estado === "Michoacán"}>Michoacán</option>
                                    <option value="Morelos" selected={formData.estado === "Morelos"}>Morelos</option>
                                    <option value="Nayarit" selected={formData.estado === "Nayarit"}>Nayarit</option>
                                    <option value="Nuevo León" selected={formData.estado === "Nuevo León"}>Nuevo León</option>
                                    <option value="Oaxaca" selected={formData.estado === "Oaxaca"}>Oaxaca</option>
                                    <option value="Puebla" selected={formData.estado === "Puebla"}>Puebla</option>
                                    <option value="Querétaro" selected={formData.estado === "Querétaro"}>Querétaro</option>
                                    <option value="Quintana Roo" selected={formData.estado === "Quintana Roo"}>Quintana Roo</option>
                                    <option value="San Luis Potosí" selected={formData.estado === "San Luis Potosí"}>San Luis Potosí</option>
                                    <option value="Sinaloa" selected={formData.estado === "Sinaloa"}>Sinaloa</option>
                                    <option value="Sonora" selected={formData.estado === "Sonora"}>Sonora</option>
                                    <option value="Tabasco" selected={formData.estado === "Tabasco"}>Tabasco</option>
                                    <option value="Tamaulipas" selected={formData.estado === "Tamaulipas"}>Tamaulipas</option>
                                    <option value="Tlaxcala" selected={formData.estado === "Tlaxcala"}>Tlaxcala</option>
                                    <option value="Veracruz" selected={formData.estado === "Veracruz"}>Veracruz</option>
                                    <option value="Yucatán" selected={formData.estado === "Yucatán"}>Yucatán</option>
                                    <option value="Zacatecas" selected={formData.estado === "Zacatecas"}>Zacatecas</option>
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

                        <Form.Group as={Row} className="botones">
                            <Row>
                                <Col>
                                    <Button
                                        type="submit"
                                        title="Actualizar registro"
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
        curp: "",
        nss: "",
        rfc: "",
        regimenFiscal: "",
        telefonoCelular: "",
        telefonoFijo: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        codigoPostal: "",
        departamento: "",
        correo: "",
        password: "",
        repitePassword: ""
    }
}

function initialFormDataFinal(data) {
    const { nombre, apellidos, curp, nss, rfc, regimenFiscal, telefonoCelular, telefonoFijo, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, departamento, correo, password, tipo } = data;

    return {
        nombre: nombre,
        apellidos: apellidos,
        curp: curp,
        nss: nss,
        rfc: rfc,
        regimenFiscal: regimenFiscal,
        telefonoCelular: telefonoCelular,
        telefonoFijo: telefonoFijo,
        calle: calle,
        numeroExterior: numeroExterior,
        numeroInterior: numeroInterior,
        colonia: colonia,
        municipio: municipio,
        estado: estado,
        pais: pais,
        codigoPostal: codigoPostal,
        departamento: departamento,
        correo: correo,
        tipo: tipo,
        password: password,
        repitePassword: password
    }
}

function formatModelDepartamentos(data) {
    const tempDepartamentos = []
    data.forEach((data) => {
        tempDepartamentos.push({
            id: data.id,
            nombre: data.nombre
        });
    });
    return tempDepartamentos;
}

function formatModelUsuarios(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            curp: data.curp,
            nss: data.nss,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            telefonoFijo: data.telefonoFijo,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            departamento: data.departamento,
            correo: data.correo,
            password: data.password,
            foto: data.foto,
            estadoUsuario: data.estadoUsuario,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default ModificacionClientes;
