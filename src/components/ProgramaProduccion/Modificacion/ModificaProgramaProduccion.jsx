import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import BuscarOV from "../../../page/BuscarOV";
import { useHistory, useParams } from "react-router-dom";
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
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerDatosArticulo } from '../../../api/almacenes';
import BuscarPlaneaccion from '../../../page/BuscarPlaneacion';
import { listarMaquina } from "../../../api/maquinas";

function ModificaProgramaProduccion(props) {
    const { setRefreshCheckLogin } = props;

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
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

    // Recupera la información de la compra
    useEffect(() => {
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
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosMP(formDataPlaneacion.idMaterial).then(response => {
                const { data } = response;
                setCantidadProductoAlmacen(data.cantidadExistencia)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.idMaterial]);

    useEffect(() => {
        const temp = formData.materiaPrima.split("/");
        let idProducto = "";
        if (producto.length == 1) {
            map(producto, (datosProducto, index) => {
                idProducto = datosProducto.ID
            })
        }
        // Para buscar el producto en la matriz de productos
        try {
            obtenerPorNoInternoMatrizProducto(producto.length == 1 ? idProducto : temp[0]).then(response => {
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
    }, [producto.length == 1 ? producto : formData.materiaPrima]);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMatrizProducto(formDataProduccion.producto).then(response => {
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
    }, [formDataProduccion.producto]);

    const [unidadMedida, setUnidadMedida] = useState("Piezas");

    const [cantidad, setCantidad] = useState("0");

    useEffect(() => {
        const temp = formData.materiaPrima.split("/");
        let idProducto = "";
        if (producto.length == 1) {
            map(producto, (datosProducto, index) => {
                idProducto = datosProducto.ID
            })
        }
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosAlmacenPT(producto.length == 1 ? idProducto : temp[0]).then(response => {
                const { data } = response;
                setUnidadMedida(data.um);
                setCantidad(data.existenciasTotales)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [producto.length == 1 ? producto : formData.materiaPrima]);


    const [numeroMaquina1, setNumeroMaquina1] = useState("");

    const [nombreMaquina1, setNombreMaquina1] = useState("");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(formDataPlaneacion.opcion1).then(response => {
                const { data } = response;
                setNumeroMaquina1(data.numeroMaquina);
                setNombreMaquina1(data.marca)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.opcion1]);

    const [numeroMaquina2, setNumeroMaquina2] = useState("");

    const [nombreMaquina2, setNombreMaquina2] = useState("");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(formDataPlaneacion.opcion2).then(response => {
                const { data } = response;
                setNumeroMaquina2(data.numeroMaquina);
                setNombreMaquina2(data.marca)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.opcion2]);

    const [numeroMaquina3, setNumeroMaquina3] = useState("");

    const [nombreMaquina3, setNombreMaquina3] = useState("");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(formDataPlaneacion.opcion3).then(response => {
                const { data } = response;
                setNumeroMaquina3(data.numeroMaquina);
                setNombreMaquina3(data.marca)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.opcion3]);

    let cantidadTotalEntrada = 0;

    let cantidadTotalSalida = 0;

    const [almacenProducto, setAlmacenProducto] = useState(0);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        console.log(formDataPlaneacion.id)
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
    }, [formDataPlaneacion.id]);

    let cantidadTotalEntradaMaterial = 0;

    let cantidadTotalSalidaMaterial = 0;

    useEffect(() => {
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
    }, [formDataPlaneacion.idMaterial]);

    let cantidadTotalEntradaPigmento = 0;

    let cantidadTotalSalidaPigmento = 0;

    useEffect(() => {
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
    }, [formDataPlaneacion.idPigmento]);

    let cantidadTotalEntradaEmpaque = 0;

    let cantidadTotalSalidaEmpaque = 0;

    useEffect(() => {
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
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push(`/ProgramaProduccion/${formDataProduccion.semana}`)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el listado de productos activos
    const [listProductosActivos, setListProductosActivos] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarMatrizProductosActivos().then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProductosActivos && data) {
                    setListProductosActivos(formatModelMatrizProductos(data));
                } else {
                    const datosProductos = formatModelMatrizProductos(data);
                    setListProductosActivos(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarAlmacenPT().then(response => {
                const { data } = response;
                // console.log(data)
                if (!listMateriasPrimas && data) {
                    setListMateriasPrimas(formatModelAlmacenPT(data));
                } else {
                    const datosProductos = formatModelAlmacenPT(data);
                    setListMateriasPrimas(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

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

    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroPrograma().then(response => {
                const { data } = response;
                // console.log(data)
                const { noPrograma } = data;
                setFolioActual(noPrograma)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    console.log(formDataProduccion.nombreProducto);

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
                ordenProduccion: {
                    noMaquina: temp[0],
                    maquina: temp.length == 1 ? formData.maquina : temp[1] + " " + temp[2],
                    semana: formDataProduccion.semana,
                    fechaInicio: formData.fechaInicio,
                    cliente: formDataPrograma.cliente,
                    nombreCliente: formDataPrograma.nombreCliente,
                    producto: formDataProduccion.producto,
                    nombreProducto: formDataProduccion.idProducto,
                    cantidadFabricar: formDataProduccion.cantidadFabricar,
                    acumulado: formDataProduccion.acumulado,
                    ciclo: formDataPrograma.ciclo,
                    cavidades: formDataProduccion.cavidades,
                    stdTurno: formDataPrograma.stdTurno,
                    pendienteFabricar: formDataProduccion.pendienteFabricar,
                    operadores: formDataPrograma.operadores,
                    noInterno: formDataPrograma.noInterno,
                    turnosRequeridos: turnosReq,
                },
                programa: {
                    fechaInicio: formData.fechaInicio,
                    lunesT1: formData.lunesT1,
                    lunesT2: formData.lunesT2,
                    martesT1: formData.martesT1,
                    martesT2: formData.martesT2,
                    miercolesT1: formData.miercolesT1,
                    miercolesT2: formData.miercolesT2,
                    juevesT1: formData.juevesT1,
                    juevesT2: formData.juevesT2,
                    viernesT1: formData.viernesT1,
                    viernesT2: formData.viernesT2,
                    sabadoT1: formData.sabadoT1,
                },
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

    let turnosReq = Number(formDataProduccion.pendienteFabricar) / Number(formDataPrograma.stdTurno);

    const [cantidadPedir, setCantidadPedir] = useState(0);

    useEffect(() => {
        setCantidadPedir(Number(kgMaterial) - Number(cantidadProductoAlmacen))
    }, [formData.materiaPrima, formDataPlaneacion.idMaterial, totalProducir]);

    const [cantidadPedirMB, setCantidadPedirMB] = useState(0);

    useEffect(() => {
        setCantidadPedirMB(Number(pigMB) - Number(cantidadMBAlmacen))
    }, [formData.materiaPrima, formDataPlaneacion.idMaterial, totalProducir]);

    const [cantidadPedirEmpaques, setCantidadPedirEmpaques] = useState(0);

    useEffect(() => {
        setCantidadPedirEmpaques(Number(bolsasCajasUtilizar) - Number(cantidadEmpaquesAlmacen))
    }, [formData.materiaPrima, formDataPlaneacion.idMaterial, totalProducir]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataPlaneacion({ ...formDataPlaneacion, [e.target.name]: e.target.value });
        setFormDataProduccion({ ...formDataProduccion, [e.target.name]: e.target.value });
        setFormDataPrograma({ ...formDataPrograma, [e.target.name]: e.target.value });
    }

    const temp = formData.noMaquina.split("/");

    console.log(temp)

    const [lunesT1, setLunesT1] = useState();

    const [lunesT2, setLunesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(formData.fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 1);
        //formato de salida para la fecha
        setLunesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setLunesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [formData.fechaInicio]);

    const [martesT1, setMartesT1] = useState();

    const [martesT2, setMartesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(formData.fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 2);
        //formato de salida para la fecha
        setMartesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setMartesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [formData.fechaInicio]);

    const [miercolesT1, setMiercolesT1] = useState();

    const [miercolesT2, setMiercolesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(formData.fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 3);
        //formato de salida para la fecha
        setMiercolesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setMiercolesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [formData.fechaInicio]);

    const [juevesT1, setJuevesT1] = useState();

    const [juevesT2, setJuevesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(formData.fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 4);
        //formato de salida para la fecha
        setJuevesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setJuevesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [formData.fechaInicio]);

    const [viernesT1, setViernesT1] = useState();

    const [viernesT2, setViernesT2] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(formData.fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 5);
        //formato de salida para la fecha
        setViernesT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());

        setViernesT2(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [formData.fechaInicio]);

    const [sabadoT1, setSabadoT1] = useState();

    useEffect(() => {
        //la fecha
        const TuFecha = new Date(formData.fechaInicio);

        //nueva fecha sumada
        TuFecha.setDate(TuFecha.getDate() + 6);
        //formato de salida para la fecha
        setSabadoT1(TuFecha.getFullYear() + '-' + (TuFecha.getMonth() + 1) + '-' + TuFecha.getDate());
    }, [formData.fechaInicio]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nuevo programa de producción
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
                                                        <BuscarPlaneaccion
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
                                                <option value={maquina?.numeroMaquina + "/" + maquina?.marca + "/" + maquina?.lugar} selected={maquina?.numeroMaquina == formData.noMaquina}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
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
                                            value={temp.length == 1 ? formData.maquina : temp[1] + " " + temp[2]}
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
                                            defaultValue={formDataProduccion.idProducto}
                                            name="producto"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a fabricar
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataProduccion.cantidadFabricar}
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
                                            defaultValue={formDataProduccion.acumulado}
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
                                            defaultValue={formDataProduccion.cavidades}
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
                                            defaultValue={formDataProduccion.pendienteFabricar}
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

                        <div className="datosBOM">
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

export default ModificaProgramaProduccion;
