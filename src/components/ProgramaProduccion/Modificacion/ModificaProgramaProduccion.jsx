import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import BuscarOV from "../../../page/BuscarOV";
import { useNavigate, useParams } from "react-router-dom";
import "./ModificaProgramaProduccion.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { listarMatrizProductosActivos, obtenerMatrizProducto, obtenerPorNoInternoMatrizProducto } from "../../../api/matrizProductos";
import { map } from "lodash";
import { listarAlmacenPT, obtenerDatosAlmacenPT } from "../../../api/almacenPT";
import { obtenerDatosMP } from "../../../api/almacenMP";
import { actualizaPrograma, obtenerNumeroPrograma, obtenerPrograma } from "../../../api/programaProduccion";
import { toast } from "react-toastify";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import { obtenerMaquina } from "../../../api/maquinas";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerDatosArticulo } from '../../../api/almacenes';
import BuscarPlaneaccion from '../../../page/BuscarPlaneacion';
import { listarMaquina } from "../../../api/maquinas";
import BuscarProduccion from '../../../page/BuscarProduccion';
import { obtenerDatosRequerimiento } from "../../../api/requerimientosPlaneacion";

function ModificaProgramaProduccion(props) {
    const { setRefreshCheckLogin } = props;

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

    // Para la eliminacion fisica de usuarios
    const buscarOP = (content) => {
        setTitulosModal("Buscar Orden de producción");
        setContentModal(content);
        setShowModal(true);
    }

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormDataInitial());

    // Para almacenar la informacion del formulario
    const [formDataReqPlan, setFormDataReqPlan] = useState(initialValuesReqPlan());

    // Para almacenar la informacion del formulario
    const [maquinas, setMaquinas] = useState();

    // Para almacenar la informacion del formulario
    const [formDataProduccion, setFormDataProduccion] = useState(initialFormDataProduccionInitial());

    // Para almacenar la informacion del formulario
    const [formDataPrograma, setFormDataPrograma] = useState(initialFormDataProgramaInitial());

    // Para almacenar la informacion del formulario
    const [formDataPlaneacion, setFormDataPlaneacion] = useState(initialFormDataPlaneacionInitial());

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadProductoAlmacen, setCantidadProductoAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadMBAlmacen, setCantidadMBAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadEmpaquesAlmacen, setCantidadEmpaquesAlmacen] = useState(0);

    // Para almacenar la OV
    const [ordenVenta, setOrdenVenta] = useState("");

    // Para almacenar la OV
    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState("");

    // Para almacenar el cliente de la OV
    const [clienteOV, setClienteOV] = useState("");

    const [cantidadRequeridaOV, setCantidadRequeridaOV] = useState("");

    const [producto, setProducto] = useState([]);

    // Para almacenar el listado de maquinas
    const [listMaquinas, setListMaquinas] = useState(null);

    // Define el uso de los parametros
    const parametros = useParams()
    const { id } = parametros

    const cargarDatosPrograma = () => {
        try {
            obtenerPrograma(id).then(response => {
                const { data } = response;
                // console.log(data)
                const { fechaSolicitud, proveedor, nombreProveedor, tipoCompra, fechaEntrega, autoriza, productos } = data;
                setFormDataProduccion(initialFormDataProduccion(data));
                setFormData(initialFormData(data));
                //setFormDataOC(cargaFormDataOC(data))
                //setFormData(dataCompras(fechaSolicitud, proveedor, nombreProveedor, tipoCompra, fechaEntrega, autoriza, productos))
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    // Recupera la información de la compra
    useEffect(() => {
        cargarDatosPrograma();
    }, []);

    const cargarListaMaquinas = () => {
        try {
            listarMaquina(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listMaquinas && data) {
                    setListMaquinas(formatModelMaquinas(data));
                } else {
                    const datosMaquinas = formatModelMaquinas(data);
                    setListMaquinas(datosMaquinas);
                }
            }).catch(e => {
                //console.log(e)
                if (e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarListaMaquinas();
    }, []);

    const cargarDatosRequerimiento = () => {
        try {

            obtenerDatosRequerimiento(formDataProduccion.folioPlaneacion).then(response => {
                const { data } = response;
                console.log(data);
                setFormDataReqPlan(valoresAlmacenadosReqPlan(data))
            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosRequerimiento();
    }, [formDataProduccion.folioPlaneacion]);

    const cargarDatosProducto = () => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMatrizProducto(formDataReqPlan.producto).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formDataPrograma && data) {
                    setFormDataProduccion(initialFormDataPrograma(data));
                } else {
                    const datosProductos = initialFormDataPrograma(data);
                    setFormDataPrograma(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosProducto();
    }, [formDataReqPlan.producto]);

    const [unidadMedida, setUnidadMedida] = useState("Piezas");

    const [cantidad, setCantidad] = useState("0");

    let cantidadTotalEntrada = 0;

    let cantidadTotalSalida = 0;

    const [almacenProducto, setAlmacenProducto] = useState(0);

    let cantidadTotalEntradaMaterial = 0;

    let cantidadTotalSalidaMaterial = 0;

    let cantidadTotalEntradaPigmento = 0;

    let cantidadTotalSalidaPigmento = 0;

    let cantidadTotalEntradaEmpaque = 0;

    let cantidadTotalSalidaEmpaque = 0;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarOV = (content) => {
        setTitulosModal("Buscar orden de venta");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useNavigate()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento(`/ProgramaProduccion/${formDataProduccion.semana}`)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la materia prima seleccionada
    const [almacenPT, setAlmacenPT] = useState([]);

    const handleMateriaPrima = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setAlmacenPT({
            idProducto: temp[0],
            folioAlmacen: temp[1],
            folioMP: temp[2],
            nombre: temp[3],
            um: temp[4],
            existenciasOV: temp[5],
            existenciasStock: temp[6],
            existenciasTotales: temp[7]
        })
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fechaInicio) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true);
            const temp = formData.noMaquina.split("/");

            const dataTemp = {
                folioOP: formDataProduccion.ordenProduccion,
                folioPlaneacion: formDataProduccion.folioPlaneacion,
                ordenProduccion: {
                    noMaquina: temp[0],
                    maquina: temp.length == 1 ? formData.maquina : temp[1],
                    semana: formDataProduccion.semana,
                    fechaInicio: formData.fechaInicio,
                    cliente: formDataPrograma.cliente,
                    nombreCliente: formDataPrograma.nombreCliente,
                    producto: formDataProduccion.producto,
                    nombreProducto: formDataReqPlan.idProducto,
                    cantidadFabricar: formDataReqPlan.cantidadFabricar,
                    acumulado: formDataReqPlan.acumulado,
                    ciclo: formDataPrograma.ciclo,
                    cavidades: formDataReqPlan.cavidades,
                    stdTurno: formDataPrograma.stdTurno,
                    pendienteFabricar: formDataReqPlan.pendienteFabricar,
                    operadores: formDataPrograma.operadores,
                    noInterno: formDataPrograma.noInterno,
                    turnosRequeridos: turnosReq,
                }
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
            LogsInformativos("Se ha actualizado el programa de produccion con folio " + dataTemp.folio, dataTemp)
            // Modificar el pedido creado recientemente
            actualizaPrograma(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                setLoading(false)
                rutaRegreso()
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const [listOVCargadas, setListOVCargadas] = useState([]);

    const addItemsOV = () => {
        const ordenVenta = document.getElementById("ordenVenta").value
        const cantidadPedidaOV = document.getElementById("cantidadPedidaOV").value
        const cantidadProducirOV = document.getElementById("cantidadProducirOV").value

        if (!ordenVenta || !cantidadPedidaOV || !cantidadProducirOV) {
            toast.warning("Completa la informacion de la orden de venta");
        } else {
            const dataTemp = {
                ordenVenta: ordenVenta,
                cantidadPedidaOV: cantidadPedidaOV,
                cantidadProducirOV: cantidadProducirOV,
            }
            // console.log(dataTemp)

            setListOVCargadas(
                [...listOVCargadas, dataTemp]
            );

            // Actualizacion del tracking
            LogTrackingActualizacion(ordenVenta, "En planeación", "2")

            //setCargaProductos(initialFormDataProductos)
            document.getElementById("ordenVenta").value = ""
            document.getElementById("cantidadPedidaOV").value = ""
            document.getElementById("cantidadProducirOV").value = ""
            setOrdenVenta("")
            setCantidadRequeridaOV("")
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaOV = () => {
        //setCargaProductos(initialFormDataProductos)
        document.getElementById("ordenVenta").value = ""
        document.getElementById("cantidadPedidaOV").value = ""
        document.getElementById("cantidadProducirOV").value = ""
    }

    // Para eliminar productos del listado
    const removeItemOV = (OV) => {
        let newArray = listOVCargadas;
        newArray.splice(newArray.findIndex(a => a.ordenVenta === ordenVenta.ordenVenta), 1);
        setListOVCargadas([...newArray]);
    }

    const itemOV = listOVCargadas.length + 1;

    const [listOCCargadas, setListOCCargadas] = useState([]);

    let totalProducir = (listOVCargadas.reduce((amount, item) => (amount + parseInt(item.cantidadProducirOV)), 0));

    let kgMaterial = ((Number(formDataPlaneacion.pesoPiezas) + (Number(formDataPlaneacion.pesoColada) / Number(formDataPlaneacion.cavMolde))) * Number(totalProducir)) * (1 + (Number(formDataPlaneacion.porcentajeScrap) / 100));

    let materialTurno = (((Number(formDataPlaneacion.pesoColada) / Number(formDataPlaneacion.cavMolde)) + Number(formDataPlaneacion.pesoPiezas)) * Number(formDataPlaneacion.piezasxTurno)) * (1 + (Number(formDataPlaneacion.porcentajeScrap) / 100));

    let pigMB = (Number(formDataPlaneacion.aplicacionGxKG) * Number(kgMaterial)) / 1000;

    let bolsasCajasUtilizar = (Number(totalProducir) / Number(formDataPlaneacion.noPiezasxEmpaque));

    let piezasTurno1 = (((3600 / Number(formDataPlaneacion.tiempoCiclo1)) * Number(formDataPlaneacion.cavMolde)) * 12);

    let piezasTurno2 = (((3600 / Number(formDataPlaneacion.tiempoCiclo2)) * Number(formDataPlaneacion.cavMolde)) * 12);

    let piezasTurno3 = (((3600 / Number(formDataPlaneacion.tiempoCiclo3)) * Number(formDataPlaneacion.cavMolde)) * 12);

    let turnosReq = Number(formDataReqPlan.pendienteFabricar) / Number(formDataPrograma.stdTurno);

    const [cantidadPedirEmpaques, setCantidadPedirEmpaques] = useState(0);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataPlaneacion({ ...formDataPlaneacion, [e.target.name]: e.target.value });
        setFormDataProduccion({ ...formDataProduccion, [e.target.name]: e.target.value });
        setFormDataPrograma({ ...formDataPrograma, [e.target.name]: e.target.value });
    }

    const temp = formData.noMaquina.split("/");

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Modificar programa de producción
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
                <div className="formularioDatos">
                    <br />
                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <div className="datosGenerales">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Orden de producción
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Folio
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Folio"
                                            value={formData.folio}
                                            name="folio"
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Orden de producción
                                        </Form.Label>
                                        <div className="flex items-center mb-1">
                                            <Form.Control
                                                type="text"
                                                defaultValue={formDataProduccion.ordenProduccion}
                                                placeholder="Orden de producción"
                                                name="ordenProduccion"
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                title="Buscar entre los productos"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarOP(
                                                        <BuscarProduccion
                                                            formData={formDataProduccion}
                                                            setFormData={setFormDataProduccion}
                                                            setShowModal={setShowModal}
                                                        />)
                                                }}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Semana
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataProduccion.semana}
                                            placeholder="Semana"
                                            name="semana"
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            No. Maquina
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            defaultValue={formData.noMaquina}
                                            placeholder="Numero de maquina"
                                            name="noMaquina"
                                        >
                                            <option>Elige una opción</option>
                                            {map(listMaquinas, (maquina, index) => (
                                                <option value={maquina?.numeroMaquina + "/" + maquina?.marca} selected={maquina?.numeroMaquina == formData.noMaquina}>{maquina?.numeroMaquina + "-" + maquina?.marca}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Maquina
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Maquina"
                                            value={temp.length == 1 ? formData.maquina : temp[1]}
                                            name="maquina"
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Cliente
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPrograma.cliente}
                                            placeholder="Cliente"
                                            name="cliente"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Producto a fabricar
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Producto"
                                            defaultValue={formDataReqPlan.idProducto}
                                            name="producto"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a fabricar
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataReqPlan.cantidadFabricar}
                                            placeholder="Cantidad a fabricar"
                                            name="cantidadFabricar"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Acumulado
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataReqPlan.acumulado}
                                            placeholder="Acumulado"
                                            name="acumulado"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Ciclo
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPrograma.ciclo}
                                            placeholder="Ciclo"
                                            name="ciclo"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Cavidades
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Cavidades"
                                            defaultValue={formDataReqPlan.cavidades}
                                            name="cavidades"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Std x turno
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPrograma.stdTurno}
                                            placeholder="Standard por turno"
                                            name="stdTurno"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Pendiente de fabricar
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataReqPlan.pendienteFabricar}
                                            placeholder="Pendiente de fabricar"
                                            name="pendienteFabricar"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Operadores
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPrograma.operadores}
                                            placeholder="Operadores"
                                            name="operadores"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            No. Interno
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero interno"
                                            defaultValue={formDataPrograma.noInterno}
                                            name="noInterno"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Turnos requeridos
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={Math.ceil(turnosReq)}
                                            placeholder="Turnos requeridos"
                                            name="turnosReq"
                                            disabled
                                        />
                                    </Form.Group>

                                </Row>

                            </Container>
                        </div>
                        <br />

                        {/*<div className="datosBOM">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Programa
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value={lunesT1}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Lunes T1" : "Lunes T1 " + lunesT1}
                                                name="lunesT1"
                                                id={lunesT1}
                                                defaultValue={formData.lunesT1}
                                                checked={formData.lunesT1 == lunesT1}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={miercolesT1}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Miercoles T1" : "Miercoles T1 " + miercolesT1}
                                                name="miercolesT1"
                                                id={miercolesT1}
                                                defaultValue={formData.miercolesT1}
                                                checked={formData.miercolesT1 == miercolesT1}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={viernesT1}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Viernes T1" : "Viernes T1 " + viernesT1}
                                                name="viernesT1"
                                                id={viernesT1}
                                                defaultValue={formData.viernesT1}
                                                checked={formData.viernesT1 == viernesT1}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value={lunesT2}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Lunes T2" : "Lunes T2 " + lunesT2}
                                                name="lunesT2"
                                                id={lunesT2}
                                                defaultValue={formData.lunesT2}
                                                checked={formData.lunesT2 == lunesT2}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={miercolesT2}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Miercoles T2" : "Miercoles T2 " + miercolesT2}
                                                name="miercolesT2"
                                                id={miercolesT2}
                                                defaultValue={formData.miercolesT2}
                                                checked={formData.miercolesT2 == miercolesT2}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={viernesT2}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Viernes T2" : "Viernes T2 " + viernesT2}
                                                name="viernesT2"
                                                id={viernesT2}
                                                defaultValue={formData.viernesT2}
                                                checked={formData.viernesT2 == viernesT2}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value={martesT1}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Martes T1" : "Martes T1 " + martesT1}
                                                name="martesT1"
                                                id={martesT1}
                                                defaultValue={formData.martesT1}
                                                checked={formData.martesT1 == martesT1}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={juevesT1}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Jueves T1" : "Jueves T1 " + juevesT1}
                                                name="juevesT1"
                                                id={juevesT1}
                                                defaultValue={formData.juevesT1}
                                                checked={formData.juevesT1 == juevesT1}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={sabadoT1}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Sabado T1" : "Sabado T1 " + sabadoT1}
                                                name="sabadoT1"
                                                id={sabadoT1}
                                                defaultValue={formData.sabadoT1}
                                                checked={formData.sabadoT1 == sabadoT1}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value={martesT2}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Martes T2" : "Martes T2 " + martesT2}
                                                name="martesT2"
                                                id={martesT2}
                                                defaultValue={formData.martesT2}
                                                checked={formData.martesT2 == martesT2}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value={juevesT2}
                                                type="radio"
                                                label={formData.fechaInicio == "" ? "Jueves T2" : "Jueves T2 " + juevesT2}
                                                name="juevesT2"
                                                id={juevesT2}
                                                defaultValue={formData.juevesT2}
                                                checked={formData.juevesT2 == juevesT2}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                            </Container>
                                            </div>*/}

                        <br />

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar la información del formulario"
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
                                        rutaRegreso()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>

                        <br />

                    </Form>
                </div>

            </Container >

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataProduccion(data) {
    return {
        semana: data.ordenProduccion.semana,
        ordenProduccion: data.folioOP,
        idProducto: data.ordenProduccion.nombreProducto,
        producto: data.ordenProduccion.producto,
        cantidadFabricar: data.ordenProduccion.cantidadFabricar,
        acumulado: data.ordenProduccion.acumulado,
        cavidades: data.ordenProduccion.cavidades,
        standarTurno: data.ordenProduccion.stdTurno,
        pendienteFabricar: data.ordenProduccion.pendienteFabricar,
        noInterno: data.ordenProduccion.noInterno,
        folioPlaneacion: data.folioPlaneacion,
    }
}

function initialFormDataProduccionInitial() {
    return {
        semana: "",
        ordenProduccion: "",
        idProducto: "",
        producto: "",
        cantidadFabricar: "",
        acumulado: "",
        cavidades: "",
        standarTurno: "",
        pendienteFabricar: "",
        noInterno: "",
        folioPlaneacion: "",
    }
}

function initialFormDataProgramaInitial() {
    return {
        idCliente: "",
        cliente: "",
        ciclo: "",
        stdTurno: "",
        operadores: "",
        noInterno: "",
        turnosRequeridos: "",
    }
}

function initialFormDataPrograma(data) {
    return {
        idCliente: data.cliente,
        cliente: data.nombreCliente,
        ciclo: data.tiempoCiclo,
        stdTurno: data.piezasxTurno,
        operadores: data.noOperadores,
        noInterno: data.noInterno,
        turnosRequeridos: "",
    }
}

function initialFormDataPlaneacion(data) {
    return {
        id: data._id,
        noInterno: data.noInterno,
        um: data.um,
        cliente: data.cliente,
        noMolde: data.datosMolde.noMolde,
        cavMolde: data.datosMolde.cavMolde,
        noParte: data.noParte,
        descripcion: data.descripcion,
        pesoPiezas: data.datosPieza.pesoPiezas,
        pesoColada: data.datosPieza.pesoColada,
        pesoTotalInyeccion: data.datosPieza.pesoTotalInyeccion,
        porcentajeScrap: data.datosPieza.porcentajeScrap,
        porcentajeMolido: data.datosPieza.porcentajeMolido,
        descripcionMP: data.materiaPrima.descripcion,
        idMaterial: data.materiaPrima.idMaterial,
        folioMaterial: data.materiaPrima.folioMaterial,
        precioMaterial: data.materiaPrima.precioMaterial,
        umMaterial: data.materiaPrima.umMaterial,
        idPigmento: data.pigmentoMasterBach.idPigmento,
        folioPigmento: data.pigmentoMasterBach.folioPigmento,
        descripcionPigmento: data.pigmentoMasterBach.descripcion,
        precioPigmento: data.pigmentoMasterBach.precioPigmento,
        aplicacionGxKG: data.pigmentoMasterBach.aplicacionGxKG,
        proveedor: data.pigmentoMasterBach.proveedor,
        nombreProveedor: data.pigmentoMasterBach.nombreProveedor,
        umPigmento: data.pigmentoMasterBach.umPigmento,
        tiempoCiclo: data.tiempoCiclo,
        noOperadores: data.noOperadores,
        piezasxHora: data.piezasxHora,
        piezasxTurno: data.piezasxTurno,
        idEmpaque: data.materialEmpaque.idEmpaque,
        folioEmpaque: data.materialEmpaque.folioEmpaque,
        descripcionBolsa: data.materialEmpaque.descripcionBolsa,
        precioEmpaque: data.materialEmpaque.precioEmpaque,
        umEmpaque: data.materialEmpaque.umEmpaque,
        noPiezasxEmpaque: data.materialEmpaque.noPiezasxEmpaque,
        opcionMaquinaria: data.opcionMaquinaria,
        opcion1: data.opcionMaquinaria[0][1].opcion1,
        tiempoCiclo1: data.opcionMaquinaria[0][1].tiempoCiclo1,
        opcion2: data.opcionMaquinaria[0][2].opcion2,
        tiempoCiclo2: data.opcionMaquinaria[0][2].tiempoCiclo2,
        opcion3: data.opcionMaquinaria[0][3].opcion3,
        tiempoCiclo3: data.opcionMaquinaria[0][3].tiempoCiclo3,
        opcion4: data.opcionMaquinaria[0][4].opcion4,
        tiempoCiclo4: data.opcionMaquinaria[0][4].tiempoCiclo4,
        opcion5: data.opcionMaquinaria[0][5].opcion5,
        tiempoCiclo5: data.opcionMaquinaria[0][5].tiempoCiclo5,
        opcion6: data.opcionMaquinaria[0][6].opcion6,
        tiempoCiclo6: data.opcionMaquinaria[0][6].tiempoCiclo6
    }
}

function initialFormDataPlaneacionInitial() {
    return {
        noInterno: "",
        um: "",
        cliente: "",
        noMolde: "",
        cavMolde: "",
        noParte: "",
        descripcion: "",
        pesoPiezas: "",
        pesoColada: "",
        pesoTotalInyeccion: "",
        porcentajeScrap: "",
        porcentajeMolido: "",
        descripcionMP: "",
        idMaterial: "",
        folioMaterial: "",
        umMaterial: "",
        umPigmento: "",
        umEmpaque: "",
        idPigmento: "",
        idEmpaque: "",
        folioPigmento: "",
        folioEmpaque: "",
        precioPigmento: "",
        precioEmpaque: "",
        precioMaterial: "",
        descripcionPigmento: "",
        aplicacionGxKG: "",
        proveedor: "",
        tiempoCiclo: "",
        noOperadores: "",
        piezasxHora: "",
        piezasxTurno: "",
        descripcionBolsa: "",
        noPiezasxEmpaque: "",
        opcionMaquinaria: "",
        opcion1: "",
        tiempoCiclo1: "",
        opcion2: "",
        tiempoCiclo2: "",
        opcion3: "",
        tiempoCiclo3: "",
        opcion4: "",
        tiempoCiclo4: "",
        opcion5: "",
        tiempoCiclo5: "",
        opcion6: "",
        tiempoCiclo6: ""
    }
}

function initialFormData(data) {
    return {
        cantidadMP: 0,
        materiaPrima: "",
        semana: "",
        numeroMaquina1: "",
        maquina1: "",
        ciclo1: "",
        pieza1: "",
        bolsa1: "",
        numeroMaquina2: "",
        maquina2: "",
        ciclo2: "",
        pieza2: "",
        bolsa2: "",
        numeroMaquina3: "",
        maquina3: "",
        ciclo3: "",
        pieza3: "",
        bolsa3: "",
        materialTurno: "",
        merma: "",
        kgMaterial: "",
        kgPIGMB: "",

        folio: data.folio,
        fechaInicio: data.ordenProduccion.fechaInicio,
        noMaquina: data.ordenProduccion.noMaquina,
        maquina: data.ordenProduccion.maquina,

        lunesT1: data.programa.lunesT1,
        lunesT2: data.programa.lunesT2,
        martesT1: data.programa.martesT1,
        martesT2: data.programa.martesT2,
        miercolesT1: data.programa.miercolesT1,
        miercolesT2: data.programa.miercolesT2,
        juevesT1: data.programa.juevesT1,
        juevesT2: data.programa.juevesT2,
        viernesT1: data.programa.viernesT1,
        viernesT2: data.programa.viernesT2,
        sabadoT1: data.programa.sabadoT1
    }
}

function initialFormDataInitial() {
    return {
        cantidadMP: 0,
        materiaPrima: "",
        semana: "",
        numeroMaquina1: "",
        maquina1: "",
        ciclo1: "",
        pieza1: "",
        bolsa1: "",
        numeroMaquina2: "",
        maquina2: "",
        ciclo2: "",
        pieza2: "",
        bolsa2: "",
        numeroMaquina3: "",
        maquina3: "",
        ciclo3: "",
        pieza3: "",
        bolsa3: "",
        materialTurno: "",
        merma: "",
        kgMaterial: "",
        kgPIGMB: "",
        fechaInicio: "",
        noMaquina: "",
        maquina: "",

        lunesT1: "",
        lunesT2: "",
        martesT1: "",
        martesT2: "",
        miercolesT1: "",
        miercolesT2: "",
        juevesT1: "",
        juevesT2: "",
        viernesT1: "",
        viernesT2: "",
        sabadoT1: ""
    }
}

function formatModelAlmacenPT(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            idProducto: data.idProducto,
            folioAlmacen: data.folioAlmacen,
            folioMP: data.folioMP,
            nombre: data.nombre,
            descripcion: data.descripcion,
            um: data.um,
            movimientos: data.movimientos,
            existenciasOV: data.existenciasOV,
            existenciasStock: data.existenciasStock,
            existenciasTotales: data.existenciasTotales,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelMatrizProductos(data) {
    //console.log(data)
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

function formatModelMaquinas(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            numeroMaquina: data.numeroMaquina,
            marca: data.marca,
            tonelaje: data.tonelaje,
            lugar: data.lugar,
            status: data.status,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function initialValuesReqPlan() {
    return {
        ordenVenta: "",
        producto: "",
        nombreProducto: "",
        cantidadProducir: "",
        folioPlaneacion: "",

        semana: "",
        ordenProduccion: "",
        idProducto: "",
        producto: "",
        cantidadFabricar: "",
        acumulado: "",
        cavidades: "",
        standarTurno: "",
        pendienteFabricar: "",
        noInterno: "",

        opcionesMaquinaria: ""
    }
}

function valoresAlmacenadosReqPlan(data) {
    return {
        ordenVenta: data.requerimiento.ov,
        producto: data.requerimiento.producto,
        nombreProducto: data.requerimiento.nombreProducto,
        cantidadProducir: data.requerimiento.totalProducir,

        semana: data.requerimiento.semana,
        ordenProduccion: data.folio,
        idProducto: data.requerimiento.nombreProducto,
        cantidadFabricar: data.requerimiento.totalProducir,
        acumulado: data.requerimiento.almacenProductoTerminado,
        cavidades: data.planeacion.numeroCavidades,
        pendienteFabricar: parseInt(data.requerimiento.totalProducir) - parseInt(data.requerimiento.almacenProductoTerminado),
        noInterno: data.requerimiento.noInterno,

        opcionesMaquinaria: data.planeacion.opcionesMaquinaria,
        folioPlaneacion: data.folio,
    }
}

export default ModificaProgramaProduccion;
