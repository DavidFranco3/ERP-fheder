import { useEffect, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory, useParams } from "react-router-dom";
import { listarDepartamento } from "../../../api/departamentos";
import { actualizaUsuario, obtenerUsuario } from "../../../api/usuarios";
import { toast } from "react-toastify";
import { isCurpValid, isEmailValid, isRFCValid } from "../../../utils/validations";
import Dropzone from "../../Dropzone";
import { Button, Col, Form, Row, Spinner, Container } from "react-bootstrap";
import { map } from "lodash";
import { actualizaCliente, obtenerCliente, registraClientes } from "../../../api/clientes";
import { subeArchivosCloudinary } from "../../../api/cloudinary";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

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
                nombre: formData.nombre,
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
            <LayoutPrincipal className="ModificacionClientes" paginaSeleccionada="Clientes" setRefreshCheckLogin={setRefreshCheckLogin}>
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
                                        <option value="Aguascalientes" selected={formData.estado === ""}>Aguascalientes</option>
                                        <option value="Baja California" selected={formData.estado === ""}>Baja California</option>
                                        <option value="Baja California Sur" selected={formData.estado === ""}>Baja California Sur</option>
                                        <option value="Campeche" selected={formData.estado === ""}>Campeche</option>
                                        <option value="Chiapas" selected={formData.estado === ""}>Chiapas</option>
                                        <option value="Chihuahua" selected={formData.estado === ""}>Chihuahua</option>
                                        <option value="CDMX" selected={formData.estado === ""}>Ciudad de México</option>
                                        <option value="Coahuila" selected={formData.estado === ""}>Coahuila</option>
                                        <option value="Colima" selected={formData.estado === ""}>Colima</option>
                                        <option value="Durango" selected={formData.estado === ""}>Durango</option>
                                        <option value="Estado de México" selected={formData.estado === ""}>Estado de México</option>
                                        <option value="Guanajuato" selected={formData.estado === ""}>Guanajuato</option>
                                        <option value="Guerrero" selected={formData.estado === ""}>Guerrero</option>
                                        <option value="Hidalgo" selected={formData.estado === ""}>Hidalgo</option>
                                        <option value="Jalisco" selected={formData.estado === ""}>Jalisco</option>
                                        <option value="Michoacán" selected={formData.estado === ""}>Michoacán</option>
                                        <option value="Morelos" selected={formData.estado === ""}>Morelos</option>
                                        <option value="Nayarit" selected={formData.estado === ""}>Nayarit</option>
                                        <option value="Nuevo León" selected={formData.estado === ""}>Nuevo León</option>
                                        <option value="Oaxaca" selected={formData.estado === ""}>Oaxaca</option>
                                        <option value="Puebla" selected={formData.estado === ""}>Puebla</option>
                                        <option value="Querétaro" selected={formData.estado === "Querétaro"}>Querétaro</option>
                                        <option value="Quintana Roo" selected={formData.estado === ""}>Quintana Roo</option>
                                        <option value="San Luis Potosí" selected={formData.estado === ""}>San Luis Potosí</option>
                                        <option value="Sinaloa" selected={formData.estado === ""}>Sinaloa</option>
                                        <option value="Sonora" selected={formData.estado === ""}>Sonora</option>
                                        <option value="Tabasco" selected={formData.estado === ""}>Tabasco</option>
                                        <option value="Tamaulipas" selected={formData.estado === ""}>Tamaulipas</option>
                                        <option value="Tlaxcala" selected={formData.estado === ""}>Tlaxcala</option>
                                        <option value="Veracruz" selected={formData.estado === ""}>Veracruz</option>
                                        <option value="Yucatán" selected={formData.estado === ""}>Yucatán</option>
                                        <option value="Zacatecas" selected={formData.estado === ""}>Zacatecas</option>
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

                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <Button
                                            type="submit"
                                            variant="success"
                                            className="registrar"
                                        >
                                            {!loading ? "Actualizar" : <Spinner animation="border" />}
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
        curp: "",
        nss: "",
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
        departamento: "",
        correo: "",
        password: "",
        repitePassword: ""
    }
}

function initialFormDataFinal(data) {
    const { nombre, apellidos, curp, nss, rfc, telefonoCelular, telefonoFijo, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais }, departamento, correo, password, tipo } = data;

    return {
        nombre: nombre,
        apellidos: apellidos,
        curp: curp,
        nss: nss,
        rfc: rfc,
        telefonoCelular: telefonoCelular,
        telefonoFijo: telefonoFijo,
        calle: calle,
        numeroExterior: numeroExterior,
        numeroInterior: numeroInterior,
        colonia: colonia,
        municipio: municipio,
        estado: estado,
        pais: pais,
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
