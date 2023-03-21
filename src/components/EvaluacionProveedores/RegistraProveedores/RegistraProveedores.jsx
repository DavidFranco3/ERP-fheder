import { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Form, Row, Spinner, Badge } from "react-bootstrap";
import { obtenerFolioActualEvaluacionProveedores, registraEvaluacionProveedores, obtenerItemEvaluacionProveedor } from "../../../api/evaluacionProveedores";
import { toast } from "react-toastify";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faArrowCircleLeft, faSearch, faCirclePlus, faX } from "@fortawesome/free-solid-svg-icons";
import BuscarProveedor from '../../../page/BuscarProveedor';
import BuscarProducto from '../../../page/BuscarProducto';
import BuscarMaterial from "../../../page/BuscarMaterial";
import BasicModal from "../../Modal/BasicModal";
import { map } from "lodash";

function RegistraProveedores(props) {
    const { setRefreshCheckLogin, history } = props;

    // Para controlar la animación
    const [loading, setLoading] = useState(false);

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
        enrutamiento("/EvaluacionProveedores");
    }

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

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    const obtenerFolio = () => {
        try {
            obtenerFolioActualEvaluacionProveedores().then(response => {
                const { data } = response;
                // console.log(data)
                const { noProveedor } = data;
                setFolioActual(noProveedor)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerFolio();
    }, []);


    // Almacena los datos del proveedor
    const [formData, setFormData] = useState(initialFormData());

    // Para guardar los datos del formulario
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(initialProveedor());

    // Para guardar los datos del formulario
    const [formDataOC, setFormDataOC] = useState(initialFormDataOC());

    const [productosRequisicion, setProductosRequisicion] = useState();

    const [listProductosCargados, setListProductosCargados] = useState([]);

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
        //setCargaProductos(initialFormDataProductos)
    }

    // Para eliminar productos del listado
    const removeItem = (producto) => {
        let newArray = listProductosCargados;
        newArray.splice(newArray.findIndex(a => a.folio === producto.folio), 1);
        setListProductosCargados([...newArray]);
    }
    // Termina gestión de los articulos cargados

    const renglon = listProductosCargados.length + 1;

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.tiempoCredito || !formData.tiempoRespuesta || !formData.lugarRecoleccion || !formData.horario || !formData.comentarios) {
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)

            obtenerItemEvaluacionProveedor().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: data.item,
                    folio: folioActual,
                    nombre: formData.nombre,
                    rfc: formData.rfc,
                    tipoPersona: formData.tipoPersona,
                    regimenFiscal: formData.regimenFiscal,
                    tipoPersona: formData.tipoPersona,
                    regimenFiscal: formData.regimenFiscal,
                    sucursal: getSucursal(),
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
                    estadoProveedor: "true"
                }
                // console.log(dataTemp)

                try {
                    registraEvaluacionProveedores(dataTemp).then(response => {
                        const { data } = response;
                        toast.success(data.mensaje)
                        LogsInformativos("Se ha registrado un nuevo proveedor " + formData.nombre, dataTemp)
                        setLoading(false)
                        regresaPagina();
                    }).catch(e => {
                        console.log(e)
                    })
                } catch (e) {
                    console.log(e)
                }
            }).catch(e => {
                console.log(e)
            })
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
                        {/* ID proveedor, nombre/servicio, tipo */}

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridFolio">
                                <Form.Label>
                                    Folio
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="folio"
                                    defaultValue={folioActual}
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
                                        title="Guardar la información del formulario"
                                        variant="success"
                                        className="registrar"
                                    >
                                        {!loading ? "Guardar" : <Spinner animation="border" />}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        title="Cerrar el formulario"
                                        className="registrar"
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
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataOC() {
    return {
        nombreProducto: "",
        folioProdcuto: "",
        um: ""
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

function initialFormData() {
    return {
        nombre: "",
        productoServicio: "",
        servicioProporcionado: "",
        categoria: "",
        rfc: "",
        regimenFiscal: "",
        personalContacto: "",
        personalContacto: "",
        telefonoCelular: "",
        telefonoFijo: "",
        correo: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        tiempoCredito: "",
        tiempoRespuesta: "",
        lugarRecoleccion: "",
        horario: "",
        comentarios: ""
    }
}

export default RegistraProveedores;
