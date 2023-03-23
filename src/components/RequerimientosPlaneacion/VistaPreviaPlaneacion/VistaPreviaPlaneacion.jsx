import { useEffect, useMemo, useState } from 'react';
import { Alert, Table, Button, Col, Row, Form, Container, Badge, Image, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useNavigate, useParams } from "react-router-dom";
import "./VistaPreviaPlaneacion.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { listarMatrizProductosActivos, obtenerMatrizProducto } from "../../../api/matrizProductos";
import { obtenerRazonSocialPorNombre } from "../../../api/razonesSociales";
import { map } from "lodash";
import { listarAlmacenPT, obtenerDatosAlmacenPT } from "../../../api/almacenPT";
import { obtenerRequerimiento, actualizaRequerimiento } from "../../../api/requerimientosPlaneacion";
import { toast } from "react-toastify";
import { obtenerMaquina, listarMaquina } from "../../../api/maquinas";
import { obtenerDatosMP } from "../../../api/almacenMP";
import { obtenerDatosPedidoVenta } from "../../../api/pedidoVenta"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos, LogsInformativosLogout } from '../../Logs/LogsSistema/LogsSistema';
import { obtenerDatosArticulo } from '../../../api/almacenes';
import LogoPDF from "../../../assets/png/pdf.png";
import Regreso from "../../../assets/png/back.png";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function VistaPreviaPlaneacion(props) {
    const { setRefreshCheckLogin } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

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


    const [ordenVentaPrincipal, setOrdenVentaPrincipal] = useState("");

    const [listOVCargadas, setListOVCargadas] = useState([]);

    const [cantidadPedir, setCantidadPedir] = useState(0);

    const [cantidadPedirMB, setCantidadPedirMB] = useState(0);

    const [cantidadPedirEmpaques, setCantidadPedirEmpaques] = useState(0);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [formDataSucursal, setFormDataSucursal] = useState(initialFormDataSucursalInitial());

    // Para almacenar la informacion del formulario
    const [formDataVenta, setFormDataVenta] = useState(initialFormDataVenta());

    const [listResultados, setListResultados] = useState([]);

    const [listRegistros, setListRegistros] = useState([]);

    // Para almacenar la informacion del formulario
    const [formDataPlaneacion, setFormDataPlaneacion] = useState(initialFormDataPlaneacionInitial());

    const params = useParams();
    const { id } = params

    // Almacenar informacion
    const [informacionRequerimiento, setInformacionRequerimiento] = useState(initialValues);

    const cargarDatosRequerimiento = () => {
        //
        obtenerRequerimiento(id).then(response => {
            const { data } = response;
            setFormDataVenta(initialFormDataVenta(data));
            setInformacionRequerimiento(valoresAlmacenados(data));
            setListOVCargadas(data.requerimiento.ordenVenta);
            setCantidadPedir(data.datosRequisicion.cantidadPedir);
            setCantidadPedirEmpaques(data.datosRequisicion.cantidadPedirEmpaques);
            setCantidadPedirMB(data.datosRequisicion.cantidadPedirMB);
            setOrdenVentaPrincipal(data.requerimiento.ov);

            setAlmacenProducto(data.requerimiento.almacenProductoTerminado);
            setCantidadPedir(data.datosRequisicion.cantidadPedir);
            setCantidadPedirMB(data.datosRequisicion.cantidadPedirMB);
            setCantidadPedirEmpaques(data.datosRequisicion.cantidadPedirEmpaques);
            setListResultados(data.resultados);
            setListRegistros(data.materiaPrima);

            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarDatosRequerimiento();
    }, []);


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
        enrutamiento(`/RequerimientosPlaneacion/${informacionRequerimiento.semana}`)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadMBAlmacen, setCantidadMBAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadEmpaquesAlmacen, setCantidadEmpaquesAlmacen] = useState(0);

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadProductoAlmacen, setCantidadProductoAlmacen] = useState(0);

    let cantidadTotalEntrada = 0;

    let cantidadTotalSalida = 0;

    const [almacenProducto, setAlmacenProducto] = useState(0);

    const cargarDatosProductos = () => {
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
        cargarDatosProductos();
    }, [formDataPlaneacion.id]);

    let cantidadTotalEntradaMaterial = 0;

    let cantidadTotalSalidaMaterial = 0;

    const cargarDatosArticulos = () => {
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
        cargarDatosArticulos();
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

        if (!informacionRequerimiento.semana) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            const temp = informacionRequerimiento.producto.split("/");
            const temp2 = informacionRequerimiento.noMaquina.split("/");

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
                            numeroMaquina1: temp2[0],
                            maquina1: temp[1],
                            ciclo1: formDataPlaneacion.tiempoCiclo1,
                            pieza1: piezasTurno1,
                            bolsa1: formDataPlaneacion.noPiezasxEmpaque,
                        }
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
                // Modificar el pedido creado recientemente
                actualizaRequerimiento(id, dataTemp).then(response => {
                    const { data: { mensaje, datos } } = response;

                    LogsInformativos("Se a modificado la planeación " + datos.folio, dataTemp);
                    // console.log(response)
                    toast.success(mensaje)
                    setLoading(false)
                    rutaRegreso()
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
            setFormDataVenta(initialFormDataVenta);
        }
    }

    // Para limpiar el formulario de detalles de producto
    const cancelarCargaOV = () => {
        //setCargaProductos(initialFormDataProductos)
        document.getElementById("ordenVenta").value = ""
        document.getElementById("cantidadPedidaOV").value = ""
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
        setFormDataVenta({ ...formDataVenta, [e.target.name]: e.target.value })
    }

    const cargarDatosRazonSocial = () => {
        //
        obtenerRazonSocialPorNombre(getSucursal()).then(response => {
            const { data } = response;
            //console.log(data)
            setFormDataSucursal(initialFormDataSucursal(data));
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarDatosRazonSocial();
    }, [getSucursal()]);

    const cargarDatosMatrizProductos = () => {
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
    }

    useEffect(() => {
        cargarDatosMatrizProductos();
    }, [informacionRequerimiento.producto]);

    const dataPrincipal = () => {
        let newArray = [];
        listOVCargadas.map((detalle, index) => {
            newArray.push([
                {
                    text: index + 1,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.ordenVenta,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.cantidadPedidaOV,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.cantidadProducirOV,
                    fontSize: 9,
                    bold: true,
                },
            ])
        });
        return newArray;
    };

    const list = dataPrincipal();

    const dataResultados = () => {
        let newArray = [];
        listResultados.map((detalle, index) => {
            newArray.push([
                {
                    text: index + 1,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.fecha,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.acumulado,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.turno,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.piezasDefectuosas,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.operador,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.eficiencia,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.ciclo,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.cantidadFabricada,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.observaciones,
                    fontSize: 9,
                    bold: true,
                },
            ])
        });
        return newArray;
    };

    const list2 = dataResultados();

    const dataRegistros = () => {
        let newArray = [];
        listRegistros.map((detalle, index) => {
            newArray.push([
                {
                    text: index + 1,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.fecha,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.acumulado,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.material,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.pendienteSurtir,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.virgenMolido,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.surtio,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.recibio,
                    fontSize: 9,
                    bold: true,
                },
                {
                    text: detalle.observaciones,
                    fontSize: 9,
                    colSpan: 2,
                    bold: true,
                },
                {
                },
            ])
        });
        return newArray;
    };

    const list3 = dataRegistros();

    const descargaPDF = async () => {

        const docDefinition = {
            pageSize: 'LETTER',
            footer: function (currentPage, pageCount) {
                return {
                    table: {
                        widths: ['100%'],
                        body: [
                            [
                                {
                                    border: [false, false, false, false],
                                    text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                                    alignment: 'right',
                                    margin: [5, 2, 10, 20]
                                }
                            ]
                        ]
                    },
                }
            },
            content: [
                {
                    alignment: 'center',
                    style: 'header',
                    image: `data:image/png;base64,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`
                },
                {
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['50%', '50%'],
                        heights: [10, 30],
                        body: [
                            [
                                {
                                    text: `RFC:  ${formDataSucursal.rfc}`,
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: `Razón social:  ${getSucursal()}`,
                                    fontSize: 9,
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: `Dirección:  ${formDataSucursal.calle + " #" + formDataSucursal.numeroExterior + " COL " + formDataSucursal.colonia + ", " + formDataSucursal.municipio + ", " + formDataSucursal.estado}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                        ],
                    }
                },
                {
                    alignment: 'center',
                    text: 'Requerimiento',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Planeación:  ${informacionRequerimiento.folio}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Producto:  ${formDataPlaneacion.descripcion}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Unidad de medida:  ${formDataPlaneacion.um}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Almacen de producto terminado:  ${almacenProducto}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Semana:  ${dayjs(informacionRequerimiento.semana).format("LL")}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Cliente:  ${formDataPlaneacion.nombreCliente}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                        ]
                    }
                },
                {
                    alignment: 'center',
                    text: 'Listado de ordenes de venta seleccionadas',
                    style: 'tableExample',
                    fontSize: 11,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10],
                        body: [
                            [
                                {
                                    text: '# ',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Orden de venta ',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Cantidad pedida ',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Cantidad a producir ',
                                    fontSize: 9,
                                    bold: true,
                                },
                            ],
                        ],
                    }
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10],
                        body:
                            list,
                    }
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['100%'],
                        heights: [10],
                        border: [true, false, true, true],
                        body: [
                            [
                                {
                                    text: `Total a producir:  ${totalProducir}`,
                                    fontSize: 9,
                                    bold: true
                                },
                            ],
                        ],
                    }
                },
                {
                    alignment: 'center',
                    text: 'Planeación',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Número de molde:  ${formDataPlaneacion.noMolde}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Número de cavidades:  ${formDataPlaneacion.cavMolde}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Maquina:  ${informacionRequerimiento.noMaquina}`,
                                    colSpan: 1,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                    text: `Ciclo (seg):  ${formDataPlaneacion.tiempoCiclo1}`,
                                    colSpan: 1,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                    text: `Pieza turno:  ${piezasTurno1.toFixed(2)}`,
                                    colSpan: 1,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                    text: `Piezas por bolsa o caja:  ${formDataPlaneacion.noPiezasxEmpaque}`,
                                    colSpan: 1,
                                    fontSize: 9,
                                    bold: true
                                }
                            ],
                        ]
                    }
                },
                {
                    alignment: 'center',
                    text: 'BOM',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Matrial:  ${formDataPlaneacion.descripcionMP}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `Molido:  ${formDataPlaneacion.porcentajeMolido}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `Peso de la pieza (Kg):  ${formDataPlaneacion.pesoPiezas}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Peso colada (Kg):  ${formDataPlaneacion.pesoColada}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: `Empaque:  ${formDataPlaneacion.descripcionBolsa}`,
                                    colSpan: 1,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                    text: `Pigmento/MB:  ${formDataPlaneacion.descripcionPigmento}`,
                                    colSpan: 1,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                    text: `Aplicación (gr/kg):  ${formDataPlaneacion.aplicacionGxKG}`,
                                    colSpan: 1,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                    text: `Bolsas o cajas a utilizar:  ${Math.ceil(bolsasCajasUtilizar)}`,
                                    colSpan: 1,
                                    fontSize: 9,
                                    bold: true
                                }
                            ],
                            [
                                {
                                    text: `Material x turno:  ${materialTurno.toFixed(3)}`,
                                    colSpan: 1,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                    text: `Merma (%):  ${formDataPlaneacion.porcentajeScrap}`,
                                    colSpan: 1,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                    text: `Kg de material:  ${kgMaterial.toFixed(2)}`,
                                    colSpan: 1,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                    text: `Kg de PIG o MB:  ${pigMB.toFixed(2)}`,
                                    colSpan: 1,
                                    fontSize: 9,
                                    bold: true
                                }
                            ],
                            [
                                {
                                    text: `Notas importantes:  ${informacionRequerimiento.notasImportantes}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Elaboro:  ${informacionRequerimiento.elaboro}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                        ]
                    }
                },
                {
                    alignment: 'center',
                    text: 'Resumen',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['20%', '20%', '20%', '20%', '20%'],
                        heights: [10, 10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Matrial:  ${formDataPlaneacion.descripcionMP}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `KG necesarios:  ${kgMaterial.toFixed(2)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `Cantidad en almacen:  ${Number(cantidadProductoAlmacen)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Cantidad sugerida:  ${Number(kgMaterial) - Number(cantidadProductoAlmacen)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Cantidad a pedir:  ${cantidadPedir}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: `Pigmento/Master Bach:  ${formDataPlaneacion.descripcionPigmento}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `KG necesarios:  ${pigMB.toFixed(2)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `Cantidad en almacen:  ${Number(cantidadMBAlmacen)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Cantidad sugerida:  ${Number(pigMB) - Number(cantidadMBAlmacen)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Cantidad a pedir:  ${cantidadPedirMB}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                }
                            ],
                            [
                                {
                                    text: `Empaque:  ${formDataPlaneacion.descripcionBolsa}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `Cantidad necesaria:  ${Math.ceil(bolsasCajasUtilizar)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true
                                },
                                {
                                    text: `Cantidad en almacen:  ${Number(cantidadEmpaquesAlmacen)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Cantidad sugerida:  ${Number(Math.ceil(bolsasCajasUtilizar)) - Number(cantidadEmpaquesAlmacen)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                },
                                {
                                    text: `Cantidad a pedir:  ${Math.ceil(cantidadPedirEmpaques)}`,
                                    fontSize: 9,
                                    colSpan: 1,
                                    bold: true,
                                }
                            ],
                        ],
                    },
                    pageBreak: 'after',
                },
                {
                    alignment: 'center',
                    text: 'Listado de resultados agregados',
                    style: 'tableExample',
                    fontSize: 11,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],
                        heights: [10],
                        body: [
                            [
                                {
                                    text: '# ',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Fecha',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Acumulado',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Turno',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Piezas defectuosas',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Operador',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Eficiencia',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Ciclo',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Cantidad fabricada',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Observaciones',
                                    fontSize: 9,
                                    bold: true,
                                },
                            ],
                        ],
                    }
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],
                        heights: [10],
                        body:
                            list2,
                    }
                },
                {
                    alignment: 'center',
                    text: 'Listado de registros de materia prima agregados',
                    style: 'tableExample',
                    fontSize: 11,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],
                        heights: [10],
                        body: [
                            [
                                {
                                    text: '# ',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Fecha',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Acumulado',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Material',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Pendiente de surtir',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Virgen/Molido',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Surtio',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Recibio',
                                    fontSize: 9,
                                    bold: true,
                                },
                                {
                                    text: 'Observaciones',
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                },
                            ],
                        ],
                    }
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],
                        heights: [10],
                        body:
                            list3,
                    }
                },
                {
                    alignment: 'center',
                    text: 'Fechas del programa de producción',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10, 10, 10, 10, 30],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Fecha inicial:  ${dayjs(informacionRequerimiento.fechaInicio).format('LL')}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Día 1-Turno 1:  ${informacionRequerimiento.estadoLT1 == "false" ? "No disponible" : dayjs(informacionRequerimiento.lunesT1).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Día 1-Turno 2:  ${informacionRequerimiento.estadoLT2 == "false" ? "No disponible" : dayjs(informacionRequerimiento.lunesT2).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9 
                                },
                                {
                                },
                                {
                                    text: `Día 2-Turno 1:  ${informacionRequerimiento.estadoMT1 == "false" ? "No disponible" : dayjs(informacionRequerimiento.martesT1).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9 
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Día 2-Turno 2:  ${informacionRequerimiento.estadoMT2 == "false" ? "No disponible" : dayjs(informacionRequerimiento.martesT2).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9 
                                },
                                {
                                },
                                {
                                    text: `Día 3-Turno 1:  ${informacionRequerimiento.estadoMIT1 == "false" ? "No disponible" : dayjs(informacionRequerimiento.miercolesT1).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9  
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Día 3-Turno 2:  ${informacionRequerimiento.estadoMIT2 == "false" ? "No disponible" : dayjs(informacionRequerimiento.miercolesT2).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Día 4-Turno 1:  ${informacionRequerimiento.estadoJT1 == "false" ? "No disponible" : dayjs(informacionRequerimiento.juevesT1).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9  
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Día 4-Turno 2:  ${informacionRequerimiento.estadoJT2 == "false" ? "No disponible" : dayjs(informacionRequerimiento.juevesT2).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Día 5-Turno 1:  ${informacionRequerimiento.estadoVT1 == "false" ? "No disponible" : dayjs(informacionRequerimiento.viernesT1).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9 
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Día 5-Turno 2:  ${informacionRequerimiento.estadoVT2 == "false" ? "No disponible" : dayjs(informacionRequerimiento.viernesT2).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9 
                                },
                                {
                                },
                                {
                                    text: `Día 6-Turno 1:  ${informacionRequerimiento.estadoST1 == "false" ? "No disponible" : dayjs(informacionRequerimiento.sabadoT1).format('LL')}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9  
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Observaciones:  ${informacionRequerimiento.observaciones}`,
                                    colSpan: 4,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                },
                                {
                                }
                            ],
                        ]
                    }
                },
            ],
        };

        const pdf = pdfMake.createPdf(docDefinition);

        pdf.download(`${informacionRequerimiento.folio}.pdf`);
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Vista previa de planeación
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
                                    <Form.Group as={Col} controlId="formGridMateriaPrima" className="producto">
                                        <Form.Label>
                                            Producto
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            defaultValue={formDataPlaneacion.descripcion}
                                            name="materiaPrima"
                                            disabled
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

                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Cliente
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre cliente"
                                            name="nombreCliente"
                                            value={formDataPlaneacion.nombreCliente}
                                            disabled
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
                                            defaultValue={informacionRequerimiento.semana}
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
                                                defaultValue={informacionRequerimiento.noMaquina}
                                                placeholder="Numero de maquina"
                                                name="noMaquina"
                                                disabled
                                            >
                                                <option>Elige una opción</option>
                                                {map(listMaquinas, (maquina, index) => (
                                                    <option value={maquina?.numeroMaquina + "-" + maquina?.marca} selected={maquina?.numeroMaquina + "-" + maquina?.marca == informacionRequerimiento.noMaquina}>{maquina?.numeroMaquina + "-" + maquina?.marca}</option>
                                                ))}
                                            </Form.Control>
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

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Notas importantes
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Notas importantes"
                                            name="notasImportantes"
                                            defaultValue={informacionRequerimiento.notasImportantes}
                                            disabled
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
                                            defaultValue={informacionRequerimiento.elaboro}
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

                        <div className="datosResultado">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Resultados
                                    </h4>
                                </div>

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
                                                <th scope="col">Acumulado</th>
                                                <th scope="col">Material</th>
                                                <th scope="col">Pendiente de surtir</th>
                                                <th scope="col">Virgen/Molido</th>
                                                <th scope="col">Surtio</th>
                                                <th scope="col">Recibio</th>
                                                <th scope="col">Observaciones</th>
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
                                            defaultValue={informacionRequerimiento.observaciones}
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

function initialFormDataSucursalInitial() {
    return {
        rfc: "",
        calle: "",
        numeroExterior: "",
        numeroInterior: "",
        colonia: "",
        municipio: "",
        estado: "",
        pais: "",
        codigoPostal: ""
    }
}

function initialFormDataSucursal(data) {
    const { rfc, direccion } = data;

    return {
        rfc: rfc,
        calle: direccion.calle,
        numeroExterior: direccion.numeroExterior,
        numeroInterior: direccion.numeroInterior,
        colonia: direccion.colonia,
        municipio: direccion.municipio,
        estado: direccion.estado,
        pais: direccion.pais,
        codigoPostal: direccion.codigoPostal
    }
}

function initialFormDataPlaneacion(data) {
    return {
        cliente: data.cliente,
        nombreCliente: data.nombreCliente,
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
        cantidadProducirVenta: "",
        producto: "",
        numeroInterno: "",
        cliente: ""
    }
}

function initialFormDataPlaneacionInitial() {
    return {
        cliente: "",
        nombreCliente: "",
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
        noMaquina: "",
        elaboro: "",
        notasImportantes: "",
        observaciones: "",
        fechaInicio: "",
        lunesT1: "",
        estadoLT1: "",
        lunesT2: "",
        estadoLT2: "",
        martesT1: "",
        estadoMT1: "",
        martesT2: "",
        estadoMT2: "",
        miercolesT1: "",
        estadoMIT1: "",
        miercolesT2: "",
        estadoMIT2: "",
        juevesT1: "",
        estadoJT1: "",
        juevesT2: "",
        estadoJT2: "",
        viernesT1: "",
        estadoVT1: "",
        viernesT2: "",
        estadoVT2: "",
        sabadoT1: "",
        estadoST1: ""
    }
}

// Valores almacenados
function valoresAlmacenados(data) {
    const { folio, requerimiento, planeacion, bom, datosRequisicion, observaciones, programa } = data;

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
        numeroMaquina1: planeacion.opcionesMaquinaria.numeroMaquina1,
        maquina1: planeacion.opcionesMaquinaria.maquina,
        ciclo1: planeacion.opcionesMaquinaria.ciclo,
        pieza1: planeacion.opcionesMaquinaria.pieza,
        bolsa1: planeacion.opcionesMaquinaria.bolsa,
        noMaquina: planeacion.opcionesMaquinaria.numeroMaquina + "/" + planeacion.opcionesMaquinaria.maquina,
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
        elaboro: bom.elaboro,
        notasImportantes: bom.notas,
        observaciones: observaciones,
        fechaInicio: programa.fechaInicio,
        lunesT1: programa.lunesT1,
        estadoLT1: programa.estadoLT1,
        lunesT2: programa.lunesT2,
        estadoLT2: programa.estadoLT2,
        martesT1: programa.martesT1,
        estadoMT1: programa.estadoMT1,
        martesT2: programa.martesT2,
        estadoMT2: programa.estadoMT2,
        miercolesT1: programa.miercolesT1,
        estadoMIT1: programa.estadoMIT1,
        miercolesT2: programa.miercolesT2,
        estadoMIT2: programa.estadoMIT2,
        juevesT1: programa.juevesT1,
        estadoJT1: programa.estadoJT1,
        juevesT2: programa.juevesT2,
        estadoJT2: programa.estadoJT2,
        viernesT1: programa.viernesT1,
        estadoVT1: programa.estadoVT1,
        viernesT2: programa.viernesT2,
        estadoVT2: programa.estadoVT2,
        sabadoT1: programa.sabadoT1,
        estadoST1: programa.estadoST1,
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


export default VistaPreviaPlaneacion;
