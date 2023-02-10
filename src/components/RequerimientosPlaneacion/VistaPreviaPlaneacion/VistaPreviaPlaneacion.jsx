import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Image, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import BuscarOV from "../../../page/BuscarOV";
import { useHistory, useParams } from "react-router-dom";
import "./VistaPreviaPlaneacion.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { listarMatrizProductosActivos, obtenerMatrizProducto } from "../../../api/matrizProductos";
import { map } from "lodash";
import { listarAlmacenPT, obtenerDatosAlmacenPT } from "../../../api/almacenPT";
import { obtenerRequerimiento, actualizaRequerimiento } from "../../../api/requerimientosPlaneacion";
import { toast } from "react-toastify";
import { obtenerMaquina } from "../../../api/maquinas";
import { obtenerDatosMP } from "../../../api/almacenMP";
import { obtenerDatosPedidoVenta } from "../../../api/pedidoVenta"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from '../../Logs/LogsSistema/LogsSistema';
import { obtenerDatosArticulo } from '../../../api/almacenes';
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";

function VistaPreviaPlaneacion(props) {
    const { setRefreshCheckLogin } = props;

    const descargaPDF = async () => {
    }

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

    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState("");

    const [listOVCargadas, setListOVCargadas] = useState([]);

    const [cantidadPedir, setCantidadPedir] = useState(0);

    const [cantidadPedirMB, setCantidadPedirMB] = useState(0);

    const [cantidadPedirEmpaques, setCantidadPedirEmpaques] = useState(0);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataVenta, setFormDataVenta] = useState(initialFormDataVenta());

    // Para almacenar la informacion del formulario
    const [formDataPlaneacion, setFormDataPlaneacion] = useState(initialFormDataPlaneacionInitial());

    const params = useParams();
    const { id } = params

    // Almacenar informacion
    const [informacionRequerimiento, setInformacionRequerimiento] = useState(initialValues);

    useEffect(() => {
        //
        obtenerRequerimiento(id).then(response => {
            const { data } = response;
            setFormDataVenta(initialFormDataVenta(data));
            setInformacionRequerimiento(valoresAlmacenados(data));
            setListOVCargadas(data.requerimiento.ordenVenta);
            setCantidadAlmacen(data.datosRequisicion.almacenMP);
            setCantidadPedir(data.datosRequisicion.cantidadPedir);
            setCantidadPedirEmpaques(data.datosRequisicion.cantidadPedirEmpaques);
            setCantidadPedirMB(data.datosRequisicion.cantidadPedirMB);
            setOrdenVentaPrincipal(data.requerimiento.ov);

            setAlmacenProducto(data.requerimiento.almacenProductoTerminado);
            setCantidadPedir(data.datosRequisicion.cantidadPedir);
            setCantidadPedirMB(data.datosRequisicion.cantidadPedirMB);
            setCantidadPedirEmpaques(data.datosRequisicion.cantidadPedirEmpaques);

            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosMP(formDataPlaneacion.idMaterial).then(response => {
                const { data } = response;
                setCantidadAlmacen(data.cantidadExistencia)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.idMaterial]);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadAlmacen, setCantidadAlmacen] = useState("0");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosPedidoVenta(ordenVentaPrincipal).then(response => {
                const { data } = response;
                console.log(data)
                setProducto(data.productos)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [ordenVentaPrincipal]);

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

    const [unidadMedida, setUnidadMedida] = useState("Piezas");

    const [cantidad, setCantidad] = useState("0");

    const [producto, setProducto] = useState([]);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadMBAlmacen, setCantidadMBAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadEmpaquesAlmacen, setCantidadEmpaquesAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadProductoAlmacen, setCantidadProductoAlmacen] = useState(0);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerDatosAlmacenPT(formDataPlaneacion.noInterno).then(response => {
                const { data } = response;
                setUnidadMedida(data.um);
                setCantidad(data.existenciasTotales)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.noInterno]);


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
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
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

    console.log(informacionRequerimiento.producto)

    const onSubmit = e => {
        e.preventDefault();

        if (!informacionRequerimiento.semana) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            const temp = informacionRequerimiento.producto.split("/");

            const dataTemp = {
                requerimiento: {
                    semana: informacionRequerimiento.semana,
                    producto: temp[0],
                    nombreProducto: temp[1],
                    um: formDataPlaneacion.um,
                    ov: ordenVentaPrincipal,
                    almacenProductoTerminado: almacenProducto,
                    ordenVenta: listOVCargadas,
                    nombreProveedor: temp[2],
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
            obtenerRequerimiento(id).then(response => {
                const { data: { _id, folio } } = response;
                // Modificar el pedido creado recientemente
                actualizaRequerimiento(_id, dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;

                    LogsInformativos("Se a modificado la planeación " + datos.folio, dataTemp);
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

            //setCargaProductos(initialFormDataProductos)
            document.getElementById("ordenVenta").value = ""
            document.getElementById("cantidadPedidaOV").value = ""
            document.getElementById("cantidadProducirOV").value = ""
            setFormDataVenta(initialFormDataVenta);
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaOV = () => {
        //setCargaProductos(initialFormDataProductos)
        document.getElementById("ordenVenta").value = ""
        document.getElementById("cantidadPedidaOV").value = ""
        document.getElementById("cantidadProducirOV").value = ""
        setFormDataVenta(initialFormDataVenta);
    }

    // Para eliminar productos del listado
    const removeItemOV = (OV) => {
        let newArray = listOVCargadas;
        newArray.splice(newArray.findIndex(a => a.ordenVenta === OV.ordenVenta), 1);
        setListOVCargadas([...newArray]);
    }

    const itemOV = listOVCargadas.length + 1;

    let totalProducir = (listOVCargadas.reduce((amount, item) => (amount + parseInt(item.cantidadProducirOV)), 0));

    let kgMaterial = ((Number(formDataPlaneacion.pesoPiezas) + (Number(formDataPlaneacion.pesoColada) / Number(formDataPlaneacion.cavMolde))) * Number(totalProducir)) * (1 + (Number(formDataPlaneacion.porcentajeScrap) / 100));

    let materialTurno = (((Number(formDataPlaneacion.pesoColada) / Number(formDataPlaneacion.cavMolde)) + Number(formDataPlaneacion.pesoPiezas)) * Number(formDataPlaneacion.piezasxTurno)) * (1 + (Number(formDataPlaneacion.porcentajeScrap) / 100));

    let pigMB = (Number(formDataPlaneacion.aplicacionGxKG) * Number(kgMaterial)) / 1000;

    let bolsasCajasUtilizar = (Number(totalProducir) / Number(formDataPlaneacion.noPiezasxEmpaque));

    let piezasTurno1 = (((3600 / Number(formDataPlaneacion.tiempoCiclo1)) * Number(formDataPlaneacion.cavMolde)) * 12);

    let piezasTurno2 = (((3600 / Number(formDataPlaneacion.tiempoCiclo2)) * Number(formDataPlaneacion.cavMolde)) * 12);

    let piezasTurno3 = (((3600 / Number(formDataPlaneacion.tiempoCiclo3)) * Number(formDataPlaneacion.cavMolde)) * 12);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataPlaneacion({ ...formDataPlaneacion, [e.target.name]: e.target.value })
        setInformacionRequerimiento({ ...informacionRequerimiento, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const temp = informacionRequerimiento.producto.split("/");
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMatrizProducto(temp[0]).then(response => {
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
    }, [informacionRequerimiento.producto]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Detalles de la planeación
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
                <br/>
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
                                            Semana
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            placeholder="Semana"
                                            name="semana"
                                            defaultValue={informacionRequerimiento.semana}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridMateriaPrima" className="producto">
                                        <Form.Label>
                                            Producto
                                        </Form.Label>
                                        {producto.length == 1 ? (
                                            <>
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={formDataPlaneacion.descripcion}
                                                    name="materiaPrima"
                                                    disabled
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Form.Control as="select"
                                                    onChange={(e) => {
                                                        handleMateriaPrima(e.target.value)
                                                    }}
                                                    defaultValue={formData.materiaPrima}
                                                    name="materiaPrima"
                                                    disabled
                                                >
                                                    <option>Elige una opción</option>
                                                    {map(producto, (productos, index) => (
                                                        <option
                                                            key={index}
                                                            value={productos?.ID + "/" + productos?.item}
                                                        >
                                                            {productos?.item}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </>
                                        )}
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
                                            disabled
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
                                <table className="responsive-tableRegistroVentas"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Orden de venta</th>
                                            <th scope="col">Cantidad pedida</th>
                                            <th scope="col">Cantidad a producir</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                    </tfoot>
                                    <tbody>
                                        {map(listOVCargadas, (ordenVenta, index) => (
                                            <tr key={index}>
                                                <th scope="row">
                                                    {index + 1}
                                                </th>
                                                <td data-title="ordenVenta">
                                                    {ordenVenta.ordenVenta}
                                                </td>
                                                <td data-title="cantidadPedidaOV">
                                                    {ordenVenta.cantidadPedidaOV}
                                                </td>
                                                <td data-title="cantidadProducirOV">
                                                    {ordenVenta.cantidadProducirOV}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

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
                                            disabled
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
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Col></Col>
                                    <Col>
                                        <Form.Label align="center">
                                            No. Maquina
                                        </Form.Label>
                                    </Col>
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
                                        <Col sm={2}>
                                            <Form.Label align="center">
                                                Opcion 1
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="numeroMaquina1"
                                                defaultValue={numeroMaquina1}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="maquina1"
                                                defaultValue={nombreMaquina1}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo1"
                                                defaultValue={formDataPlaneacion.tiempoCiclo1}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="pieza1"
                                                value={piezasTurno1.toFixed(2)}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="bolsa1"
                                                defaultValue={formDataPlaneacion.noPiezasxEmpaque}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={2}>
                                            <Form.Label align="center">
                                                Opcion 2
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="numeroMaquina2"
                                                defaultValue={numeroMaquina2}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="maquina2"
                                                defaultValue={nombreMaquina2}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo2"
                                                defaultValue={formDataPlaneacion.tiempoCiclo2}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="pieza2"
                                                value={piezasTurno2.toFixed(2)}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="bolsa2"
                                                defaultValue={formDataPlaneacion.noPiezasxEmpaque}
                                                disabled
                                            />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                        <Col sm={2}>
                                            <Form.Label align="center">
                                                Opcion 3
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="numeroMaquina3"
                                                defaultValue={numeroMaquina3}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="maquina3"
                                                defaultValue={nombreMaquina3}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo3"
                                                defaultValue={formDataPlaneacion.tiempoCiclo3}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="pieza3"
                                                value={piezasTurno3.toFixed(2)}
                                                disabled
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="bolsa3"
                                                defaultValue={formDataPlaneacion.noPiezasxEmpaque}
                                                disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
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
                                            disabled
                                        />
                                    </Form.Group>
                                </Row>
                            </Container>
                        </div>

                        <br />

                        <div className="botones">
                            <Form.Group as={Row} className="botones">
                                <Row>
                                    <Col>
                                        <div
                                            className="generacionPDF"
                                        >
                                            <Image
                                                src={LogoPDF}
                                                className="logoPDF"
                                                onClick={() => {
                                                    descargaPDF()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className="regreso"
                                        >
                                            <Image
                                                src={Regreso}
                                                className="regresarVistaAnterior"
                                                onClick={() => {
                                                    rutaRegreso()
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>

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
        um: data.um,
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
        idPigmento: data.pigmentoMasterBach.idPigmento,
        umMaterial: data.materiaPrima.umMaterial,
        umPigmento: data.pigmentoMasterBach.umPigmento,
        umEmpaque: data.materialEmpaque.umEmpaque,
        folioPigmento: data.pigmentoMasterBach.folioPigmento,
        descripcionPigmento: data.pigmentoMasterBach.descripcion,
        precioPigmento: data.pigmentoMasterBach.precioPigmento,
        aplicacionGxKG: data.pigmentoMasterBach.aplicacionGxKG,
        proveedor: data.pigmentoMasterBach.proveedor,
        tiempoCiclo: data.tiempoCiclo,
        noOperadores: data.noOperadores,
        piezasxHora: data.piezasxHora,
        piezasxTurno: data.piezasxTurno,
        idEmpaque: data.materialEmpaque.idEmpaque,
        folioEmpaque: data.materialEmpaque.folioEmpaque,
        descripcionBolsa: data.materialEmpaque.descripcionBolsa,
        precioEmpaque: data.materialEmpaque.precioEmpaque,
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

function initialFormDataVenta() {
    return {
       ordenVenta: "",
       cantidadRequerida: "",
       cliente: ""
    }
}

function initialFormDataPlaneacionInitial() {
    return {
        noInterno: "",
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
        cantidadPedir: "",
    }
}

// Valores iniciales para pedido
function initialValues() {
    return {
        folio: "",
        requerimiento: "",
        semana: "",
        producto: "",
        um: "",
        almacenProductoTerminado: "",
        ordenVenta: "",
        ordenCompra: "",
        release: "",
        totalProducir: "",
        planeacion: "",
        numeroMolde: "",
        numeroCavidades: "",
        opcionesMaquinaria: "",
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
        bom: "",
        material: "",
        molida: "",
        pesoPieza: "",
        pesoColada: "",
        kgMaterial: "",
        pigmento: "",
        apliacion: "",
        pigMb: "",
        materialxTurno: "",
        merma: "",
        empaque: "",
        bolsasCajasUtilizar: "",
        cantidadPedir: "",
    }
}

// Valores almacenados
function valoresAlmacenados(data) {
    const { folio, requerimiento, planeacion, bom, datosRequisicion } = data;

    return {
        folio: folio,
        requerimiento: requerimiento,
        semana: requerimiento.semana,
        producto: requerimiento.producto + "/" + requerimiento.nombreProducto + "/" + requerimiento.nombreProveedor,
        um: requerimiento.um,
        almacenProductoTerminado: requerimiento.almacenProductoTerminado,
        ordenVenta: requerimiento.ordenVenta,
        totalProducir: requerimiento.totalProducir,
        planeacion: planeacion,
        numeroMolde: planeacion.numeroMolde,
        numeroCavidades: planeacion.numeroCavidades,
        opcionesMaquinaria: planeacion.opcionesMaquiaria,
        numeroMaquina1: planeacion.opcionesMaquinaria[0][1].numeroMaquina1,
        maquina1: planeacion.opcionesMaquinaria[0][1].maquina1,
        ciclo1: planeacion.opcionesMaquinaria[0][1].ciclo1,
        pieza1: planeacion.opcionesMaquinaria[0][1].pieza1,
        bolsa1: planeacion.opcionesMaquinaria[0][1].bolsa1,
        numeroMaquina2: planeacion.opcionesMaquinaria[0][2].numeroMaquina2,
        maquina2: planeacion.opcionesMaquinaria[0][2].maquina2,
        ciclo2: planeacion.opcionesMaquinaria[0][2].ciclo2,
        pieza2: planeacion.opcionesMaquinaria[0][2].pieza2,
        bolsa2: planeacion.opcionesMaquinaria[0][2].bolsa2,
        numeroMaquina3: planeacion.opcionesMaquinaria[0][3].numeroMaquina3,
        maquina3: planeacion.opcionesMaquinaria[0][3].maquina3,
        ciclo3: planeacion.opcionesMaquinaria[0][3].ciclo3,
        pieza3: planeacion.opcionesMaquinaria[0][3].pieza3,
        bolsa3: planeacion.opcionesMaquinaria[0][3].bolsa3,
        bom: bom,
        material: bom.material,
        molido: bom.molido,
        pesoPieza: bom.pesoPieza,
        pesoColada: bom.pesoColada,
        kgMaterial: bom.kgMaterial,
        pigmento: bom.pigmento,
        aplicacion: bom.aplicacion,
        pigMb: bom.pigMb,
        materialxTurno: bom.materialxTurno,
        merma: bom.merma,
        empaque: bom.empaque,
        bolsasCajasUtilizar: bom.bolsasCajasUtilizar,
        datosRequisicion: datosRequisicion,
        cantidadPedir: datosRequisicion.cantidadPedir,
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

export default VistaPreviaPlaneacion;