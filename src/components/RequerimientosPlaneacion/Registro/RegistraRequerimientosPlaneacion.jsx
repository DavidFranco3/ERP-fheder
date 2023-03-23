import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Table, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import BuscarOV from "../../../page/BuscarOV";
import BuscarProductosOV from '../../../page/BuscarProductosOV';
import { useNavigate, useParams } from "react-router-dom";
import "./RegistraRequerimientosPlaneacion.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { listarMatrizProductosActivos, obtenerMatrizProducto, obtenerPorNoInternoMatrizProducto } from "../../../api/matrizProductos";
import { map } from "lodash";
import { listarAlmacenPT, obtenerDatosAlmacenPT } from "../../../api/almacenPT";
import { obtenerDatosMP } from "../../../api/almacenMP";
import { registraRequerimiento, obtenerNumeroRequerimiento, obtenerItemRequerimiento } from "../../../api/requerimientosPlaneacion";
import { toast } from "react-toastify";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import { obtenerMaquina, listarMaquina } from "../../../api/maquinas";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerDatosArticulo } from '../../../api/almacenes';
import AgregarResultado from "../AgregarResultado";
import AgregarRegistro from "../AgregarRegistro";
import { obtenerDatosSemana } from "../../../api/semana";
import { LogPedidoActualizacion } from "../../Ventas/Gestion/GestionPedidoVenta"

