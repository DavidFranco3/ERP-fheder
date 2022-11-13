import {useEffect, useState} from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory, useParams } from "react-router-dom";
import {listarDepartamento} from "../../../api/departamentos";
import {isCurpValid, isEmailValid, isRFCValid} from "../../../utils/validations";
import {toast} from "react-toastify";
import {actualizaUsuario, listarUsuarios, obtenerUsuario, registraUsuarios} from "../../../api/usuarios";
import Dropzone from "../../Dropzone";
import {Button, Col, Form, Row, Spinner, Container} from "react-bootstrap";
import {map} from "lodash";
import {subeArchivosCloudinary} from "../../../api/cloudinary";

function ModificacionUsuarios(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    const params = useParams();

    //console.log(params)

    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento.push("/Usuarios");
    }

    // Para almacenar la foto de perfil del usuario
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Para alamacenar los datos del usuario
    const [listDatosUsuario, setListDatosUsuario] = useState(null);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para validar si hay conexion a internet o la api
    const [conexionInternet, setConexionInternet] = useState(true);

    // Para almacenar los departamentos registrados
    const [departamentosregistrados, setDepartamentosregistrados] = useState(null);

    // Para almacenar los municipios del estado
    const [municipiosEstado, setMunicipiosEstado] = useState(null);

    // Para el icono de cargando del boton
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            listarDepartamento().then(response => {
                const { data } = response;
                //console.log(data)
                const dataTemp = formatModelDepartamentos(data);
                //console.log(data)
                setDepartamentosregistrados(dataTemp);
            })
        } catch (e) {

        }
    }, []);

    useEffect(() => {
        try {
            obtenerUsuario(params.id).then(response => {
                const { data } = response;

                //console.log(data);
                setFormData(initialFormDataFinal(data))

            }).catch((e) => {
                //console.log(e)
                if(e.message == 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
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

        if(fotoUsuario) {
            // Caso en que se sube una nueva foto del usuario
            subeArchivosCloudinary(fotoUsuario, "fotoUsuario").then(response => {
                const { data } = response;

                console.log(data.secure_url)
                const dataTemp = {
                    ...formData,
                    estadoUsuario: "true",
                    foto: data.secure_url,
                    direccion: {
                        calle: formData.calle,
                        numeroExterior: formData.numeroExterior,
                        colonia: formData.colonia,
                        municipio: formData.municipio,
                        estado: formData.estado,
                        pais: formData.pais
                    }
                }
                delete dataTemp.calle;
                delete dataTemp.numeroExterior;
                delete dataTemp.colonia;
                delete dataTemp.municipio;
                delete dataTemp.estado;
                delete dataTemp.pais;
                delete dataTemp.repitePassword;

                console.log(dataTemp)
                if(!isEmailValid(dataTemp.correo)) {
                    toast.warning("Debes escribir un correo valido");
                } else if(!isRFCValid(dataTemp.rfc)) {
                    toast.warning("Debes escribir un RFC valido");
                } else if(!isCurpValid(dataTemp.curp)) {
                    toast.warning("Debes escribir un CURP valido");
                } else {
                    setLoading(true);

                    try {
                        actualizaUsuario(params.id, dataTemp).then(response => {
                            const { data } = response;

                            toast.success(data.mensaje)
                            setLoading(false);
                            enrutamiento.push("/Colaboradores");
                        }).catch(e => {
                            console.log(e)
                            if(e.message == 'Network Error') {
                                //console.log("No hay internet")
                                toast.error("Conexión al servidor no disponible");
                                setLoading(false);
                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        } else {
            // Caso en que no sube foto del usuario
            const dataTemp = {
                ...formData,
                estadoUsuario: "true",
                foto: formData.foto,
                direccion: {
                    calle: formData.calle,
                    numeroExterior: formData.numeroExterior,
                    colonia: formData.colonia,
                    municipio: formData.municipio,
                    estado: formData.estado,
                    pais: formData.pais
                }
            }
            delete dataTemp.calle;
            delete dataTemp.numeroExterior;
            delete dataTemp.colonia;
            delete dataTemp.municipio;
            delete dataTemp.estado;
            delete dataTemp.pais;
            delete dataTemp.repitePassword;

            console.log(dataTemp);
            if(!isEmailValid(dataTemp.correo)) {
                toast.warning("Debes escribir un correo valido");
            } else if(!isRFCValid(dataTemp.rfc)) {
                toast.warning("Debes escribir un RFC valido");
            } else if(!isCurpValid(dataTemp.curp)) {
                toast.warning("Debes escribir un CURP valido");
            } else {
                setLoading(true);

                try {
                    actualizaUsuario(params.id, dataTemp).then(response => {
                        const { data } = response;

                        toast.success(data.mensaje)
                        setLoading(false);
                        enrutamiento.push("/Colaboradores");
                    }).catch(e => {
                        console.log(e)
                        if(e.message == 'Network Error') {
                            //console.log("No hay internet")
                            toast.error("Conexión al servidor no disponible");
                            setLoading(false);
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            }
        }

    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <>
            <LayoutPrincipal className="RegistroUsuarios" paginaSeleccionada="Usuarios" setRefreshCheckLogin={setRefreshCheckLogin}>
                <Container>
                <div className="subeFotoPerfil">
                    <h4 className="textoFotoPerfil">Sube la foto de perfil</h4>
                    <div className="fotoPerfil">
                        <Dropzone
                            setImagen={setFotoUsuario} imagenBD={formData.foto}
                        />
                    </div>
                </div>

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
                                    required
                                />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalApellidos">
                            <Form.Label>
                                Apellidos
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe los apellidos"
                                    name="apellidos"
                                    defaultValue={formData.apellidos}
                                    required
                                />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalCurp">
                            <Form.Label>
                                Curp
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe la curp"
                                    name="curp"
                                    defaultValue={formData.curp}
                                    required
                                />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalNSS">
                            <Form.Label>
                                NSS
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe el nss"
                                    name="nss"
                                    defaultValue={formData.nss}
                                    required
                                />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalRFC">
                            <Form.Label>
                                RFC
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe el rfc"
                                    name="rfc"
                                    defaultValue={formData.rfc}
                                    required
                                />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalTelefonoCelular">
                            <Form.Label>
                                Teléfono celular
                            </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Numero de teléfono"
                                    name="telefonoCelular"
                                    defaultValue={formData.telefonoCelular}
                                    required
                                />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalTelefonoFijo">
                            <Form.Label>
                                Teléfono fijo
                            </Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Numero de teléfono"
                                    name="telefonoFijo"
                                    defaultValue={formData.telefonoFijo}
                                />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3">
                        <Form.Label align="center">
                            Datos del domicilio
                        </Form.Label>
                        <Form.Group as={Col} className="mb-3" controlId="formHorizontalCalle">
                            <Form.Label>
                                Calle
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe la calle"
                                    name="calle"
                                    defaultValue={formData.calle}
                                    required
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
                                    required
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
                                              required
                                >
                                    <option>Elige una opción</option>
                                    <option value="Aguascalientes" selected={formData.estado === "Aguascalientes"}>Aguascalientes</option>
                                    <option value="Baja California" selected={formData.estado === "Baja California"}>Baja California</option>
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
                                    required
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
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">

                            <Form.Group as={Col} controlId="formGridPais">
                                <Form.Label>
                                    Pais
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Pais"
                                    name="pais"
                                    defaultValue={formData.pais}
                                    required
                                />
                            </Form.Group>
                            
                            <Form.Group as={Col} controlId="formHorizontalDepartamento">
                            <Form.Label>
                                Departamento
                            </Form.Label>
                                <Form.Control as="select"
                                              defaultValue={formData.departamento}
                                              name="departamento"
                                              required
                                >
                                    <option>Elige una opción</option>
                                    {map(departamentosregistrados, (departamento, index) => (
                                        <option key={index} value={departamento?.id} selected={formData.departamento === departamento?.nombre}>{departamento?.nombre}</option>
                                    ))}
                                </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalCorreo">
                            <Form.Label>
                                Correo
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Correo electronico"
                                    name="correo"
                                    defaultValue={formData.correo}
                                    required
                                />
                        </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>
                                    Contraseña
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Contraseña"
                                    name="password"
                                    defaultValue={formData.password}
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridRepitePassword">
                                <Form.Label>
                                    Repite la contraseña
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repite la contraseña"
                                    name="repitePassword"
                                    defaultValue={formData.repitePassword}
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
    const { nombre, apellidos, curp, nss, rfc, telefonoCelular, telefonoFijo, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais }, departamento, foto, correo, password } = data;

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
        foto: foto,
        departamento: departamento,
        correo: correo,
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

export default ModificacionUsuarios;
