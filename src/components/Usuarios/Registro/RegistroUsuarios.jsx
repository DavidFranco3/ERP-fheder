import { useState, useEffect } from 'react';

import "./RegistroUsuarios.scss";
import {Alert, Button, Col, Form, Row, Spinner, Container} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faUsers} from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import Dropzone from "../../Dropzone";
import { useHistory } from "react-router-dom";
import {listarDepartamento} from "../../../api/departamentos";
import {map} from "lodash";
import {isCurpValid, isEmailValid, isRFCValid} from "../../../utils/validations";
import {toast} from "react-toastify";
import {registraUsuarios} from "../../../api/usuarios";
import {subeArchivosCloudinary} from "../../../api/cloudinary";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function RegistroUsuarios(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    // Ruta para enlazar a pagina de usuarios
    const regresaPagina = () => {
        enrutamiento.push("/Usuarios");
    }

    // Para almacenar la foto de perfil del usuario
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

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


    const onSubmit = e => {
        e.preventDefault();

        //console.log(formData);
        //console.log(fotoUsuario)

        if(fotoUsuario) {
            try {
                subeArchivosCloudinary(fotoUsuario, "fotoUsuario").then(response => {
                    const { data } = response;

                    // console.log(data.secure_url)

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

                    //console.log(dataTemp)

                    //console.log(dataTemp);
                    if(!isEmailValid(dataTemp.correo)) {
                        toast.warning("Debes escribir un correo valido");
                    } else if(!isRFCValid(dataTemp.rfc)) {
                        toast.warning("Debes escribir un RFC valido");
                    } else if(!isCurpValid(dataTemp.curp)) {
                        toast.warning("Debes escribir un CURP valido");
                    } else {
                        setLoading(true);

                        try {
                            registraUsuarios(dataTemp).then(response => {
                                const { data } = response;
                                LogsInformativos("Se ha registrado un nuevo usuario " + dataTemp.nombre + " " + dataTemp.apellidos)
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
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        } else {
            // Caso en que no sube foto del usuario
            const dataTemp = {
                ...formData,
                estadoUsuario: "true",
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

            //console.log(dataTemp)

            //console.log(dataTemp);
            if(!isEmailValid(dataTemp.correo)) {
                toast.warning("Debes escribir un correo valido");
            } else if(!isRFCValid(dataTemp.rfc)) {
                toast.warning("Debes escribir un RFC valido");
            } else if(!isCurpValid(dataTemp.curp)) {
                toast.warning("Debes escribir un CURP valido");
            } else {
                setLoading(true);

                try {
                    registraUsuarios(dataTemp).then(response => {
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
                            setImagen={setFotoUsuario}
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
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe el nombre"
                                    name="nombre"
                                    defaultValue={formData.nombre}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalApellidos">
                            <Form.Label>
                                Apellidos
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe los apellidos"
                                    name="apellidos"
                                    defaultValue={formData.apellidos}
                                />
                            </Col>
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formHorizontalCurp">
                            <Form.Label align="center">
                                Curp
                            </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe la curp"
                                    name="curp"
                                    defaultValue={formData.curp}
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
                                />
                            </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalDepartamento">
                            <Form.Label>
                                Departamento
                            </Form.Label>
                                <Form.Control as="select"
                                              defaultValue={formData.departamento}
                                              name="departamento"
                                >
                                    <option>Elige una opción</option>
                                    {map(departamentosregistrados, (departamento, index) => (
                                        <option key={index} value={departamento?.id}>{departamento?.nombre}</option>
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

export default RegistroUsuarios;
