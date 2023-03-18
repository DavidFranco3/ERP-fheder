import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "./VistaDetallada.scss";
import { Alert, Button, Col, Container, Form, Image, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faArrowLeftRotate, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { map } from "lodash";
import LogoPDF from "../../../assets/png/pdf.png";
import { obtenerRazonSocialPorNombre } from "../../../api/razonesSociales";
import Regreso from "../../../assets/png/back.png";
import { actualizaProductosMatriz, obtenerMatrizProducto, registraMatrizProductos } from "../../../api/matrizProductos";
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { toast } from "react-toastify";
import { listarClientes } from "../../../api/clientes";
import { listarMaquina, obtenerMaquina } from "../../../api/maquinas";
import { LogsInformativos, LogsInformativosLogout } from "../../Logs/LogsSistema/LogsSistema";
import BasicModal from "../../Modal/BasicModal";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { listarUM } from "../../../api/unidadesMedida";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import 'dayjs/locale/es'
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function VistaDetallada(props) {
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

    // Para almacenar el listado de proveedores
    const [listUM, setListUM] = useState(null);

    const cargarListaUM = () => {
        try {
            listarUM(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarUM() && data) {
                    setListUM(formatModelUM(data));
                } else {
                    const datosUM = formatModelUM(data);
                    setListUM(datosUM);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarListaUM();
    }, []);

    // Para definir el enrutamiento
    const enrutamiento = useNavigate();

    // Para extraer los parametros de la ruta
    const parametros = useParams();

    const { producto } = parametros;

    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    // Para almacenar el listado de clientes
    const [listClientes, setListClientes] = useState(null);

    // Para almacenar el listado de maquinas
    const [listMaquinas, setListMaquinas] = useState(null);

    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    // para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [formDataSucursal, setFormDataSucursal] = useState(initialFormDataSucursalInitial());

    // para almacenar los datos del formulario
    const [dataCliente, setDataCliente] = useState(initialClientes());

    // para almacenar los datos del formulario
    const [dataMaterial, setDataMaterial] = useState(initialMaterial());

    // para almacenar los datos del formulario
    const [dataPigmento, setDataPigmento] = useState(initialPigmento());

    // para almacenar los datos del formulario
    const [dataProveedor, setDataProveedor] = useState(initialProveedor());

    // para almacenar los datos del formulario
    const [dataEmpaque, setDataEmpaque] = useState(initialEmpaque());

    // Define el regreso hacia los productos
    const rutaRegresoProductos = () => {
        enrutamiento("/MatrizProductos")
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

    const [maquina1, setMaquina1] = useState("");

    const cargarMaquina1 = () => {
        //
        obtenerMaquina(formData.opcion1).then(response => {
            const { data } = response;
            //console.log(data)
            setMaquina1(data.numeroMaquina + "-" + data.marca + " " + data.lugar)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarMaquina1();
    }, [formData.opcion1]);

    const [maquina2, setMaquina2] = useState("");

    const cargarMaquina2 = () => {
        //
        obtenerMaquina(formData.opcion2).then(response => {
            const { data } = response;
            //console.log(data)
            setMaquina2(data.numeroMaquina + "-" + data.marca + " " + data.lugar)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarMaquina2();
    }, [formData.opcion2]);

    const [maquina3, setMaquina3] = useState("");

    const cargarMaquina3 = () => {
        //
        obtenerMaquina(formData.opcion3).then(response => {
            const { data } = response;
            //console.log(data)
            setMaquina3(data.numeroMaquina + "-" + data.marca + " " + data.lugar)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarMaquina3();
    }, [formData.opcion3]);

    const [maquina4, setMaquina4] = useState("");

    const cargarMaquina4 = () => {
        //
        obtenerMaquina(formData.opcion4).then(response => {
            const { data } = response;
            //console.log(data)
            setMaquina4(data.numeroMaquina + "-" + data.marca + " " + data.lugar)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarMaquina4();
    }, [formData.opcion4]);

    const [maquina5, setMaquina5] = useState("");

    const cargarMaquina5 = () => {
        //
        obtenerMaquina(formData.opcion5).then(response => {
            const { data } = response;
            //console.log(data)
            setMaquina5(data.numeroMaquina + "-" + data.marca + " " + data.lugar)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarMaquina5();
    }, [formData.opcion5]);

    const [maquina6, setMaquina6] = useState("");

    const cargarMaquina6 = () => {
        //
        obtenerMaquina(formData.opcion6).then(response => {
            const { data } = response;
            //console.log(data)
            setMaquina6(data.numeroMaquina + "-" + data.marca + " " + data.lugar)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarMaquina6();
    }, [formData.opcion6]);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const buscarMaterial = (content) => {
        setTitulosModal("Buscar material");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarCliente = (content) => {
        setTitulosModal("Buscar cliente");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarPigmento = (content) => {
        setTitulosModal("Buscar pigmento");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarProveedor = (content) => {
        setTitulosModal("Buscar proveedor");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarEmpaque = (content) => {
        setTitulosModal("Buscar empaque");
        setContentModal(content);
        setShowModal(true);
    }

    // Para guardar los datos del producto
    const [informacionProducto, setInformacionProducto] = useState(null);

    const cargarDatosProductos = () => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMatrizProducto(producto).then(response => {
                const { data } = response;

                if (!formData && data) {
                    setFormData(valoresAlmacenados(data));
                } else {
                    const datosProductos = valoresAlmacenados(data);
                    setFormData(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }

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
        cargarDatosProductos();
    }, []);

    const onSubmit = e => {
        e.preventDefault()

        if (!formData.noInterno || !formData.cliente || !formData.noMolde || !formData.cavMolde || !formData.noParte || !formData.descripcion || !formData.pesoPiezas || !formData.pesoColada || !formData.pesoTotalInyeccion || !formData.porcentajeScrap || !formData.porcentajeMolido || !formData.descripcionMP || !formData.descripcionPigmento || !formData.aplicacionGxKG || !formData.tiempoCiclo || !formData.noOperadores || !formData.piezasxHora || !formData.piezasxTurno || !formData.descripcionBolsa || !formData.noPiezasxEmpaque) {
            toast.warning("Completa el formulario");
        } else {
            //console.log(formData)
            setLoading(true)

            const temp = formData.proveedor.split("/");
            const temp2 = formData.descripcionMP.split("/");
            const temp3 = formData.descripcionPigmento.split("/");
            const temp4 = formData.descripcionBolsa.split("/");

            const dataTemp = {
                noInterno: formData.noInterno,
                cliente: dataCliente.cliente == "" ? formData.cliente : dataCliente.cliente,
                nombreCliente: dataCliente.nombreCliente == "" ? formData.nombreCliente : dataCliente.nombreCliente,
                datosMolde: {
                    noMolde: formData.noMolde,
                    cavMolde: formData.cavMolde
                },
                noParte: formData.noParte,
                descripcion: formData.descripcion,
                precioVenta: formData.precioVenta,
                um: formData.um,
                datosPieza: {
                    pesoPiezas: formData.pesoPiezas,
                    pesoColada: formData.pesoColada,
                    pesoTotalInyeccion: formData.pesoTotalInyeccion,
                    porcentajeScrap: formData.porcentajeScrap,
                    porcentajeMolido: formData.porcentajeMolido
                },
                materiaPrima: {
                    folioMaterial: dataMaterial.descripcion == "" ? temp2[2] : dataMaterial.folio,
                    idMaterial: dataMaterial.descripcion == "" ? temp2[0] : dataMaterial.idMaterial,
                    descripcion: dataMaterial.descripcion == "" ? temp2[1] : dataMaterial.descripcion,
                    precioMaterial: dataMaterial.descripcion == "" ? temp2[3] : dataMaterial.precioUnitario,
                    umMaterial: dataMaterial.descripcion == "" ? temp2[4] : dataMaterial.umMaterial,
                },
                pigmentoMasterBach: {
                    idPigmento: dataPigmento.descripcionPigmento == "" ? temp3[0] : dataPigmento.idPigmento,
                    folioPigmento: dataPigmento.descripcionPigmento == "" ? temp3[1] : dataPigmento.folioPigmento,
                    descripcion: dataPigmento.descripcionPigmento == "" ? temp3[2] : dataPigmento.descripcionPigmento,
                    precioPigmento: dataPigmento.descripcionPigmento == "" ? temp3[3] : dataPigmento.precioPigmento,
                    umPigmento: dataPigmento.descripcionPigmento == "" ? temp2[4] : dataPigmento.umPigmento,
                    aplicacionGxKG: formData.aplicacionGxKG,
                    proveedor: dataProveedor.nombreProveedor == "" ? temp[0] : dataProveedor.proveedor,
                    nombreProveedor: dataProveedor.nombreProveedor == "" ? temp[1] : dataProveedor.nombreProveedor,
                },
                tiempoCiclo: formData.tiempoCiclo,
                noOperadores: formData.noOperadores,
                piezasxHora: formData.piezasxHora,
                piezasxTurno: formData.piezasxTurno,
                materialEmpaque: {
                    idEmpaque: dataEmpaque.descripcionEmpaque == "" ? temp4[0] : dataEmpaque.idEmpaque,
                    folioEmpaque: dataEmpaque.descripcionEmpaque == "" ? temp4[1] : dataEmpaque.folioEmpaque,
                    descripcionBolsa: dataEmpaque.descripcionEmpaque == "" ? temp4[2] : dataEmpaque.descripcionEmpaque,
                    precioEmpaque: dataEmpaque.descripcionEmpaque == "" ? temp4[3] : dataEmpaque.precioEmpaque,
                    umEmpaque: dataEmpaque.descripcionEmpaque == "" ? temp2[4] : dataEmpaque.umEmpaque,
                    noPiezasxEmpaque: formData.noPiezasxEmpaque
                },
                opcionMaquinaria: {
                    1: {
                        opcion1: formData.opcion1,
                        tiempoCiclo1: formData.tiempoCiclo1
                    },
                    2: {
                        opcion2: formData.opcion2,
                        tiempoCiclo2: formData.tiempoCiclo2
                    },
                    3: {
                        opcion3: formData.opcion3,
                        tiempoCiclo3: formData.tiempoCiclo3
                    },
                    4: {
                        opcion4: formData.opcion4,
                        tiempoCiclo4: formData.tiempoCiclo4
                    },
                    5: {
                        opcion5: formData.opcion5,
                        tiempoCiclo5: formData.tiempoCiclo5
                    },
                    6: {
                        opcion6: formData.opcion6,
                        tiempoCiclo6: formData.tiempoCiclo6
                    }
                },
                estado: "true"
            }

            //console.log(dataTemp)
            try {
                actualizaProductosMatriz(producto, dataTemp).then(response => {
                    const { data } = response;
                    LogsInformativos("El producto de la matriz de productos con No. interno ", dataTemp.noInterno, " fue modificado", dataTemp)
                    setLoading(false)
                    toast.success(data.mensaje)
                    rutaRegresoProductos()
                }).catch(e => {
                    console.log(e)
                    if (e.message === 'Network Error') {
                        //console.log("No hay internet")
                        toast.error("Conexión al servidor no disponible");
                        setLoading(false);
                    } else {
                        if (e.response && e.response.status === 401) {
                            const { mensaje } = e.response.data;
                            toast.error(mensaje);
                            setLoading(false);
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

        setDataCliente({ ...dataCliente, [e.target.name]: e.target.value })

        setDataMaterial({ ...dataMaterial, [e.target.name]: e.target.value })

        setDataPigmento({ ...dataPigmento, [e.target.name]: e.target.value })

        setDataProveedor({ ...dataProveedor, [e.target.name]: e.target.value })

        setDataEmpaque({ ...dataEmpaque, [e.target.name]: e.target.value })
    }

    // Para obtener el peso de la inyeccion
    const inyeccion = (parseFloat(formData.pesoPiezas) + (parseFloat(formData.pesoColada) / parseFloat(formData.cavMolde))) * parseFloat(formData.cavMolde);

    // Para obtener el porcentaje de molido
    const molido = ((parseFloat(formData.pesoColada) / parseFloat(formData.cavMolde)) / parseFloat(formData.pesoPiezas)) * 100;

    // Para obtener el total de piezas por hora
    const piezasHora = (3600 / (parseFloat(formData.tiempoCiclo))) * formData.cavMolde;

    // Para obtener el total de piezas por turno
    const piezasTurno = (12 * parseFloat(piezasHora));

    const temp = formData.proveedor.split("/");

    const temp2 = formData.descripcionMP.split("/");

    const temp3 = formData.descripcionPigmento.split("/");

    const temp4 = formData.descripcionBolsa.split("/");

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
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10, 10, 10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Número interno:  ${formData.noInterno}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Cliente:  ${dataCliente.nombreCliente == "" ? formData.nombreCliente : dataCliente.nombreCliente}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Número de parte:  ${formData.noParte}`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Número de molde:  ${formData.noMolde}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Cavidades del molde:  ${formData.cavMolde}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Descripción:  ${formData.descripcion}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Precio de venta:  ${new Intl.NumberFormat('es-MX', {
                                        style: "currency",
                                        currency: "MXN"
                                    }).format(formData.precioVenta)} MXN`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Unidad de medida:  ${formData.um}`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Número de operadores:  ${formData.noOperadores}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Piezas x hora:  ${formData.tiempoCiclo == "" ? 0 : formData.cavMolde == "" ? 0 : Math.floor(piezasHora)}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Piezas x turno:  ${formData.tiempoCiclo == "" ? 0 : formData.cavMolde == "" ? 0 : Math.floor(piezasTurno)}`,
                                    fontSize: 9,
                                    colSpan: 2,
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
                    text: 'Datos de la pieza',
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
                                    text: `Peso de la pieza:  ${formData.pesoPiezas}KG`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Peso colada:  ${formData.pesoColada}KG`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true,
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Peso total de inyección:  ${formData.pesoPiezas == "" ? 0 : formData.pesoColada == "" ? 0 : formData.cavMolde == "" ? 0 : inyeccion.toFixed(2)}KG`,
                                    colSpan: 2,
                                    bold: true,
                                    fontSize: 9
                                },
                                {
                                },
                                {
                                    text: `Scrap:  ${formData.porcentajeScrap}%`,
                                    colSpan: 2,
                                    fontSize: 9,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Molido:  ${formData.pesoPiezas == "" ? 0 : formData.pesoColada == "" ? 0 : formData.cavMolde == "" ? 0 : molido > 100 ? molido.toFixed(0) : molido.toFixed(2)}%`,
                                    colSpan: 4,
                                    fontSize: 9,
                                    bold: true
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
                {
                    alignment: 'center',
                    text: 'Materia prima',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Descripción:  ${dataMaterial.descripcion == "" ? temp2[1] : dataMaterial.descripcion}`,
                                    fontSize: 9,
                                    colSpan: 4,
                                    bold: true
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
                {
                    alignment: 'center',
                    text: 'Pigmento / Master bach',
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
                                    text: `Descripción:  ${dataPigmento.descripcionPigmento == "" ? temp3[2] : dataPigmento.descripcionPigmento}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Aplicación G x K.G:  ${formData.aplicacionGxKG}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Proveedor:  ${dataProveedor.nombreProveedor == "" ? temp[1] : dataProveedor.nombreProveedor}`,
                                    fontSize: 9,
                                    colSpan: 4,
                                    bold: true
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
                {
                    alignment: 'center',
                    text: 'Material de empaque',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                },
                {
                    style: 'tableExample',
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Descripción:  ${dataEmpaque.descripcionEmpaque == "" ? temp4[2] : dataEmpaque.descripcionEmpaque}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Número de piezas por empaque:  ${formData.noPiezasxEmpaque}`,
                                    fontSize: 9,
                                    colSpan: 2,
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
                    text: 'Opciones de maquina',
                    style: 'header',
                    fontSize: 23,
                    bold: true,
                    margin: [0, 10],
                },
                {
                    style: 'tableExample',
                    margin: [0, 0, 0, 10],
                    table: {
                        widths: ['25%', '25%', '25%', '25%'],
                        heights: [10, 10, 10, 10, 10, 10],
                        headerRows: 1,
                        body: [
                            [
                                {
                                    text: `Opción 1:  ${maquina1}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo1}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Opción 2:  ${maquina2}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo2}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Opción 3:  ${maquina3}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo3}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Opción 4:  ${maquina4}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo4}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Opción 5:  ${maquina5}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo5}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                }
                            ],
                            [
                                {
                                    text: `Opción 6:  ${maquina6}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
                                },
                                {
                                },
                                {
                                    text: `Tiempo ciclo:  ${formData.tiempoCiclo6}`,
                                    fontSize: 9,
                                    colSpan: 2,
                                    bold: true
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

        pdf.download(`${formData.noInterno}.pdf`);
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Vista detallada del producto
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar a la pagina anterior"
                            onClick={() => {
                                rutaRegresoProductos()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <Container fluid>
                <Col>
                    {
                        formData &&
                        (
                            <>
                                <div className="formularioInformacionMatrizProductos">
                                    <Form onChange={onChange} onSubmit={onSubmit}>

                                        <div className="encabezado">
                                            <Container fluid>
                                                <br />
                                                {/* No. interno, cliente, no. parte */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridNumeroInterno">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                No. interno
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe el no. interno"
                                                                name="noInterno"
                                                                defaultValue={formData.noInterno}
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Cliente
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                defaultValue={dataCliente.nombreCliente == "" ? formData.nombreCliente : dataCliente.nombreCliente}
                                                                placeholder="Buscar cliente"
                                                                name="cliente"
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                                {/* No. molde, cav. molde */}
                                                <Row className="mb-3">

                                                    <Form.Group as={Row} controlId="formGridNoParte">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                No. parte
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe el no.parte"
                                                                name="noParte"
                                                                defaultValue={formData.noParte}
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                No. molde
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe el no. de molde"
                                                                name="noMolde"
                                                                defaultValue={formData.noMolde}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>

                                                {/* Descripción */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridCAVMolde">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                CAV molde
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe el cav del molde"
                                                                name="cavMolde"
                                                                defaultValue={formData.cavMolde}
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Descripción
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe la descripción"
                                                                name="descripcion"
                                                                defaultValue={formData.descripcion}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>

                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridNumeroParte">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                Precio de venta
                                                            </Form.Label>
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                min="0"
                                                                placeholder="Escribe el precio de venta"
                                                                name="precioVenta"
                                                                defaultValue={formData.precioVenta}
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="2">
                                                            <Form.Label align="center">
                                                                Unidad de medida
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                name="um"
                                                                defaultValue={formData.um}
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listUM, (um, index) => (
                                                                    <option key={index} value={um?.nombre} selected={formData.um == um?.nombre}>{um?.nombre}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                            </Container>
                                        </div>

                                        {/* Datos de la pieza */}
                                        <div className="datosPieza">
                                            <Container fluid>
                                                <br />
                                                <div className="tituloSeccion">
                                                    <h4>
                                                        Datos de la pieza
                                                    </h4>
                                                </div>
                                                {/* Peso piezas, peso colada, peso total inyeccion*/}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridNumeroParte">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                Peso de la pieza
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                min="0"
                                                                placeholder="Escribe el peso"
                                                                name="pesoPiezas"
                                                                defaultValue={formData.pesoPiezas}
                                                                disabled
                                                            />
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Peso colada
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                min="0"
                                                                placeholder="Escribe el peso"
                                                                name="pesoColada"
                                                                defaultValue={formData.pesoColada}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                                {/* porcentaje scrap, porcentaje molido*/}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridPesoTotalInyeccion">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                Peso total de inyección
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                min="0"
                                                                placeholder="Escribe el peso"
                                                                name="pesoTotalInyeccion"
                                                                value={formData.pesoPiezas == "" ? 0 : formData.pesoColada == "" ? 0 : formData.cavMolde == "" ? 0 : inyeccion.toFixed(2)}
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Porcentaje scrap
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.1"
                                                                min="0"
                                                                placeholder="Escribe el porcentaje"
                                                                name="porcentajeScrap"
                                                                defaultValue={formData.porcentajeScrap}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>

                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridPorcentajeMolido">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                Porcentaje de molido
                                                            </Form.Label>
                                                        </Col>
                                                        <Col sm="3">
                                                            <Form.Control
                                                                type="number"
                                                                step="0.00000000000001"
                                                                min="0"
                                                                placeholder="Escribe el porcentaje"
                                                                name="porcentajeMolido"
                                                                value={formData.pesoPiezas == "" ? 0 : formData.pesoColada == "" ? 0 : formData.cavMolde == "" ? 0 : molido > 100 ? molido.toFixed(0) : molido.toFixed(2)}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                            </Container>
                                        </div>

                                        {/* Materia prima */}
                                        <div className="materiaPrima">
                                            <Container fluid>
                                                <br />
                                                <div className="tituloSeccion">
                                                    <h4>
                                                        Materia prima
                                                    </h4>
                                                </div>
                                                {/* Descripción */}

                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridDescripcionMateriaPrima">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                Selecciona la materia prima
                                                            </Form.Label>
                                                        </Col>
                                                        <Col sm="3">
                                                            <Form.Control
                                                                type="text"
                                                                defaultValue={dataMaterial.descripcion == "" ? temp2[1] : dataMaterial.descripcion}
                                                                placeholder="Buscar material"
                                                                name="descripcionMP"
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                            </Container>
                                        </div>

                                        {/* Pigmento */}
                                        <div className="pigmentoMasterBach">
                                            <Container fluid>
                                                <br />
                                                <div className="tituloSeccion">
                                                    <h4>
                                                        Pigmento / Master bach
                                                    </h4>
                                                </div>
                                                {/* Descripcion */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridDescripciónPigmento">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Descripción
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                defaultValue={dataPigmento.descripcionPigmento == "" ? temp3[2] : dataPigmento.descripcionPigmento}
                                                                placeholder="Buscar pigmento"
                                                                name="descripcionPigmento"
                                                                disabled
                                                            />
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Aplicación G x K.G.
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.000001"
                                                                min="0"
                                                                placeholder="Escribe la aplicación"
                                                                name="aplicacionGxKG"
                                                                defaultValue={formData.aplicacionGxKG}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                                {/* Aplicacion gxkg, proveedor */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridProveedor">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Proveedor
                                                            </Form.Label>
                                                        </Col>
                                                        <Col sm="3">
                                                            <Form.Control
                                                                type="text"
                                                                defaultValue={dataProveedor.nombreProveedor == "" ? temp[1] : dataProveedor.nombreProveedor}
                                                                placeholder="Buscar proveedor"
                                                                name="proveedor"
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>
                                            </Container>
                                        </div>

                                        <div className="pigmentoMasterBach">
                                            <Container fluid>
                                                <br />
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridProveedor">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                No. de operadores
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el numero de operadores"
                                                                name="noOperadores"
                                                                defaultValue={formData.noOperadores}
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                step="0.1"
                                                                min="0"
                                                                placeholder="Escribe el tiempo"
                                                                name="tiempoCiclo"
                                                                defaultValue={formData.tiempoCiclo}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                </Row>
                                                {/* Tiempo ciclo (seg), no operadores, piezas x hora, piezas x turno */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridPiezasxHora">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Piezas x Hora
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el numero de piezas"
                                                                name="piezasxHora"
                                                                value={formData.tiempoCiclo == "" ? 0 : formData.cavMolde == "" ? 0 : Math.floor(piezasHora)}
                                                                disabled
                                                            />
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Piezas x Turno
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el numero de piezas"
                                                                name="piezasxTurno"
                                                                value={formData.tiempoCiclo == "" ? 0 : formData.cavMolde == "" ? 0 : Math.floor(piezasTurno)}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>

                                                <Row className="mb-3">

                                                </Row>
                                            </Container>
                                        </div>

                                        {/* Material de empaque */}
                                        <div className="materialEmpaque">
                                            <Container fluid>
                                                <br />
                                                <div className="tituloSeccion">
                                                    <h4>
                                                        Material de empaque
                                                    </h4>
                                                </div>
                                                {/* Porcentaje scrap, no piezas por empaque */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridPorcentajeScrap">
                                                        <Col sm="2">
                                                            <Form.Label>
                                                                Descripcion del empaque
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="text"
                                                                defaultValue={dataEmpaque.descripcionEmpaque == "" ? temp4[2] : dataEmpaque.descripcionEmpaque}
                                                                placeholder="Buscar empaque"
                                                                name="descripcionBolsa"
                                                                disabled
                                                            />
                                                        </Col>

                                                        <Col sm="2">
                                                            <Form.Label>
                                                                No. de piezas por empaque
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el numero de piezas"
                                                                name="noPiezasxEmpaque"
                                                                defaultValue={formData.noPiezasxEmpaque}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                </Row>
                                            </Container>
                                        </div>

                                        {/* Opciones maquinaria */}
                                        <div className="opcionesMaquinaria">
                                            <Container fluid>
                                                <br />
                                                <div className="tituloSeccion">
                                                    <h4>
                                                        Opciones de maquina
                                                    </h4>
                                                </div>
                                                {/* Opcion 1, Tiempo ciclo (seg) */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridOpcion1">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Opción 1
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue={formData.opcion1}
                                                                name="opcion1"
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMaquinas, (maquina, index) => (
                                                                    <option value={maquina?.id} selected={maquina?.id === formData.opcion1}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el tiempo de ciclo"
                                                                name="tiempoCiclo1"
                                                                defaultValue={formData.tiempoCiclo1}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>

                                                {/* Opcion 2, Tiempo ciclo (seg) */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridOpcion2">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Opción 2
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue={formData.opcion2}
                                                                name="opcion2"
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMaquinas, (maquina, index) => (
                                                                    <option value={maquina?.id} selected={maquina?.id === formData.opcion2}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el tiempo de ciclo"
                                                                name="tiempoCiclo2"
                                                                defaultValue={formData.tiempoCiclo2}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                </Row>
                                                {/* Opcion 3, Tiempo ciclo (seg) */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridOpcion3">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Opción 3
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue={formData.opcion3}
                                                                name="opcion3"
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMaquinas, (maquina, index) => (
                                                                    <option value={maquina?.id} selected={maquina?.id === formData.opcion3}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el tiempo de ciclo"
                                                                name="tiempoCiclo3"
                                                                defaultValue={formData.tiempoCiclo3}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                </Row>

                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridOpcion1">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Opción 4
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue={formData.opcion4}
                                                                name="opcion4"
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMaquinas, (maquina, index) => (
                                                                    <option value={maquina?.id} selected={maquina?.id === formData.opcion4}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>

                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el tiempo de ciclo"
                                                                name="tiempoCiclo4"
                                                                defaultValue={formData.tiempoCiclo4}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                </Row>

                                                {/* Opcion 2, Tiempo ciclo (seg) */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridOpcion2">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Opción 5
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue={formData.opcion5}
                                                                name="opcion5"
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMaquinas, (maquina, index) => (
                                                                    <option value={maquina?.id} selected={maquina?.id === formData.opcion5}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el tiempo de ciclo"
                                                                name="tiempoCiclo5"
                                                                defaultValue={formData.tiempoCiclo5}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                </Row>
                                                {/* Opcion 3, Tiempo ciclo (seg) */}
                                                <Row className="mb-3">
                                                    <Form.Group as={Row} controlId="formGridOpcion3">
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Opción 6
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                as="select"
                                                                defaultValue={formData.opcion6}
                                                                name="opcion6"
                                                                disabled
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMaquinas, (maquina, index) => (
                                                                    <option value={maquina?.id} selected={maquina?.id === formData.opcion6}>{maquina?.numeroMaquina + "-" + maquina?.marca + " " + maquina?.lugar}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Col>
                                                        <Col sm="1">
                                                            <Form.Label>
                                                                Tiempo ciclo
                                                            </Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Control
                                                                type="number"
                                                                min="0"
                                                                placeholder="Escribe el tiempo de ciclo"
                                                                name="tiempoCiclo6"
                                                                defaultValue={formData.tiempoCiclo6}
                                                                disabled
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                </Row>
                                            </Container>
                                        </div>

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
                                                                    rutaRegresoProductos()
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </div>
                            </>
                        )
                    }
                </Col>
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

function initialFormData(data) {
    return {
        noInterno: "",
        cliente: "",
        nombreCliente: "",
        noMolde: "",
        cavMolde: "",
        noParte: "",
        um: "",
        descripcion: "",
        precioVenta: "",
        pesoPiezas: "",
        pesoColada: "",
        pesoTotalInyeccion: "",
        porcentajeScrap: "",
        porcentajeMolido: "",
        descripcionMP: "",
        descripcionPigmento: "",
        aplicacionGxKG: "",
        proveedor: "",
        tiempoCiclo: "",
        noOperadores: "",
        piezasxHora: "",
        piezasxTurno: "",
        descripcionBolsa: "",
        noPiezasxEmpaque: "",
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

function initialClientes() {
    return {
        cliente: "",
        nombreCliente: ""
    }
}

function initialMaterial() {
    return {
        idMaterial: "",
        folio: "",
        descripcion: "",
        precioUnitario: "",
        umMaterial: ""
    }
}

function initialPigmento() {
    return {
        idPigmento: "",
        folioPigmento: "",
        descripcionPigmento: "",
        precioPigmento: "",
        umPigmento: ""
    }
}

function initialEmpaque() {
    return {
        idEmpaque: "",
        folioEmpaque: "",
        descripcionEmpaque: "",
        precioEmpaque: "",
        umEmpaque: ""
    }
}
function initialProveedor() {
    return {
        proveedor: "",
        nombreProveedor: ""
    }
}

function valoresAlmacenados(data) {
    return {
        noInterno: data.noInterno,
        cliente: data.cliente,
        nombreCliente: data.nombreCliente,
        noMolde: data.datosMolde.noMolde,
        cavMolde: data.datosMolde.cavMolde,
        noParte: data.noParte,
        um: data.um,
        descripcion: data.descripcion,
        precioVenta: data.precioVenta,
        pesoPiezas: data.datosPieza.pesoPiezas,
        pesoColada: data.datosPieza.pesoColada,
        pesoTotalInyeccion: data.datosPieza.pesoTotalInyeccion,
        porcentajeScrap: data.datosPieza.porcentajeScrap,
        porcentajeMolido: data.datosPieza.porcentajeMolido,
        descripcionMP: data.materiaPrima.idMaterial + "/" + data.materiaPrima.descripcion + "/" + data.materiaPrima.folioMaterial + "/" + data.materiaPrima.precioMaterial + "/" + data.materiaPrima.umMaterial,
        descripcionPigmento: data.pigmentoMasterBach.idPigmento + "/" + data.pigmentoMasterBach.folioPigmento + "/" + data.pigmentoMasterBach.descripcion + "/" + data.pigmentoMasterBach.precioPigmento + "/" + data.pigmentoMasterBach.umPigmento,
        aplicacionGxKG: data.pigmentoMasterBach.aplicacionGxKG,
        proveedor: data.pigmentoMasterBach.proveedor + "/" + data.pigmentoMasterBach.nombreProveedor,
        tiempoCiclo: data.tiempoCiclo,
        noOperadores: data.noOperadores,
        piezasxHora: data.piezasxHora,
        piezasxTurno: data.piezasxTurno,
        descripcionBolsa: data.materialEmpaque.idEmpaque + "/" + data.materialEmpaque.folioEmpaque + "/" + data.materialEmpaque.descripcionBolsa + "/" + data.materialEmpaque.precioEmpaque + "/" + data.materialEmpaque.umEmpaque,
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

function formatModelMateriasPrimas(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            descripcion: data.descripcion,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelProveedores(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            nombre: data.nombre,
            tipo: data.tipo,
            productoServicio: data.productoServicio,
            categoria: data.categoria,
            personalContacto: data.personalContacto,
            telefono: data.telefono,
            correo: data.correo,
            tiempoCredito: data.tiempoCredito,
            tiempoRespuesta: data.tiempoRespuesta,
            lugarRecoleccion: data.lugarRecoleccion,
            horario: data.horario,
            comentarios: data.comentarios,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelClientes(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            telefonoCelular: data.telefonoCelular,
            telefonoFijo: data.telefonoFijo,
            rfc: data.rfc,
            correo: data.correo,
            calle: data.direccion.calle,
            numeroExterior: data.direccion.numeroExterior,
            numeroInterior: data.direccion.numeroInterior,
            colonia: data.direccion.colonia,
            estado: data.direccion.estado,
            municipio: data.direccion.municipio,
            pais: data.direccion.pais,
            razonSocial: data.razonSocial,
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

function formatModelUM(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            estadoUM: data.estadoUM,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default VistaDetallada;
