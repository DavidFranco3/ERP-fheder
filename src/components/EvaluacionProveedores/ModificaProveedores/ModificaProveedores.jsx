import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Form, Row, Spinner, Alert, Container, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { actualizaEvaluacionProveedores, obtenerEvaluacionProveedores } from "../../../api/evaluacionProveedores";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft, faSearch, faCirclePlus, faX } from "@fortawesome/free-solid-svg-icons";
import BuscarProveedor from '../../../page/BuscarProveedor';
import BuscarProducto from '../../../page/BuscarProducto';
import BuscarMaterial from "../../../page/BuscarMaterial";
import BasicModal from "../../Modal/BasicModal";
import { map } from "lodash";

function ModificaProveedores(props) {
    const { setRefreshCheckLogin } = props;

    const enrutamiento = useNavigate();

    const params = useParams();
    const { id } = params;

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
        enrutamiento("/EvaluacionProveedores");
    }
    // Para almacenar la informacion
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(initialProveedor());

    const [listProductosCargados, setListProductosCargados] = useState([]);

    // Para guardar los datos del formulario
    const [formDataOC, setFormDataOC] = useState(initialFormDataOC());

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarProveedor = (content) => {
        setTitulosModal("Buscar proveedor");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarMaterial = (content) => {
        setTitulosModal("Buscar material");
        setContentModal(content);
        setShowModal(true);
    }

    // Para validar si hay conexion a internet o la api
    const [conexionInternet, setConexionInternet] = useState(true);

    const cargarDatosEvaluacion = () => {
        try {
            obtenerEvaluacionProveedores(id).then(response => {
                const { data } = response;

                console.log(data.diasCredito);

                //console.log(data);
                setFormData(initialFormDataFinal(data));
                setListProductosCargados(data.productos);
                setProveedorSeleccionado(initialProveedorFinal(data));

            }).catch((e) => {
                //console.log(e)
                if (e.message == 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión a Internet no Disponible");
                    regresaPagina();
                    setConexionInternet(false);
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    console.log(formData);

    useEffect(() => {
        cargarDatosEvaluacion();
    }, []);

    // Para agregar productos al listado
    const addItems = () => {
        const folio = document.getElementById("folio").value
        const descripcion = document.getElementById("descripcion").value
        const um = document.getElementById("um").value

        if (!um) {
            toast.warning("Completa la informacion del producto");
        } else {
            const temp = descripcion.split("/");

            const dataTemp = {
                folio: folio,
                um: um,
                descripcion: descripcion,
            }
            // console.log(dataTemp)

            setListProductosCargados(
                [...listProductosCargados, dataTemp]
            );

            // Actualizacion del tracking
            //LogTrackingActualizacion(referencia, "En orden de compra", "3")

            //setCargaProductos(initialFormDataProductos)
            setFormDataOC(initialFormDataOC)
            //document.getElementById("descripcion").value = "Elige una opción"
            //setCargaProductos(initialFormDataProductos)
            //document.getElementById("cantidad").value = "0"

        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaProducto = () => {
        //setCargaProductos(initialFormDataProductos)
        setFormDataOC(initialFormDataOC)
        document.getElementById("descripcion").value = "Elige una opción"
        //setCargaProductos(initialFormDataProductos)
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.descripcion === producto.descripcion), 1);
        setListProductosCargados([...newArray]);
    }
    // Termina gestión de los articulos cargados

    const renglon = listProductosCargados.length + 1;

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.tiempoCredito || !formData.tiempoRespuesta || !formData.lugarRecoleccion || !formData.horario || !formData.comentarios) {
            toast.warning("Completa el formulario");
        } else {
            const dataTemp = {
                nombre: formData.nombre,
                rfc: formData.rfc,
                tipoPersona: formData.tipoPersona,
                regimenFiscal: formData.regimenFiscal,
                tipoPersona: formData.tipoPersona,
                regimenFiscal: formData.regimenFiscal,
                productoServicio: formData.productoServicio,
                personalContacto: formData.personalContacto,
                telefonoCelular: formData.telefonoCelular,
                telefonoFijo: formData.telefonoFijo,
                correo: formData.correo,
                diasCredito: formData.tiempoCredito,
                tiempoRespuesta: formData.tiempoRespuesta,
                lugarRecoleccion: formData.lugarRecoleccion,
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
                horario: formData.horario,
                productos: listProductosCargados,
                servicioProporcionado: formData.servicioProporcionado,
                comentarios: formData.comentarios,
            }

            setLoading(true)
            try {
                actualizaEvaluacionProveedores(id, dataTemp).then(response => {
                    const { data } = response;
                    toast.success(data.mensaje)
                    LogsInformativos("Se ha modificado la información del proveedor " + formData.nombre, dataTemp)
                    setLoading(false)
                    regresaPagina();
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setProveedorSeleccionado({ ...proveedorSeleccionado, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Modificando el proveedor
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
                        {/* ID proveedor, nombre/servicio, tipo */}

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridFolio">
                                <Form.Label>
                                    Folio
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="folio"
                                    defaultValue={formData.folio}
                                    disabled
                                />
                            </Form.Group>
                        </Row>

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
                                    <option value="Fisica" selected={formData.tipoPersona === "Fisica"}>Fisica</option>
                                    <option value="Moral" selected={formData.tipoPersona === "Moral"}>Moral</option>
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
                                                <option value="605-Sueldos y Salarios e Ingresos Asimilados a Salarios" selected={formData.regimenFiscal === "605-Sueldos y Salarios e Ingresos Asimilados a Salarios"}>605-Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                                                <option value="606-Arrendamiento" selected={formData.regimenFiscal === "606-Arrendamiento"}>606-Arrendamiento</option>
                                                <option value="608-Demás ingresos" selected={formData.regimenFiscal === "608-Demás ingresos"}>608-Demás ingresos</option>
                                                <option value="611-Ingresos por Dividendos (socios y accionistas)" selected={formData.regimenFiscal === "611-Ingresos por Dividendos (socios y accionistas)"}>611-Ingresos por Dividendos (socios y accionistas)</option>
                                                <option value="612-Personas Físicas con Actividades Empresariales y Profesionales" selected={formData.regimenFiscal === "612-Personas Físicas con Actividades Empresariales y Profesionales"}>612-Personas Físicas con Actividades Empresariales y Profesionales</option>
                                                <option value="614-Ingresos por intereses" selected={formData.regimenFiscal === "614-Ingresos por intereses"}>614-Ingresos por intereses</option>
                                                <option value="615-Régimen de los ingresos por obtención de premios" selected={formData.regimenFiscal === "615-Régimen de los ingresos por obtención de premios"}>615-Régimen de los ingresos por obtención de premios</option>
                                                <option value="616-Sin obligaciones fiscales" selected={formData.regimenFiscal === "616-Sin obligaciones fiscales"}>616-Sin obligaciones fiscales</option>
                                                <option value="621-Incorporación Fiscal" selected={formData.regimenFiscal === "621-Incorporación Fiscal"}>621-Incorporación Fiscal</option>
                                                <option value="622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" selected={formData.regimenFiscal === "622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras"}>622-Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                                                <option value="629-De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales" selected={formData.regimenFiscal === "629-De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales"}>629-De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales</option>
                                                <option value="630-Enajenación de acciones en bolsa de valores" selected={formData.regimenFiscal === "630-Enajenación de acciones en bolsa de valores"}>630-Enajenación de acciones en bolsa de valores</option>
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

                            <Form.Group as={Col} controlId="formGridHorario">
                                <Form.Label>
                                    Horario
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="horario"
                                    placeholder="Escribe el horario"
                                    defaultValue={formData.horario}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPersonalContacto">
                                <Form.Label>
                                    Personal de contacto
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="personalContacto"
                                    placeholder="Escribe el personal de contacto"
                                    defaultValue={formData.personalContacto}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTiempoCredito">
                                <Form.Label>
                                    Tiempo de credito
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="tiempoCredito"
                                    placeholder="Escribe el tiempo"
                                    defaultValue={formData.tiempoCredito}
                                />
                            </Form.Group>
                        </Row>

                        {/* Personal de contacto, telefono, Email */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridTelefono">
                                <Form.Label>
                                    Telefono celular
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="telefonoCelular"
                                    placeholder="Escribe el telefono"
                                    defaultValue={formData.telefonoCelular}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTelefono">
                                <Form.Label>
                                    Telefono Fijo
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="telefonoFijo"
                                    placeholder="Escribe el telefono"
                                    defaultValue={formData.telefonoFijo}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTiempoRespuesta">
                                <Form.Label>
                                    Tiempo de respuesta
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    name="tiempoRespuesta"
                                    placeholder="Escribe el tiempo"
                                    defaultValue={formData.tiempoRespuesta}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridLugarRecoleccion">
                                <Form.Label>
                                    Lugar de recolección
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lugarRecoleccion"
                                    placeholder="Escribe el lugar de recolección"
                                    defaultValue={formData.lugarRecoleccion}
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
                        {/**/}

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col align="left" sm={3}>
                                    <Form.Label>
                                        ¿Que proporciona?
                                    </Form.Label>
                                </Col>
                                <Col sm={1}>
                                    <Form.Check
                                        value="Productos"
                                        type="radio"
                                        label="Productos"
                                        name="productoServicio"
                                        id="productos"
                                        defaultValue={formData.productoServicio}
                                        checked={formData.productoServicio=="Productos"}
                                    />
                                </Col>
                                <Col sm={1}>
                                </Col>
                                <Col sm={1}>
                                    <Form.Check
                                        value="Servicio"
                                        type="radio"
                                        label="Servicio"
                                        name="productoServicio"
                                        id="Servicios"
                                        defaultValue={formData.productoServicio}
                                        checked={formData.productoServicio=="Servicio"}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            {
                                formData.productoServicio === "Servicio" &&
                                (
                                    <>
                                        <Form.Group as={Col} controlId="formGridComentarios">
                                            <Form.Label>Descripcion del servicio</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                style={{ height: '100px' }}
                                                type="text"
                                                placeholder="Describe el servicio proporcionado"
                                                name="servicioProporcionado"
                                                defaultValue={formData.servicioProporcionado}
                                            />
                                        </Form.Group>
                                    </>
                                )
                            }
                        </Row>

                        <Row className="mb-3">
                            {
                                formData.productoServicio === "Productos" &&
                                (
                                    <>
                                        <hr />
                                        <Badge bg="secondary" className="tituloFormularioDetalles">
                                            <h4>Buscar el producto que provee</h4>
                                        </Badge>
                                        <br />
                                        <hr />
                                        {/* Cantidad, um, descripción */}
                                        <Row className="mb-3">

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    ITEM
                                                </Form.Label>
                                                <Form.Control
                                                    id="item"
                                                    type="text"
                                                    placeholder="Escribe el ITEM"
                                                    name="ITEM"
                                                    disabled
                                                    value={renglon}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    Folio
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="folio"
                                                    placeholder='Folio'
                                                    name="folioProducto"
                                                    disabled
                                                    defaultValue={formDataOC.folioProdcuto}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                                <Form.Label>
                                                    Descripcion
                                                </Form.Label>
                                                <div className="flex items-center mb-1">
                                                    <Form.Control
                                                        type="text"
                                                        id="descripcion"
                                                        placeholder="Producto"
                                                        defaultValue={formDataOC.nombreProducto}
                                                        name="nombreProducto"
                                                    />
                                                    <FontAwesomeIcon
                                                        className="cursor-pointer py-2 -ml-6"
                                                        title="Buscar entre los productos"
                                                        icon={faSearch}
                                                        onClick={() => {
                                                            buscarMaterial(
                                                                <BuscarMaterial
                                                                    formData={formDataOC}
                                                                    setFormData={setFormDataOC}
                                                                    setShowModal={setShowModal}
                                                                />)
                                                        }}
                                                    />
                                                </div>
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>
                                                    UM
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="um"
                                                    placeholder="UM"
                                                    name="um"
                                                    defaultValue={formDataOC.um}
                                                />
                                            </Form.Group>

                                            <Col sm="1">
                                                <Form.Group as={Row} className="formGridCliente">
                                                    <Form.Label>
                                                        &nbsp;
                                                    </Form.Label>

                                                    <Col>
                                                        <Button
                                                            variant="success"
                                                            title="Guardar datos del producto"
                                                            className="editar"
                                                            onClick={() => {
                                                                addItems()
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            variant="danger"
                                                            title="Limpiar los datos del producto"
                                                            className="editar"
                                                            onClick={() => {
                                                                cancelarCargaProducto()
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faX} className="text-lg" />
                                                        </Button>
                                                    </Col>

                                                </Form.Group>
                                            </Col>

                                        </Row>

                                        <hr />

                                        <Badge bg="secondary" className="tituloFormularioDetalles">
                                            <h4>Listado de artículos agregados</h4>
                                        </Badge>
                                        <br />
                                        <hr />
                                        {/* Inicia tabla informativa del listado de articulos */}
                                        <table className="responsive-tableRegistroVentas"
                                        >
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Folio</th>
                                                    <th scope="col">Descripción</th>
                                                    <th scope="col">UM</th>
                                                    <th scope="col">Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                            </tfoot>
                                            <tbody>
                                                {map(listProductosCargados, (producto, index) => (
                                                    <tr key={index}>
                                                        <td scope="row">
                                                            {index + 1}
                                                        </td>
                                                        <td data-title="Folio">
                                                            {producto.folio}
                                                        </td>
                                                        <td data-title="Descripción">
                                                            {producto.descripcion}
                                                        </td>
                                                        <td data-title="UM">
                                                            {producto.um}
                                                        </td>
                                                        <td data-title="Eliminar">
                                                            <div
                                                                className="eliminarProductoListado"
                                                                title="Eliminar el producto agregado"
                                                                onClick={() => {
                                                                    removeItem(producto)
                                                                }}
                                                            >
                                                                ❌
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }
                        </Row>

                        {/*  horario, comentarios */}
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridComentarios">
                                <Form.Label>Comentarios</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    style={{ height: '100px' }}
                                    type="text"
                                    placeholder="Escribe los comentarios"
                                    name="comentarios"
                                    defaultValue={formData.comentarios}
                                />
                            </Form.Group>
                        </Row>

                        {/* Botones de acciones */}
                        <Form.Group as={Row} className="botones">
                            <Row>
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
                                        className="registrar"
                                        onClick={() => {
                                            regresaPagina();
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
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormData(data) {
    return {
        folio: "",
        nombre: "",
        tipoPersona: "",
        rfc: "",
        regimenFiscal: "",
        productoServicio: "",
        telefonoCelular: "",
        telefonoFijo: "",
        tiempoCredito: "",
        categoria: "",
        personalContacto: "",
        telefono: "",
        correo: "",
        tiempoRespuesta: "",
        lugarRecoleccion: "",
        servicioProporcionado: "",
        horario: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        codigoPostal: "",
        comentarios: ""
    }
}

function initialFormDataFinal(data) {
    const { folio, rfc, tipoPersona, telefonoCelular, telefonoFijo, direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, codigoPostal }, regimenFiscal, nombre, diasCredito, tipo, productoServicio, servicioProporcionado, categoria, personalContacto, telefono, correo, tiempoCredito, tiempoRespuesta, lugarRecoleccion, horario, comentarios } = data;

    return {
        folio: folio,
        nombre: nombre,
        tipoPersona: tipoPersona,
        rfc: rfc,
        regimenFiscal: regimenFiscal,
        tiempoCredito: diasCredito,
        telefonoCelular: telefonoCelular,
        telefonoFijo: telefonoFijo,
        servicioProporcionado: servicioProporcionado,
        productoServicio: productoServicio,
        categoria: categoria,
        personalContacto: personalContacto,
        telefono: telefono,
        calle: calle,
        numeroExterior: numeroExterior,
        numeroInterior: numeroInterior,
        colonia: colonia,
        municipio: municipio,
        estado: estado,
        pais: pais,
        codigoPostal: codigoPostal,
        correo: correo,
        tiempoRespuesta: tiempoRespuesta,
        lugarRecoleccion: lugarRecoleccion,
        horario: horario,
        comentarios: comentarios
    }
}

function initialProveedor() {
    return {
        proveedor: "",
        correoProveedor: "",
        telefonoProveedor: "",
        nombreProveedor: "",
        personalContacto: ""
    }
}

function initialProveedorFinal(data) {
    return {
        proveedor: "",
        correoProveedor: data.correo,
        telefonoProveedor: data.telefono,
        nombreProveedor: data.nombre,
        personalContacto: data.personalContacto
    }
}

function initialFormDataOC() {
    return {
        nombreProducto: "",
        folioProdcuto: "",
        um: ""
    }
}

export default ModificaProveedores;