function RegistraRequerimientosPlaneacion(props) {
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

    const params = useParams();
    const { semana } = params;

    // Cerrado de sesión automatico
    useEffect(() => {
        cierreAutomatico();
    }, []);
    // Termina cerrado de sesión automatico

    // Para almacenar el listado de maquinas
    const [listMaquinas, setListMaquinas] = useState(null);

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

    const [fechaInicial, setFechaInicial] = useState("");

    const cargarDatosSemana = () => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosSemana(semana).then(response => {
                const { data } = response;
                setFechaInicial(data.fechaInicial)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosSemana();
    }, []);

    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState("");

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataVenta, setFormDataVenta] = useState(initialFormDataVenta());

    // Para almacenar la informacion del formulario
    const [formDataPlaneacion, setFormDataPlaneacion] = useState(initialFormDataPlaneacionInitial());

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadProductoAlmacen, setCantidadProductoAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadMBAlmacen, setCantidadMBAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadEmpaquesAlmacen, setCantidadEmpaquesAlmacen] = useState(0);

    const [listResultados, setListResultados] = useState([]);

    const [listRegistros, setListRegistros] = useState([]);

    const [registroAnterior, setRegistroAnterior] = useState(0);

    const [registroAnteriorMaterial, setRegistroAnteriorMaterial] = useState(0);

    // Para eliminar productos del listado
    const removeItemResultado = (resultado) => {
        let newArray = listResultados;
        newArray.splice(newArray.findIndex(a => a.acumulado === resultado.acumulado), 1);
        setListResultados([...newArray]);
    }

    // Para eliminar productos del listado
    const removeItemRegistro = (registro) => {
        let newArray = listRegistros;
        newArray.splice(newArray.findIndex(a => a.acumulado === registro.acumulado), 1);
        setListRegistros([...newArray]);
    }

    // Para la eliminacion fisica de usuarios
    const agregarResultado = (content) => {
        setTitulosModal("Agregar resultado");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const agregarRegistro = (content) => {
        setTitulosModal("Agregar registro");
        setContentModal(content);
        setShowModal(true);
    }

    const cargarDatosProducto = () => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerPorNoInternoMatrizProducto(formDataVenta.numeroInterno).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formDataPlaneacion && data) {
                    setFormDataPlaneacion(initialFormDataPlaneacion(data));
                } else {
                    const datosProductos = initialFormDataPlaneacion(data);
                    setFormDataPlaneacion(datosProductos);
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
    }, [formDataVenta.numeroInterno]);

    let cantidadTotalEntrada = 0;

    let cantidadTotalSalida = 0;

    const [almacenProducto, setAlmacenProducto] = useState(0);

    const cargarDatosArticulos = () => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosArticulo(formDataPlaneacion.id).then(response => {
                const { data } = response;

                map(data, (articulos, index) => {

                    const { estado, cantidadExistencia, tipo } = articulos

                    if (estado == "true") {
                        console.log("entro al primer if")
                        if (tipo == "Entrada") {
                            console.log("entro al segundo if")
                            cantidadTotalEntrada += parseFloat(cantidadExistencia);
                            console.log(cantidadTotalEntrada)
                        } else if (tipo == "Salida") {
                            console.log("el estado del producto es false")
                            cantidadTotalSalida += parseFloat(cantidadExistencia);
                        }
                    }
                    setAlmacenProducto(cantidadTotalEntrada - cantidadTotalSalida)
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosArticulos();
    }, [formDataPlaneacion.id]);

    let cantidadTotalEntradaMaterial = 0;

    let cantidadTotalSalidaMaterial = 0;

    const cargarDatosMaterial = () => {
        try {
            obtenerDatosArticulo(formDataPlaneacion.idMaterial).then(response => {
                const { data } = response;

                map(data, (articulos, index) => {

                    const { estado, cantidadExistencia, tipo } = articulos

                    if (estado == "true") {
                        console.log("entro al primer if")
                        if (tipo == "Entrada") {
                            console.log("entro al segundo if")
                            cantidadTotalEntradaMaterial += parseFloat(cantidadExistencia);
                        } else if (tipo == "Salida") {
                            console.log("el estado del producto es false")
                            cantidadTotalSalidaMaterial += parseFloat(cantidadExistencia);
                        }
                    }
                    setCantidadProductoAlmacen(cantidadTotalEntradaMaterial - cantidadTotalSalidaMaterial)
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosMaterial();
    }, [formDataPlaneacion.idMaterial]);

    let cantidadTotalEntradaPigmento = 0;

    let cantidadTotalSalidaPigmento = 0;

    const cargarDatosPigmento = () => {
        try {
            obtenerDatosArticulo(formDataPlaneacion.idPigmento).then(response => {
                const { data } = response;

                map(data, (articulos, index) => {

                    const { estado, cantidadExistencia, tipo } = articulos

                    if (estado == "true") {
                        console.log("entro al primer if")
                        if (tipo == "Entrada") {
                            console.log("entro al segundo if")
                            cantidadTotalEntradaPigmento += parseFloat(cantidadExistencia);
                        } else if (tipo == "Salida") {
                            console.log("el estado del producto es false")
                            cantidadTotalSalidaPigmento += parseFloat(cantidadExistencia);
                        }
                    }
                    setCantidadMBAlmacen(cantidadTotalEntradaPigmento - cantidadTotalSalidaPigmento)
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosPigmento();
    }, [formDataPlaneacion.idPigmento]);

    let cantidadTotalEntradaEmpaque = 0;

    let cantidadTotalSalidaEmpaque = 0;

    const cargarDatosEmpaque = () => {
        try {
            obtenerDatosArticulo(formDataPlaneacion.idEmpaque).then(response => {
                const { data } = response;

                map(data, (articulos, index) => {

                    const { estado, cantidadExistencia, tipo } = articulos

                    if (estado == "true") {
                        console.log("entro al primer if")
                        if (tipo == "Entrada") {
                            console.log("entro al segundo if")
                            cantidadTotalEntradaEmpaque += parseFloat(cantidadExistencia);
                        } else if (tipo == "Salida") {
                            console.log("el estado del producto es false")
                            cantidadTotalSalidaEmpaque += parseFloat(cantidadExistencia);
                        }
                    }
                    setCantidadEmpaquesAlmacen(cantidadTotalEntradaEmpaque - cantidadTotalSalidaEmpaque)
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarDatosEmpaque();
    }, [formDataPlaneacion.idEmpaque]);

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
        enrutamiento(`/RequerimientosPlaneacion/${semana}`)
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

    const [item, setItem] = useState("");

    const obtenerItem = () => {
        try {
            obtenerItemRequerimiento().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItem(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        obtenerItem();
    }, []);

    console.log(formDataVenta.numeroInterno)

    const onSubmit = e => {
        e.preventDefault();
        //console.log("Continuar")

        const temp = formData.noMaquina.split("/")

        if (!formData.noMaquina) {
            toast.warning("Selecciona una maquina")
        } else {

            const temp = formData.noMaquina.split("/")
            setLoading(true)
            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerNumeroRequerimiento().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: item,
                    folio: data.noRequerimiento,
                    sucursal: getSucursal(),
                    semana: semana,
                    acumulado: registroAnterior,
                    acumuladoMaterial: registroAnteriorMaterial,
                    requerimiento: {
                        semana: semana,
                        producto: formDataPlaneacion.id,
                        nombreProducto: formDataPlaneacion.descripcion,
                        numeroInterno: listOVCargadas[0].numeroInterno,
                        um: formDataPlaneacion.um,
                        ov: listOVCargadas[0].ordenVenta,
                        almacenProductoTerminado: almacenProducto,
                        ordenVenta: listOVCargadas,
                        nombreProveedor: formDataPlaneacion.nombreProveedor,
                        totalProducir: totalProducir,
                        cliente: formDataPlaneacion.cliente,
                        nombreCliente: formDataPlaneacion.nombreCliente,
                    },
                    planeacion: {
                        numeroMolde: formDataPlaneacion.noMolde,
                        numeroCavidades: formDataPlaneacion.cavMolde,
                        opcionesMaquinaria: {
                            numeroMaquina: temp[0],
                            maquina: temp[1],
                            ciclo: formDataPlaneacion.tiempoCiclo1,
                            pieza: piezasTurno1,
                            bolsa: formDataPlaneacion.noPiezasxEmpaque,
                        },
                    },
                    bom: {
                        material: formDataPlaneacion.descripcionMP,
                        idMaterial: formDataPlaneacion.idMaterial,
                        folioMaterial: formDataPlaneacion.folioMaterial,
                        precioMaterial: formDataPlaneacion.precioMaterial,
                        umMaterial: formDataPlaneacion.umMaterial,
                        molido: formDataPlaneacion.porcentajeMolido,
                        pesoPieza: formDataPlaneacion.pesoPiezas,
                        pesoColada: formDataPlaneacion.pesoColada,
                        kgMaterial: kgMaterial,
                        idPigmento: formDataPlaneacion.idPigmento,
                        folioPigmento: formDataPlaneacion.folioPigmento,
                        precioPigmento: formDataPlaneacion.precioPigmento,
                        umPigmento: formDataPlaneacion.umPigmento,
                        pigmento: formDataPlaneacion.descripcionPigmento,
                        aplicacion: formDataPlaneacion.aplicacionGxKG,
                        pigMb: pigMB,
                        materialxTurno: materialTurno,
                        merma: formDataPlaneacion.porcentajeScrap,
                        idEmpaque: formDataPlaneacion.idEmpaque,
                        folioEmpaque: formDataPlaneacion.folioEmpaque,
                        precioEmpaque: formDataPlaneacion.precioEmpaque,
                        umEmpaque: formDataPlaneacion.umEmpaque,
                        empaque: formDataPlaneacion.descripcionBolsa,
                        bolsasCajasUtilizar: bolsasCajasUtilizar,
                        notas: formData.notasImportantes,
                        elaboro: formData.elaboro,
                    },
                    datosRequisicion: {
                        material: formDataPlaneacion.descripcionMP,
                        kgMaterial: kgMaterial,
                        almacenMP: cantidadProductoAlmacen,
                        cantidadSugerida: Number(kgMaterial) - Number(cantidadProductoAlmacen),
                        cantidadPedir: cantidadPedir,

                        pigmentoMB: formDataPlaneacion.descripcionPigmento,
                        kgPigMB: pigMB,
                        MbAlmacen: cantidadMBAlmacen,
                        cantidadSugeridaMB: Number(pigMB) - Number(cantidadMBAlmacen),
                        cantidadPedirMB: cantidadPedirMB,

                        empaque: formDataPlaneacion.descripcionBolsa,
                        empaquesNecesarios: bolsasCajasUtilizar,
                        empaquesAlmacen: cantidadEmpaquesAlmacen,
                        cantidadSugeridaEmpaques: Number(bolsasCajasUtilizar) - Number(cantidadEmpaquesAlmacen),
                        cantidadPedirEmpaques: cantidadPedirEmpaques
                    },
                    programa: {
                        fechaInicio: fechaInicial,
                        lunesT1: lunesT1,
                        estadoLT1: "false",
                        lunesT2: lunesT2,
                        estadoLT2: "false",
                        martesT1: martesT1,
                        estadoMT1: "false",
                        martesT2: martesT2,
                        estadoMT2: "false",
                        miercolesT1: miercolesT1,
                        estadoMIT1: "false",
                        miercolesT2: miercolesT2,
                        estadoMIT2: "false",
                        juevesT1: juevesT1,
                        estadoJT1: "false",
                        juevesT2: juevesT2,
                        estadoJT2: "false",
                        viernesT1: viernesT1,
                        estadoVT1: "false",
                        viernesT2: viernesT2,
                        estadoVT2: "false",
                        sabadoT1: sabadoT1,
                        estadoST1: "false",
                    },
                    resultados: listResultados,
                    materiaPrima: listRegistros,
                    observaciones: formData.observaciones,
                    estado: "true"
                }
                // console.log(dataTemp)
                // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
                LogsInformativos("Se ha registrado una nueva planeación con folio " + dataTemp.folio, dataTemp)
                // Modificar el pedido creado recientemente
                registraRequerimiento(dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;
                    // console.log(response)
                    toast.success(mensaje)
                    setLoading(false)
                    rutaRegreso()
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const [listOVCargadas, setListOVCargadas] = useState([]);

    const addItemsOV = () => {
        const ordenVenta = document.getElementById("ordenVenta").value
        const numeroInterno = formDataVenta.numeroInterno
        const cantidadPedidaOV = document.getElementById("cantidadPedidaOV").value
        const cantidadProducirOV = document.getElementById("cantidadProducirOV").value

        if (!ordenVenta || !cantidadPedidaOV || !cantidadProducirOV) {
            toast.warning("Completa la informacion de la orden de venta");
        } else {
            const dataTemp = {
                ordenVenta: ordenVenta,
                cantidadPedidaOV: cantidadPedidaOV,
                cantidadProducirOV: cantidadProducirOV,
                numeroInterno: numeroInterno
            }
            // console.log(dataTemp)

            setListOVCargadas(
                [...listOVCargadas, dataTemp]
            );

            // Actualizacion del tracking
            LogTrackingActualizacion(ordenVenta, "En planeación", "2")
            LogPedidoActualizacion(formDataPlaneacion.id, numeroInterno, formDataPlaneacion.descripcion, cantidadProducirOV, formDataPlaneacion.um, ordenVenta)

            //setCargaProductos(initialFormDataProductos)
            document.getElementById("ordenVenta").value = ""

            document.getElementById("cantidadPedidaOV").value = ""
            document.getElementById("cantidadProducirOV").value = ""

            setFormDataVenta(initialFormDataVenta());
        }
    }

    console.log(formDataVenta);

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaOV = () => {
        //setCargaProductos(initialFormDataProductos)
        document.getElementById("ordenVenta").value = ""
        document.getElementById("cantidadPedidaOV").value = ""
        document.getElementById("cantidadProducirOV").value = ""

        setFormDataVenta(initialFormDataVenta());
    }

    // Para eliminar productos del listado
    const removeItemOV = (OV) => {
        let newArray = listOVCargadas;
        newArray.splice(newArray.findIndex(a => a.ordenVenta === OV.ordenVenta), 1);
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

    const [cantidadPedir, setCantidadPedir] = useState(0);

    const [cantidadPedirMB, setCantidadPedirMB] = useState(0);

    const [cantidadPedirEmpaques, setCantidadPedirEmpaques] = useState(0);

    const calcularTotales = () => {
        setCantidadPedir(Number(kgMaterial) - Number(cantidadProductoAlmacen))
        setCantidadPedirMB(Number(pigMB) - Number(cantidadMBAlmacen))
        setCantidadPedirEmpaques(Number(bolsasCajasUtilizar) - Number(cantidadEmpaquesAlmacen))
    }

    useEffect(() => {
        calcularTotales()
    }, [formData.materiaPrima, formDataPlaneacion.idMaterial, totalProducir]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataPlaneacion({ ...formDataPlaneacion, [e.target.name]: e.target.value })
        setFormDataVenta({ ...formDataVenta, [e.target.name]: e.target.value });
    }

    const [cantidadProducir, setCantidadProducir] = useState(0);

    const cargarCantidadProducir = () => {
        setCantidadProducir(formDataVenta.cantidadProducirVenta)
    }

    useEffect(() => {
        cargarCantidadProducir();
    }, [formDataVenta.cantidadProducirVenta]);

    const [lunesT1, setLunesT1] = useState();

    const [lunesT2, setLunesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicial);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 1);
        //formato de salida para la fecha
        setLunesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setLunesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicial]);

    const [martesT1, setMartesT1] = useState();

    const [martesT2, setMartesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicial);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 2);
        //formato de salida para la fecha
        setMartesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setMartesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicial]);

    const [miercolesT1, setMiercolesT1] = useState();

    const [miercolesT2, setMiercolesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicial);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 3);
        //formato de salida para la fecha
        setMiercolesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setMiercolesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicial]);

    const [juevesT1, setJuevesT1] = useState();

    const [juevesT2, setJuevesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicial);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 4);
        //formato de salida para la fecha
        setJuevesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setJuevesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicial]);

    const [viernesT1, setViernesT1] = useState();

    const [viernesT2, setViernesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicial);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 5);
        //formato de salida para la fecha
        setViernesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setViernesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicial]);

    const [sabadoT1, setSabadoT1] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(fechaInicial);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 6);
        //formato de salida para la fecha
        setSabadoT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [fechaInicial]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva planeación
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
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        <div className="datosGenerales">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Requerimiento
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            ITEM
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="itemOV"
                                            name="itemOV"
                                            value={itemOV}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Orden de venta
                                        </Form.Label>
                                        <div className="flex items-center mb-1">
                                            <Form.Control
                                                id="ordenVenta"
                                                type="text"
                                                placeholder="Orden de venta"
                                                name="ordenVenta"
                                                value={formDataVenta.ordenVenta}
                                                disabled
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                title="Buscar entre las ordenes de venta"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarOV(
                                                        <BuscarProductosOV
                                                            setFormData={setFormDataVenta}
                                                            setShowModal={setShowModal}
                                                        />)
                                                }}
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad pedida
                                        </Form.Label>
                                        <Form.Control
                                            id="cantidadPedidaOV"
                                            type="number"
                                            min="0"
                                            placeholder="Cantidad pedida"
                                            name="cantidadPedidaVenta"
                                            value={formDataVenta.cantidadRequerida}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a producir
                                        </Form.Label>
                                        <Form.Control
                                            id="cantidadProducirOV"
                                            type="number"
                                            placeholder="Cantidad a producir"
                                            name="cantidadProducirVenta"
                                            value={cantidadProducir}
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
                                                    title=" Agregar la orden de venta"
                                                    className="editar"
                                                    onClick={() => {
                                                        addItemsOV()
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant="danger"
                                                    title="Cancelar la orden de venta"
                                                    className="editar"
                                                    onClick={() => {
                                                        cancelarCargaOV()
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faX} className="text-lg" />
                                                </Button>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridMateriaPrima" className="producto">
                                        <Form.Label>
                                            Producto
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPlaneacion.descripcion}
                                            name="materiaPrima"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            UM
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPlaneacion.um}
                                            placeholder="UM"
                                            name="um"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Almacen producto terminado
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={almacenProducto}
                                            onChange={e => setAlmacenProducto(e.target.value)}
                                            placeholder="Almacen producto terminado"
                                            name="almacenPT"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Cliente
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre cliente"
                                            name="nombreCliente"
                                            value={formDataPlaneacion.nombreCliente}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Semana
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Semana"
                                            name="semana"
                                            value={semana}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <hr />

                                <Badge bg="secondary" className="tituloFormularioDetalles">
                                    <h4>Listado de ordenes de ventas agregadas</h4>
                                </Badge>
                                <br />
                                <hr />
                                {/* Inicia tabla informativa del listado de articulos */}
                                <Table className="responsive-tableRegistroVentas"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Orden de venta</th>
                                            <th scope="col">Cantidad pedida</th>
                                            <th scope="col">Cantidad a producir</th>
                                            <th scope="col">Eliminar</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                    </tfoot>
                                    <tbody>
                                        {map(listOVCargadas, (ordenVenta, index) => (
                                            <tr key={index}>
                                                <td scope="row">
                                                    {index + 1}
                                                </td>
                                                <td data-title="ordenVenta">
                                                    {ordenVenta.ordenVenta}
                                                </td>
                                                <td data-title="cantidadPedidaOV">
                                                    {ordenVenta.cantidadPedidaOV}
                                                </td>
                                                <td data-title="cantidadProducirOV">
                                                    {ordenVenta.cantidadProducirOV}
                                                </td>
                                                <td data-title="Eliminar">
                                                    <div
                                                        className="eliminarProductoListado"
                                                        title="Eliminar la orden de venta"
                                                        onClick={() => {
                                                            removeItemOV(ordenVenta)
                                                        }}
                                                    >
                                                        ❌
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                <Row className="mb-3">

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Total a producir
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Total a producir"
                                            name="totalProducir"
                                            value={totalProducir}
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                            </Container>
                        </div>

                        <br />


                        <div className="datosPlaneacion">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Planeación
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            No. Molde
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero de molde"
                                            defaultValue={formDataPlaneacion.noMolde}
                                            name="noMolde"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            No. Cavidades
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            defaultValue={formDataPlaneacion.cavMolde}
                                            placeholder="Numero de cavidades"
                                            name="numeroCavidades"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Col>
                                        <Form.Label align="center">
                                            Maquina
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Label align="center">
                                            Ciclo (seg)
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Label align="center">
                                            Pieza/Turno
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Label align="center">
                                            Piezas por bolsa o caja
                                        </Form.Label>
                                    </Col>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                defaultValue={formData.noMaquina}
                                                placeholder="Numero de maquina"
                                                name="noMaquina"
                                            >
                                                <option>Elige una opción</option>
                                                {map(listMaquinas, (maquina, index) => (
                                                    <option value={maquina?.numeroMaquina + "/" + maquina?.marca}>{maquina?.numeroMaquina + "-" + maquina?.marca}</option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo1"
                                                defaultValue={formDataPlaneacion.tiempoCiclo1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="pieza1"
                                                value={piezasTurno1.toFixed(2)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="bolsa1"
                                                defaultValue={formDataPlaneacion.noPiezasxEmpaque}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>
                        <br />

                        <div className="datosBOM">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        BOM
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Material
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPlaneacion.descripcionMP}
                                            placeholder="Material"
                                            name="Material"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Molido
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Molido"
                                            defaultValue={formDataPlaneacion.porcentajeMolido}
                                            name="Molido"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Peso de la pieza (Kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            defaultValue={formDataPlaneacion.pesoPiezas}
                                            placeholder="Peso de la pieza"
                                            name="pesoPieza"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Peso colada (Kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            defaultValue={formDataPlaneacion.pesoColada}
                                            placeholder="Peso colada"
                                            name="pesoColada"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Empaque
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPlaneacion.descripcionBolsa}
                                            placeholder="Empaque"
                                            name="empaque"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Pigmento/MB
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pigmento/MB"
                                            defaultValue={formDataPlaneacion.descripcionPigmento}
                                            name="Pigmento"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Aplicación (gr/kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            defaultValue={formDataPlaneacion.aplicacionGxKG}
                                            placeholder="Apliación (gr/kg)"
                                            name="aplicacion"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Bolsas o cajas a utilizar
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={Math.ceil(bolsasCajasUtilizar)}
                                            placeholder="Bolsas o cajas a utilizar"
                                            name="bolsasCajasUtilizar"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Material x turno
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Material x turno"
                                            name="materialTurno"
                                            value={materialTurno.toFixed(3)}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Merma (%)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="merma"
                                            name="merma"
                                            defaultValue={formDataPlaneacion.porcentajeScrap}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Kg de material
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de material"
                                            name="kgMaterial"
                                            value={kgMaterial.toFixed(2)}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Kg de PIG o MB
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de PIG o MB"
                                            name="kgPIGMB"
                                            value={pigMB.toFixed(2)}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Notas importantes
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Notas importantes"
                                            name="notasImportantes"
                                            defaultValue={formData.notasImportantes}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Elaboro
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Elaboro"
                                            name="elaboro"
                                            defaultValue={formData.elaboro}
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="datosBOM">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Resumen
                                    </h4>
                                </div>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Material
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Material"
                                            name="material"
                                            value={formDataPlaneacion.descripcionMP}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            KG necesarios
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de material"
                                            name="kgMaterial"
                                            value={kgMaterial.toFixed(2)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad en almacen
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de material"
                                            name="CantidadMP"
                                            value={Number(cantidadProductoAlmacen)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad sugerida
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="cantidad a pedir"
                                            name="cantidadMP"
                                            value={Number(kgMaterial) - Number(cantidadProductoAlmacen)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a pedir
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="cantidad a pedir"
                                            name="cantidadPedir"
                                            onChange={e => setCantidadPedir(e.target.value)}
                                            value={cantidadPedir}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Pigmento/Master Bach
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Pigmento"
                                            name="pigmento"
                                            value={formDataPlaneacion.descripcionPigmento}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            KG necesarios
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de material"
                                            name="kgMaterial"
                                            value={pigMB.toFixed(2)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Disponible en almacen
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de material"
                                            name="CantidadMP"
                                            value={Number(cantidadMBAlmacen)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad sugerida
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="cantidad a pedir"
                                            name="cantidadMB"
                                            value={Number(pigMB) - Number(cantidadMBAlmacen)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a pedir
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="cantidad a pedir"
                                            name="cantidadPedirMB"
                                            onChange={e => setCantidadPedirMB(e.target.value)}
                                            value={cantidadPedirMB}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Empaque
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Empaque"
                                            name="empaque"
                                            value={formDataPlaneacion.descripcionBolsa}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad necesaria
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Cantidad necesaria"
                                            name="cantidadNecesaria"
                                            value={Math.ceil(bolsasCajasUtilizar)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Disponible en almacen
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Empaques"
                                            name="CantidadEmpaques"
                                            value={Number(cantidadEmpaquesAlmacen)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad sugerida
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="cantidad a pedir"
                                            name="cantidadEmpaques"
                                            value={Number(Math.ceil(bolsasCajasUtilizar)) - Number(cantidadEmpaquesAlmacen)}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a pedir
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="cantidad a pedir"
                                            name="cantidadPedirEmpaques"
                                            onChange={e => setCantidadPedirEmpaques(e.target.value)}
                                            value={Math.ceil(cantidadPedirEmpaques)}
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="datosResultado">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Resultados
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Col align="right">
                                        <Button
                                            variant="success"
                                            title="Agregar un resultado"
                                            className="agregar"
                                            onClick={() => {
                                                agregarResultado(
                                                    <AgregarResultado
                                                        setListResultados={setListResultados}
                                                        listResultados={listResultados}
                                                        registroAnterior={registroAnterior}
                                                        setRegistroAnterior={setRegistroAnterior}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        >
                                            Agregar resultado
                                        </Button>
                                    </Col>
                                </Row>

                                <hr />

                                {/* Listado de productos  */}
                                <div className="tablaProductos">

                                    {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                                    {/* Inicia tabla informativa  */}
                                    <Badge bg="secondary" className="tituloListadoProductosSeleccionados">
                                        <h4>Listado de resultados agregados</h4>
                                    </Badge>
                                    <br />
                                    <hr />
                                    <Table className="responsive-tableRegistroVentas"
                                    >
                                        <thead>
                                            <tr>
                                                <th scope="col">ITEM</th>
                                                <th scope="col">Fecha</th>
                                                <th scope="col">Acumulado</th>
                                                <th scope="col">Turno</th>
                                                <th scope="col">Piezas defectuosas</th>
                                                <th scope="col">Operador</th>
                                                <th scope="col">Eficiencia</th>
                                                <th scope="col">Ciclo</th>
                                                <th scope="col">Cantidad fabricada</th>
                                                <th scope="col">Observaciones</th>
                                                <th scope="col">Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                        </tfoot>
                                        <tbody>
                                            {map(listResultados, (resultado, index) => (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        {index + 1}
                                                    </th>
                                                    <td data-title="Material">
                                                        {resultado.fecha}
                                                    </td>
                                                    <td data-title="Descripcion">
                                                        {resultado.acumulado}
                                                    </td>
                                                    <td data-title="UM">
                                                        {resultado.turno}
                                                    </td>
                                                    <td data-title="Descripción">
                                                        {resultado.piezasDefectuosas}
                                                    </td>
                                                    <td data-title="Orden de compra">
                                                        {resultado.operador}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {resultado.eficiencia}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {resultado.ciclo}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {resultado.cantidadFabricada}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {resultado.observaciones}
                                                    </td>
                                                    <td data-title="Eliminar">
                                                        <div
                                                            className="eliminarProductoListado"
                                                            title="Eliminar el resultado"
                                                            onClick={() => {
                                                                removeItemResultado(resultado)
                                                            }}
                                                        >
                                                            ❌
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Container>
                        </div>

                        <br />

                        <div className="datosBOM">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Materia prima
                                    </h4>
                                </div>
                                <Row className="mb-3">
                                    <Col align="right">
                                        <Button
                                            variant="success"
                                            title="Agregar un registro"
                                            className="agregar"
                                            onClick={() => {
                                                agregarRegistro(
                                                    <AgregarRegistro
                                                        listRegistros={listRegistros}
                                                        setListRegistros={setListRegistros}
                                                        registroAnterior={registroAnteriorMaterial}
                                                        setRegistroAnterior={setRegistroAnteriorMaterial}
                                                        kgMaterial={kgMaterial}
                                                        setShowModal={setShowModal}
                                                    />)
                                            }}
                                        >
                                            Agregar registro
                                        </Button>
                                    </Col>
                                </Row>

                                <hr />

                                {/* Listado de productos  */}
                                <div className="tablaProductos">

                                    {/* ID, item, cantidad, um, descripcion, orden de compra, observaciones */}
                                    {/* Inicia tabla informativa  */}
                                    <Badge bg="secondary" className="tituloListadoProductosSeleccionados">
                                        <h4>Listado de registros de materia prima agregados</h4>
                                    </Badge>
                                    <br />
                                    <hr />
                                    <Table className="responsive-tableRegistroVentas"
                                    >
                                        <thead>
                                            <tr>
                                                <th scope="col">ITEM</th>
                                                <th scope="col">Fecha</th>
                                                <th scope="col">Cantidad surtida</th>
                                                <th scope="col">Acumulado</th>
                                                <th scope="col">Material</th>
                                                <th scope="col">Pendiente de surtir</th>
                                                <th scope="col">Virgen/Molido</th>
                                                <th scope="col">Surtio</th>
                                                <th scope="col">Recibio</th>
                                                <th scope="col">Observaciones</th>
                                                <th scope="col">Eliminar</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                        </tfoot>
                                        <tbody>
                                            {map(listRegistros, (registro, index) => (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        {index + 1}
                                                    </th>
                                                    <td data-title="Material">
                                                        {registro.fecha}
                                                    </td>
                                                    <td data-title="Descripcion">
                                                        {registro.cantidadSurtida}
                                                    </td>
                                                    <td data-title="Descripcion">
                                                        {registro.acumulado}
                                                    </td>
                                                    <td data-title="UM">
                                                        {registro.material}
                                                    </td>
                                                    <td data-title="Descripción">
                                                        {registro.pendienteSurtir}
                                                    </td>
                                                    <td data-title="Orden de compra">
                                                        {registro.virgenMolido}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {registro.surtio}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {registro.recibio}
                                                    </td>
                                                    <td data-title="Observaciones">
                                                        {registro.observaciones}
                                                    </td>
                                                    <td data-title="Eliminar">
                                                        <div
                                                            className="eliminarProductoListado"
                                                            title="Eliminar el registro"
                                                            onClick={() => {
                                                                removeItemRegistro(registro)
                                                            }}
                                                        >
                                                            ❌
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Container>
                        </div>

                        <br />

                        <div className="observaciones">
                            <Container fluid>
                                <br />
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Observaciones
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Observaciones"
                                            name="observaciones"
                                            defaultValue={formData.observaciones}
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar la información del formulario"
                                    variant="success"
                                    className="registrar"
                                >
                                    {!loading ? "Registrar" : <Spinner animation="border" />}
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

            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataPlaneacion(data) {
    return {
        id: data._id,
        noInterno: data.noInterno,
        cliente: data.cliente,
        nombreCliente: data.nombreCliente,
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
        cliente: "",
        nombreCliente: "",
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

function initialFormData() {
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
        noMaquina: "",
        elaboro: "",
        notasImportantes: "",
        observaciones: ""
    }
}

function initialFormDataVenta() {
    return {
        ordenVenta: "",
        cantidadRequerida: "",
        cantidadProducirVenta: "",
        producto: "",
        numeroInterno: "",
        cliente: ""
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

export default RegistraRequerimientosPlaneacion;
