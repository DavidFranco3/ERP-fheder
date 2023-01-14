import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import BuscarOV from "../../../page/BuscarOV";
import { useHistory } from "react-router-dom";
import "./RegistraProgramaProduccion.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { listarMatrizProductosActivos, obtenerMatrizProducto, obtenerPorNoInternoMatrizProducto } from "../../../api/matrizProductos";
import { map } from "lodash";
import { listarAlmacenPT, obtenerDatosAlmacenPT } from "../../../api/almacenPT";
import { obtenerDatosMP } from "../../../api/almacenMP";
import { registrPrograma, obtenerNumeroPrograma } from "../../../api/programaProduccion";
import { toast } from "react-toastify";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import { obtenerMaquina } from "../../../api/maquinas";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerDatosArticulo } from '../../../api/almacenes';
import BuscarPlaneaccion from '../../../page/BuscarPlaneacion';

function RegistraProgramaProduccion(props) {
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
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataProduccion, setFormDataProduccion] = useState(initialFormDataProduccion());

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
            obtenerMatrizProducto(formDataProduccion.idProducto).then(response => {
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
    }, [formDataProduccion.idProducto]);

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
        enrutamiento.push("/RequerimientosPlaneacion")
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

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.semana) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            const temp = formData.materiaPrima.split("/")

            const dataTemp = {
                folio: folioActual,
                sucursal: getSucursal(),
                requerimiento: {
                    semana: formData.semana,
                    producto: formDataPlaneacion.id,
                    nombreProducto: formDataPlaneacion.descripcion,
                    um: formDataPlaneacion.um,
                    ov: ordenVentaPrincipal,
                    almacenProductoTerminado: almacenProducto,
                    ordenVenta: listOVCargadas,
                    nombreProveedor: formDataPlaneacion.nombreProveedor,
                    totalProducir: totalProducir,
                },
                planeacion: {
                    numeroMolde: formDataPlaneacion.noMolde,
                    numeroCavidades: formDataPlaneacion.cavMolde,
                    opcionesMaquinaria: {
                        1: {
                            numeroMaquina1: numeroMaquina1,
                            maquina1: nombreMaquina1,
                            ciclo1: formDataPlaneacion.tiempoCiclo1,
                            pieza1: piezasTurno1,
                            bolsa1: formDataPlaneacion.noPiezasxEmpaque,
                        },
                        2: {
                            numeroMaquina2: numeroMaquina2,
                            maquina2: nombreMaquina2,
                            ciclo2: formDataPlaneacion.tiempoCiclo2,
                            pieza2: piezasTurno2,
                            bolsa2: formDataPlaneacion.noPiezasxEmpaque,
                        },
                        3: {
                            numeroMaquina3: numeroMaquina3,
                            maquina3: nombreMaquina3,
                            ciclo3: formDataPlaneacion.tiempoCiclo3,
                            pieza3: piezasTurno3,
                            bolsa3: formDataPlaneacion.noPiezasxEmpaque,
                        },
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
                    bolsasCajasUtilizar: bolsasCajasUtilizar
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
                estado: "true"
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
            LogsInformativos("Se ha registrado una nueva planeación con folio " + dataTemp.folio, dataTemp)
            // Modificar el pedido creado recientemente
            RegistraProgramaProduccion(dataTemp).then(response => {
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
                                            value={folioActual}
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
                                        <Form.Label>
                                            Ingrese la fecha del dia lunes de la semana correspondiente
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            defaultValue={formDataPlaneacion.cavMolde}
                                            placeholder="Numero de cavidades"
                                            name="numeroCavidades"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            No. Maquina
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
                                            Maquina
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
                                            Semana
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataProduccion.semana}
                                            placeholder="Semana"
                                            name="semana"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Fecha inicio
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            defaultValue={formDataPlaneacion.pesoColada}
                                            placeholder="Peso colada"
                                            name="pesoColada"
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Cliente
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPrograma.cliente}
                                            placeholder="Material"
                                            name="Material"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Producto a fabricar
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Molido"
                                            defaultValue={formDataProduccion.producto}
                                            name="producto"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantida a fabricar
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
                                            placeholder="Material"
                                            name="Material"
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
                                            type="number"
                                            defaultValue={formDataPlaneacion.pesoPiezas}
                                            placeholder="Peso de la pieza"
                                            name="pesoPieza"
                                        />
                                    </Form.Group>

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
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Operadores
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPrograma.operadores}
                                            placeholder="Material"
                                            name="Material"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            No. Interno
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="No Interno"
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
                                            defaultValue={formDataPlaneacion.pesoPiezas}
                                            placeholder="Peso de la pieza"
                                            name="pesoPieza"
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
                                                value="virgen"
                                                type="radio"
                                                label="Lunes T1"
                                                name="estadoMateriaPrima"
                                                id="virgen"
                                                defaultValue={formData.estadoMateriaPrima}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="paletizado"
                                                type="radio"
                                                label="Miercoles T1"
                                                name="estadoMateriaPrima"
                                                id="paletizado"
                                                defaultValue={formData.estadoMateriaPrima}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="molido"
                                                type="radio"
                                                label="Viernes T1"
                                                name="estadoMateriaPrima"
                                                id="molido"
                                                defaultValue={formData.estadoMateriaPrima}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Lunes T2"
                                                name="contaminacion"
                                                id="si"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="Miercoles T2"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>

                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="Viernes T2"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Martes T1"
                                                name="contaminacion"
                                                id="si"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="Jueves T1"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>

                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="Sabado T1"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={3}>
                                            <Form.Check
                                                value="si"
                                                type="radio"
                                                label="Martes T2"
                                                name="contaminacion"
                                                id="si"
                                                defaultValue={formData.contaminacion}
                                            />
                                        </Col>
                                        <Col sm={1}>
                                        </Col>
                                        <Col sm={3}>
                                            <Form.Check
                                                value="no"
                                                type="radio"
                                                label="Jueves T2"
                                                name="contaminacion"
                                                id="no"
                                                defaultValue={formData.contaminacion}
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

            </Container >

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormDataProduccion() {
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
        stdTurno: data.stdTurno,
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
        kgPIGMB: ""
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

export default RegistraProgramaProduccion;
