import { useState, useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Container, Spinner, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { useHistory } from "react-router-dom";
import "./RegistraInspeccionMaterial.scss";
import BasicModal from "../../Modal/BasicModal";
import CancelacionInspeccion from "../CancelacionInspeccion";
import { obtenerDatosProduccion } from "../../../api/produccion";
import { obtenerCliente } from "../../../api/clientes";
import { obtenerNumeroInspeccionPieza, registraInspeccionPieza } from "../../../api/inspeccionPieza";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function RegistraInspeccionMaterial(props) {

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/InspeccionPieza")
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const cancelacionInspeccion = (content) => {
        setTitulosModal("Inspeccion cancelada");
        setContentModal(content);
        setShowModal(true);
    }

    // Para guardar el id del cliente
    const [nombreCliente, setNombreCliente] = useState("");

    // Para guardar el nombre del producto
    const [producto, setProducto] = useState("");

    // Para guardar el numero de parte
    const [numeroParte, setNumeroparte] = useState("");

    // Para guardar el nombre del material
    const [material, setMaterial] = useState("");

    useEffect(() => {
        try {

            obtenerDatosProduccion(formData.ordenProduccion).then(response => {
                const { data } = response;
                const { generalidades, bom } = data;
                setProducto(generalidades.producto);
                setNumeroparte(generalidades.noParte);
                setMaterial(bom.material);

                obtenerCliente(generalidades.cliente).then(response => {
                    const { data } = response;
                    const { nombre, apellidos } = data;
                    setNombreCliente(nombre + " " + apellidos)

                }).catch(e => {
                    console.log(e)
                })

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formData.ordenProduccion]);

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para controlar el estado de los botones de turno
    const [turno, setTurno] = useState("0");

    // Para Controlar la columna de primera revision
    const [revision1, setRevision1] = useState(0);

    // Para Controlar la columna de segunda revision
    const [revision2, setRevision2] = useState(0);

    // Para Controlar la columna de tercera revision
    const [revision3, setRevision3] = useState(0);

    // Para Controlar la columna de cuarta revision
    const [revision4, setRevision4] = useState(0);

    // Para Controlar la columna de quinta revision
    const [revision5, setRevision5] = useState(0);

    // Para Controlar la columna de sexta revision
    const [revision6, setRevision6] = useState(0);

    // Para Controlar la columna de septima revision
    const [revision7, setRevision7] = useState(0);

    // Para Controlar la columna de octava revision
    const [revision8, setRevision8] = useState(0);

    // Para Controlar la columna de novena revision
    const [revision9, setRevision9] = useState(0);

    // Para Controlar la columna de decima revision
    const [revision10, setRevision10] = useState(0);

    const onSubmit = e => {
        e.preventDefault()


        if (!formData.fechaElaboracion || !formData.ordenProduccion || turno=="0" || !formData.fechaArranque || !formData.numeroMaquina || !formData.cantidadLote) {
            toast.warning("Completa el formulario");
        } else {
            //console.log(formData)
            setLoading(true)
            obtenerNumeroInspeccionPieza().then(response => {
                const { data } = response;
                if (turno == "1") {
                    const dataTemp = {
                        folio: data.noInspeccion,
                        fechaElaboracion: formData.fechaElaboracion,
                        noOP: formData.ordenProduccion,
                        fechaArranqueMaquina: formData.fechaArranque,
                        noMaquina: formData.numeroMaquina,
                        cliente: nombreCliente,
                        descripcionPieza: producto,
                        noParte: numeroParte,
                        material: material,
                        cantidadLote: formData.cantidadLote,
                        turno1: {
                            elaboro: formData.elaboro,
                            operador: formData.operador,
                            revisiones: {
                                1: {
                                    revision1: formData.revision1,
                                    hora1: formData.hora1,
                                    tono1: formData.tono1,
                                    contaminacion1: formData.contaminacion1,
                                    rebanada1: formData.rebanada1,
                                    rafaga1: formData.rafaga1,
                                    rechupe1: formData.rechupe1,
                                    piezaCompleta1: formData.piezaCompleta1,
                                    grietas1: formData.grietas1,
                                    inyeccion1: formData.inyeccion1,
                                    consistencia1: formData.consistencia1,
                                    funcionalidad1: formData.funcionalidad1,
                                    empaque1: formData.empaque1,
                                    otros1: formData.otros1,
                                    piezasRevisadas1: formData.piezasRevisadas1,
                                    cantidadPiezas1: formData.cantidadPiezas1,
                                    motivoCancelacion1: motivoCancelacion1
                                },
                                2: {
                                    revision2: formData.revision2,
                                    hora2: formData.hora2,
                                    tono2: formData.tono2,
                                    contaminacion2: formData.contaminacion2,
                                    rebanada2: formData.rebanada2,
                                    rafaga2: formData.rafaga2,
                                    rechupe2: formData.rechupe2,
                                    piezaCompleta2: formData.piezaCompleta2,
                                    grietas2: formData.grietas2,
                                    inyeccion2: formData.inyeccion2,
                                    consistencia2: formData.consistencia2,
                                    funcionalidad2: formData.funcionalidad2,
                                    empaque2: formData.empaque,
                                    otros2: formData.otros2,
                                    piezasRevisadas2: formData.piezasRevisadas2,
                                    cantidadPiezas2: formData.cantidadPiezas2,
                                    motivoCancelacion2: motivoCancelacion2
                                },
                                3: {
                                    revision3: formData.revision3,
                                    hora3: formData.hora3,
                                    tono3: formData.tono3,
                                    contaminacion3: formData.contaminacion3,
                                    rebanada3: formData.rebanada3,
                                    rafaga3: formData.rafaga3,
                                    rechupe3: formData.rechupe3,
                                    piezaCompleta3: formData.piezaCompleta3,
                                    grietas3: formData.grietas3,
                                    inyeccion3: formData.inyeccion3,
                                    consistencia3: formData.consistencia3,
                                    funcionalidad3: formData.funcionalidad3,
                                    empaque3: formData.empaque3,
                                    otros3: formData.otros3,
                                    piezasRevisadas3: formData.piezasRevisadas3,
                                    cantidadPiezas3: formData.cantidadPiezas3,
                                    motivoCancelacion3: motivoCancelacion3
                                },
                                4: {
                                    revision4: formData.revision4,
                                    hora4: formData.hora4,
                                    tono4: formData.tono4,
                                    contaminacion4: formData.contaminacion4,
                                    rebanada4: formData.rebanada4,
                                    rafaga4: formData.rafaga4,
                                    rechupe4: formData.rechupe4,
                                    piezaCompleta4: formData.piezaCompleta4,
                                    grietas4: formData.grietas4,
                                    inyeccion4: formData.inyeccion4,
                                    consistencia4: formData.consistencia4,
                                    funcionalidad4: formData.funcionalidad4,
                                    empaque4: formData.empaque4,
                                    otros4: formData.otros4,
                                    piezasRevisadas4: formData.piezasRevisadas4,
                                    cantidadPiezas4: formData.cantidadPiezas4,
                                    motivoCancelacion4: motivoCancelacion4
                                },
                                5: {
                                    revision5: formData.revision5,
                                    hora5: formData.hora5,
                                    tono5: formData.tono5,
                                    contaminacion5: formData.contaminacion5,
                                    rebanada5: formData.rebanada5,
                                    rafaga5: formData.rafaga5,
                                    rechupe5: formData.rechupe5,
                                    piezaCompleta5: formData.piezaCompleta5,
                                    grietas5: formData.grietas5,
                                    inyeccion5: formData.inyeccion5,
                                    consistencia5: formData.consistencia5,
                                    funcionalidad5: formData.funcionalidad5,
                                    empaque5: formData.empaque5,
                                    otros5: formData.otros5,
                                    piezasRevisadas5: formData.piezasRevisadas5,
                                    cantidadPiezas5: formData.cantidadPiezas5,
                                    motivoCancelacion5: motivoCancelacion5
                                },
                                6: {
                                    revision6: formData.revision6,
                                    hora6: formData.hora6,
                                    tono6: formData.tono6,
                                    contaminacion6: formData.contaminacion6,
                                    rebanada6: formData.rebanada6,
                                    rafaga6: formData.rafaga6,
                                    rechupe6: formData.rechupe6,
                                    piezaCompleta6: formData.piezaCompleta6,
                                    grietas6: formData.grietas6,
                                    inyeccion6: formData.inyeccion6,
                                    consistencia6: formData.consistencia6,
                                    funcionalidad6: formData.funcionalidad6,
                                    empaque6: formData.empaque6,
                                    otros6: formData.otros6,
                                    piezasRevisadas6: formData.piezasRevisadas6,
                                    cantidadPiezas6: formData.cantidadPiezas6,
                                    motivoCancelacion6: motivoCancelacion6
                                },
                                7: {
                                    revision7: formData.revision7,
                                    hora7: formData.hora7,
                                    tono7: formData.tono7,
                                    contaminacion7: formData.contaminacion7,
                                    rebanada7: formData.rebanada7,
                                    rafaga7: formData.rafaga7,
                                    rechupe7: formData.rechupe7,
                                    piezaCompleta7: formData.piezaCompleta7,
                                    grietas7: formData.grietas7,
                                    inyeccion7: formData.inyeccion7,
                                    consistencia7: formData.consistencia7,
                                    funcionalidad7: formData.funcionalidad7,
                                    empaque7: formData.empaque7,
                                    otros7: formData.otros7,
                                    piezasRevisadas7: formData.piezasRevisadas7,
                                    cantidadPiezas7: formData.cantidadPiezas7,
                                    motivoCancelacion7: motivoCancelacion7
                                },
                                8: {
                                    revision8: formData.revision8,
                                    hora8: formData.hora8,
                                    tono8: formData.tono8,
                                    contaminacion8: formData.contaminacion8,
                                    rebanada8: formData.rebanada8,
                                    rafaga8: formData.rafaga8,
                                    rechupe8: formData.rechupe8,
                                    piezaCompleta8: formData.piezaCompleta8,
                                    grietas8: formData.grietas8,
                                    inyeccion8: formData.inyeccion8,
                                    consistencia8: formData.consistencia8,
                                    funcionalidad8: formData.funcionalidad8,
                                    empaque8: formData.empaque8,
                                    otros8: formData.otros8,
                                    piezasRevisadas8: formData.piezasRevisadas8,
                                    cantidadPiezas8: formData.cantidadPiezas8,
                                    motivoCancelacion8: motivoCancelacion8
                                },
                                9: {
                                    revision9: formData.revision9,
                                    hora9: formData.hora9,
                                    tono9: formData.tono9,
                                    contaminacion9: formData.contaminacion9,
                                    rebanada9: formData.rebanada9,
                                    rafaga9: formData.rafaga9,
                                    rechupe9: formData.rechupe9,
                                    piezaCompleta9: formData.piezaCompleta9,
                                    grietas9: formData.grietas9,
                                    inyeccion9: formData.inyeccion9,
                                    consistencia9: formData.consistencia9,
                                    funcionalidad9: formData.funcionalidad9,
                                    empaque9: formData.empaque9,
                                    otros9: formData.otros9,
                                    piezasRevisadas9: formData.piezasRevisadas9,
                                    cantidadPiezas9: formData.cantidadPiezas9,
                                    motivoCancelacion9: motivoCancelacion9
                                },
                                10: {
                                    revision10: formData.revision10,
                                    hora10: formData.hora10,
                                    tono10: formData.tono10,
                                    contaminacion10: formData.contaminacion10,
                                    rebanada10: formData.rebanada10,
                                    rafaga10: formData.rafaga10,
                                    rechupe10: formData.rechupe10,
                                    piezaCompleta10: formData.piezaCompleta10,
                                    grietas10: formData.grietas10,
                                    inyeccion10: formData.inyeccion10,
                                    consistencia10: formData.consistencia10,
                                    funcionalidad10: formData.funcionalidad10,
                                    empaque10: formData.empaque10,
                                    otros10: formData.otros10,
                                    piezasRevisadas10: formData.piezasRevisadas10,
                                    cantidadPiezas10: formData.cantidadPiezas10,
                                    motivoCancelacion10: motivoCancelacion10
                                },
                            }
                        },
                        status: "Activo"
                    }

                    //console.log(dataTemp)
                    try {
                        registraInspeccionPieza(dataTemp).then(response => {
                            const { data } = response;
                            LogsInformativos("Inspeccion de pieza realizada ", dataTemp)
                            setLoading(false)
                            toast.success(data.mensaje)
                            rutaRegreso()
                        }).catch(e => {
                            console.log(e)
                            if (e.message === 'Network Error') {
                                //console.log("No hay internet")
                                toast.error("Conexión al servidor no disponible");
                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }
                } else if (turno == "2") {
                    const dataTemp = {
                        folio: data.noInspeccion,
                        fechaElaboracion: formData.fechaElaboracion,
                        noOP: formData.ordenProduccion,
                        fechaArranqueMaquina: formData.fechaArranque,
                        noMaquina: formData.numeroMaquina,
                        cliente: nombreCliente,
                        descripcionPieza: producto,
                        noParte: numeroParte,
                        material: material,
                        cantidadLote: formData.cantidadLote,
                        turno2: {
                            elaboro: formData.elaboro,
                            operador: formData.operador,
                            revisiones: {
                                1: {
                                    revision1: formData.revision1,
                                    hora1: formData.hora1,
                                    tono1: formData.tono1,
                                    contaminacion1: formData.contaminacion1,
                                    rebanada1: formData.rebanada1,
                                    rafaga1: formData.rafaga1,
                                    rechupe1: formData.rechupe1,
                                    piezaCompleta1: formData.piezaCompleta1,
                                    grietas1: formData.grietas1,
                                    inyeccion1: formData.inyeccion1,
                                    consistencia1: formData.consistencia1,
                                    funcionalidad1: formData.funcionalidad1,
                                    empaque1: formData.empaque1,
                                    otros1: formData.otros1,
                                    piezasRevisadas1: formData.piezasRevisadas1,
                                    cantidadPiezas1: formData.cantidadPiezas1,
                                    motivoCancelacion1: motivoCancelacion1
                                },
                                2: {
                                    revision2: formData.revision2,
                                    hora2: formData.hora2,
                                    tono2: formData.tono2,
                                    contaminacion2: formData.contaminacion2,
                                    rebanada2: formData.rebanada2,
                                    rafaga2: formData.rafaga2,
                                    rechupe2: formData.rechupe2,
                                    piezaCompleta2: formData.piezaCompleta2,
                                    grietas2: formData.grietas2,
                                    inyeccion2: formData.inyeccion2,
                                    consistencia2: formData.consistencia2,
                                    funcionalidad2: formData.funcionalidad2,
                                    empaque2: formData.empaque,
                                    otros2: formData.otros2,
                                    piezasRevisadas2: formData.piezasRevisadas2,
                                    cantidadPiezas2: formData.cantidadPiezas2,
                                    motivoCancelacion2: motivoCancelacion2
                                },
                                3: {
                                    revision3: formData.revision3,
                                    hora3: formData.hora3,
                                    tono3: formData.tono3,
                                    contaminacion3: formData.contaminacion3,
                                    rebanada3: formData.rebanada3,
                                    rafaga3: formData.rafaga3,
                                    rechupe3: formData.rechupe3,
                                    piezaCompleta3: formData.piezaCompleta3,
                                    grietas3: formData.grietas3,
                                    inyeccion3: formData.inyeccion3,
                                    consistencia3: formData.consistencia3,
                                    funcionalidad3: formData.funcionalidad3,
                                    empaque3: formData.empaque3,
                                    otros3: formData.otros3,
                                    piezasRevisadas3: formData.piezasRevisadas3,
                                    cantidadPiezas3: formData.cantidadPiezas3,
                                    motivoCancelacion3: motivoCancelacion3
                                },
                                4: {
                                    revision4: formData.revision4,
                                    hora4: formData.hora4,
                                    tono4: formData.tono4,
                                    contaminacion4: formData.contaminacion4,
                                    rebanada4: formData.rebanada4,
                                    rafaga4: formData.rafaga4,
                                    rechupe4: formData.rechupe4,
                                    piezaCompleta4: formData.piezaCompleta4,
                                    grietas4: formData.grietas4,
                                    inyeccion4: formData.inyeccion4,
                                    consistencia4: formData.consistencia4,
                                    funcionalidad4: formData.funcionalidad4,
                                    empaque4: formData.empaque4,
                                    otros4: formData.otros4,
                                    piezasRevisadas4: formData.piezasRevisadas4,
                                    cantidadPiezas4: formData.cantidadPiezas4,
                                    motivoCancelacion4: motivoCancelacion4
                                },
                                5: {
                                    revision5: formData.revision5,
                                    hora5: formData.hora5,
                                    tono5: formData.tono5,
                                    contaminacion5: formData.contaminacion5,
                                    rebanada5: formData.rebanada5,
                                    rafaga5: formData.rafaga5,
                                    rechupe5: formData.rechupe5,
                                    piezaCompleta5: formData.piezaCompleta5,
                                    grietas5: formData.grietas5,
                                    inyeccion5: formData.inyeccion5,
                                    consistencia5: formData.consistencia5,
                                    funcionalidad5: formData.funcionalidad5,
                                    empaque5: formData.empaque5,
                                    otros5: formData.otros5,
                                    piezasRevisadas5: formData.piezasRevisadas5,
                                    cantidadPiezas5: formData.cantidadPiezas5,
                                    motivoCancelacion5: motivoCancelacion5
                                },
                                6: {
                                    revision6: formData.revision6,
                                    hora6: formData.hora6,
                                    tono6: formData.tono6,
                                    contaminacion6: formData.contaminacion6,
                                    rebanada6: formData.rebanada6,
                                    rafaga6: formData.rafaga6,
                                    rechupe6: formData.rechupe6,
                                    piezaCompleta6: formData.piezaCompleta6,
                                    grietas6: formData.grietas6,
                                    inyeccion6: formData.inyeccion6,
                                    consistencia6: formData.consistencia6,
                                    funcionalidad6: formData.funcionalidad6,
                                    empaque6: formData.empaque6,
                                    otros6: formData.otros6,
                                    piezasRevisadas6: formData.piezasRevisadas6,
                                    cantidadPiezas6: formData.cantidadPiezas6,
                                    motivoCancelacion6: motivoCancelacion6
                                },
                                7: {
                                    revision7: formData.revision7,
                                    hora7: formData.hora7,
                                    tono7: formData.tono7,
                                    contaminacion7: formData.contaminacion7,
                                    rebanada7: formData.rebanada7,
                                    rafaga7: formData.rafaga7,
                                    rechupe7: formData.rechupe7,
                                    piezaCompleta7: formData.piezaCompleta7,
                                    grietas7: formData.grietas7,
                                    inyeccion7: formData.inyeccion7,
                                    consistencia7: formData.consistencia7,
                                    funcionalidad7: formData.funcionalidad7,
                                    empaque7: formData.empaque7,
                                    otros7: formData.otros7,
                                    piezasRevisadas7: formData.piezasRevisadas7,
                                    cantidadPiezas7: formData.cantidadPiezas7,
                                    motivoCancelacion7: motivoCancelacion7
                                },
                                8: {
                                    revision8: formData.revision8,
                                    hora8: formData.hora8,
                                    tono8: formData.tono8,
                                    contaminacion8: formData.contaminacion8,
                                    rebanada8: formData.rebanada8,
                                    rafaga8: formData.rafaga8,
                                    rechupe8: formData.rechupe8,
                                    piezaCompleta8: formData.piezaCompleta8,
                                    grietas8: formData.grietas8,
                                    inyeccion8: formData.inyeccion8,
                                    consistencia8: formData.consistencia8,
                                    funcionalidad8: formData.funcionalidad8,
                                    empaque8: formData.empaque8,
                                    otros8: formData.otros8,
                                    piezasRevisadas8: formData.piezasRevisadas8,
                                    cantidadPiezas8: formData.cantidadPiezas8,
                                    motivoCancelacion8: motivoCancelacion8
                                },
                                9: {
                                    revision9: formData.revision9,
                                    hora9: formData.hora9,
                                    tono9: formData.tono9,
                                    contaminacion9: formData.contaminacion9,
                                    rebanada9: formData.rebanada9,
                                    rafaga9: formData.rafaga9,
                                    rechupe9: formData.rechupe9,
                                    piezaCompleta9: formData.piezaCompleta9,
                                    grietas9: formData.grietas9,
                                    inyeccion9: formData.inyeccion9,
                                    consistencia9: formData.consistencia9,
                                    funcionalidad9: formData.funcionalidad9,
                                    empaque9: formData.empaque9,
                                    otros9: formData.otros9,
                                    piezasRevisadas9: formData.piezasRevisadas9,
                                    cantidadPiezas9: formData.cantidadPiezas9,
                                    motivoCancelacion9: motivoCancelacion9
                                },
                                10: {
                                    revision10: formData.revision10,
                                    hora10: formData.hora10,
                                    tono10: formData.tono10,
                                    contaminacion10: formData.contaminacion10,
                                    rebanada10: formData.rebanada10,
                                    rafaga10: formData.rafaga10,
                                    rechupe10: formData.rechupe10,
                                    piezaCompleta10: formData.piezaCompleta10,
                                    grietas10: formData.grietas10,
                                    inyeccion10: formData.inyeccion10,
                                    consistencia10: formData.consistencia10,
                                    funcionalidad10: formData.funcionalidad10,
                                    empaque10: formData.empaque10,
                                    otros10: formData.otros10,
                                    piezasRevisadas10: formData.piezasRevisadas10,
                                    cantidadPiezas10: formData.cantidadPiezas10,
                                    motivoCancelacion10: motivoCancelacion10
                                },
                            }
                        },
                        status: "Activo"
                    }

                    //console.log(dataTemp)
                    try {
                        registraInspeccionPieza(dataTemp).then(response => {
                            const { data } = response;
                            LogsInformativos("Inspeccion de pieza realizada ", dataTemp)
                            setLoading(false)
                            toast.success(data.mensaje)
                            rutaRegreso()
                        }).catch(e => {
                            console.log(e)
                            if (e.message === 'Network Error') {
                                //console.log("No hay internet")
                                toast.error("Conexión al servidor no disponible");
                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Para guardar el motivo de la primera revision
    const [motivoCancelacion1, setMotivoCancelacion1] = useState("");

    // Para guardar el motivo de la segunda revision
    const [motivoCancelacion2, setMotivoCancelacion2] = useState("");

    // Para guardar el motivo de la tercera revision
    const [motivoCancelacion3, setMotivoCancelacion3] = useState("");

    // Para guardar el motivo de la cuarta revision
    const [motivoCancelacion4, setMotivoCancelacion4] = useState("");

    // Para guardar el motivo de la quinta revision
    const [motivoCancelacion5, setMotivoCancelacion5] = useState("");

    // Para guardar el motivo de la sexta revision
    const [motivoCancelacion6, setMotivoCancelacion6] = useState("");

    // Para guardar el motivo de la septima revision
    const [motivoCancelacion7, setMotivoCancelacion7] = useState("");

    // Para guardar el motivo de la octava revision
    const [motivoCancelacion8, setMotivoCancelacion8] = useState("");

    // Para guardar el motivo de la novena revision
    const [motivoCancelacion9, setMotivoCancelacion9] = useState("");

    // Para guardar el motivo de la decima revision
    const [motivoCancelacion10, setMotivoCancelacion10] = useState("");

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Nuevo registro de inspeccion de pieza
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
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
                            <div className="encabezado">
                                <Container fluid>
                                    <br />
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha de elaboracion
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Fecha de elaboración"
                                                    name="fechaElaboracion"
                                                    defaultValue={formData.fechaElaboracion}
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Descripcion pieza
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Descripcion de la pieza"
                                                    name="producto"
                                                    value={producto}
                                                    disabled
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    No. O.P
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe el numero de la OP"
                                                    name="ordenProduccion"
                                                    defaultValue={formData.ordenProduccion}
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    No. de parte
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Numero de parte"
                                                    name="numeroParte"
                                                    value={numeroParte}
                                                    disabled
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Fecha de arranque de maquina
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Fecha de arranque de maquina"
                                                    name="fechaArranque"
                                                    defaultValue={formData.fechaArranque}
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Material
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Material"
                                                    name="material"
                                                    value={material}
                                                    disabled
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    No. Maquina
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Mumero de la maquina"
                                                    name="numeroMaquina"
                                                    defaultValue={formData.numeroMaquina}
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Cantidad lote
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Cantidad lote"
                                                    name="cantidadLote"
                                                    defaultValue={formData.cantidadLote}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Cliente
                                                </Form.Label>
                                            </Col>
                                            <Col sm="4">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre del cliente"
                                                    name="nombreCliente"
                                                    value={nombreCliente}
                                                    disabled
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </div>
                            <br />


                            <Row className="mb-3">
                                <Form.Group as={Row} className="botones">
                                    <Col>
                                        <Button
                                            variant={turno != "1" ? "light" : "dark"}
                                            className="turno"
                                            onClick={() => {
                                                setTurno("1");
                                            }}
                                        >
                                            Turno 1
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant={turno != "2" ? "light" : "dark"}
                                            className="turno"
                                            onClick={() => {
                                                setTurno("2");
                                            }}
                                        >
                                            Turno 2
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Row>

                            <div className="datosHerramientas">
                                <Container fluid>
                                    <br />
                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Elaboro
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Elaboro"
                                                    name="elaboro"
                                                    defaultValue={formData.elaboro}
                                                />
                                            </Col>

                                            <Col sm="2">
                                                <Form.Label>
                                                    Operador
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Operador"
                                                    name="operador"
                                                    defaultValue={formData.operador}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row}>
                                            <Col sm="2">
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision1 == 0 ? "success" : revision1 == 1 ? "warning" : revision1 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision1(revision1 + 1);
                                                        {
                                                            (revision1 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion1}
                                                                        revision={revision1 + 1}
                                                                        setRevision={setRevision1}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision1 == 0 ? "Iniciar" : revision1 == 1 ? "Guardar" : revision1 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision2 == 0 ? "success" : revision2 == 1 ? "warning" : revision2 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision2(revision2 + 1);
                                                        {
                                                            (revision2 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion2}
                                                                        revision={revision2 + 1}
                                                                        setRevision={setRevision2}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision2 == 0 ? "Iniciar" : revision2 == 1 ? "Guardar" : revision2 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision3 == 0 ? "success" : revision3 == 1 ? "warning" : revision3 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision3(revision3 + 1);
                                                        {
                                                            (revision3 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion3}
                                                                        revision={revision3 + 1}
                                                                        setRevision={setRevision3}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision3 == 0 ? "Iniciar" : revision3 == 1 ? "Guardar" : revision3 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision4 == 0 ? "success" : revision4 == 1 ? "warning" : revision4 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision4(revision4 + 1);
                                                        {
                                                            (revision4 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion4}
                                                                        revision={revision4 + 1}
                                                                        setRevision={setRevision4}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision4 == 0 ? "Iniciar" : revision4 == 1 ? "Guardar" : revision4 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision5 == 0 ? "success" : revision5 == 1 ? "warning" : revision5 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision5(revision5 + 1);
                                                        {
                                                            (revision5 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion5}
                                                                        revision={revision5 + 1}
                                                                        setRevision={setRevision5}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision5 == 0 ? "Iniciar" : revision5 == 1 ? "Guardar" : revision5 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision6 == 0 ? "success" : revision6 == 1 ? "warning" : revision6 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision6(revision6 + 1);
                                                        {
                                                            (revision6 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion6}
                                                                        revision={revision6 + 1}
                                                                        setRevision={setRevision6}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision6 == 0 ? "Iniciar" : revision6 == 1 ? "Guardar" : revision6 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision7 == 0 ? "success" : revision7 == 1 ? "warning" : revision7 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision7(revision7 + 1);
                                                        {
                                                            (revision7 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion7}
                                                                        revision={revision7 + 1}
                                                                        setRevision={setRevision7}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision7 == 0 ? "Iniciar" : revision7 == 1 ? "Guardar" : revision7 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision8 == 0 ? "success" : revision8 == 1 ? "warning" : revision8 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision8(revision8 + 1);
                                                        {
                                                            (revision8 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion8}
                                                                        revision={revision8 + 1}
                                                                        setRevision={setRevision8}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision8 == 0 ? "Iniciar" : revision8 == 1 ? "Guardar" : revision8 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision9 == 0 ? "success" : revision9 == 1 ? "warning" : revision9 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision9(revision9 + 1);
                                                        {
                                                            (revision9 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion9}
                                                                        revision={revision9 + 1}
                                                                        setRevision={setRevision9}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision9 == 0 ? "Iniciar" : revision9 == 1 ? "Guardar" : revision9 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                            <Col>
                                                <Badge
                                                    bg={revision10 == 0 ? "success" : revision10 == 1 ? "warning" : revision10 == 2 ? "secondary" : "danger"}
                                                    className="boton"
                                                    onClick={() => {
                                                        setRevision10(revision10 + 1);
                                                        {
                                                            (revision10 == 2 &&
                                                                cancelacionInspeccion(
                                                                    <CancelacionInspeccion
                                                                        setShowModal={setShowModal}
                                                                        setMotivoCancelacion={setMotivoCancelacion10}
                                                                        revision={revision10 + 1}
                                                                        setRevision={setRevision10}
                                                                    />
                                                                )
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {revision10 == 0 ? "Iniciar" : revision10 == 1 ? "Guardar" : revision10 == 2 ? "Finalizado" : "Cancelado"}
                                                </Badge>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    REVISIÓN
                                                </Form.Label>
                                            </Col>
                                            <Col >
                                                <Form.Control
                                                    type="text"
                                                    name="revision1"
                                                    defaultValue={formData.revision1}
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision2"
                                                    defaultValue={formData.revision2}
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision3"
                                                    defaultValue={formData.revision3}
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision4"
                                                    defaultValue={formData.revision4}
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision5"
                                                    defaultValue={formData.revision5}
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision6"
                                                    defaultValue={formData.revision6}
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision7"
                                                    defaultValue={formData.revision7}
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision8"
                                                    defaultValue={formData.revision8}
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision9"
                                                    defaultValue={formData.revision9}
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="revision10"
                                                    defaultValue={formData.revision10}
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    HORA
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora1"
                                                    defaultValue={formData.hora1}
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora2"
                                                    defaultValue={formData.hora2}
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora3"
                                                    defaultValue={formData.hora3}
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora4"
                                                    defaultValue={formData.hora4}
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora5"
                                                    defaultValue={formData.hora5}
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora6"
                                                    defaultValue={formData.hora6}
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora7"
                                                    defaultValue={formData.hora7}
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora8"
                                                    defaultValue={formData.hora8}
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora9"
                                                    defaultValue={formData.hora9}
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="hora10"
                                                    defaultValue={formData.hora10}
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    1-Tono
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono1"
                                                    defaultValue={formData.tono1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono2"
                                                    defaultValue={formData.tono2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono3"
                                                    defaultValue={formData.tono3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono4"
                                                    defaultValue={formData.tono4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono5"
                                                    defaultValue={formData.tono5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono6"
                                                    defaultValue={formData.tono6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono7"
                                                    defaultValue={formData.tono7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono8"
                                                    defaultValue={formData.tono8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono9"
                                                    defaultValue={formData.tono9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="tono10"
                                                    defaultValue={formData.tono10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    2-Contaminación
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion1"
                                                    defaultValue={formData.contaminacion1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion2"
                                                    defaultValue={formData.contaminacion2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion3"
                                                    defaultValue={formData.contaminacion3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion4"
                                                    defaultValue={formData.contaminacion4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion5"
                                                    defaultValue={formData.contaminacion5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion6"
                                                    defaultValue={formData.contaminacion6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion7"
                                                    defaultValue={formData.contaminacion7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion8"
                                                    defaultValue={formData.contaminacion8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion9"
                                                    defaultValue={formData.contaminacion9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="contaminacion10"
                                                    defaultValue={formData.contaminacion10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    3-Rebanada
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada1"
                                                    defaultValue={formData.rebanada1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada2"
                                                    defaultValue={formData.rebanada2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada3"
                                                    defaultValue={formData.rebanada3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada4"
                                                    defaultValue={formData.rebanada4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada5"
                                                    defaultValue={formData.rebanada5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada6"
                                                    defaultValue={formData.rebanada6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada7"
                                                    defaultValue={formData.rebanada7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada8"
                                                    defaultValue={formData.rebanada8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada9"
                                                    defaultValue={formData.rebanada9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rebanada10"
                                                    defaultValue={formData.rebanada10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    4-Rafágas
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga1"
                                                    defaultValue={formData.rafaga1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga2"
                                                    defaultValue={formData.rafaga2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga3"
                                                    defaultValue={formData.rafaga3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga4"
                                                    defaultValue={formData.rafaga4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga5"
                                                    defaultValue={formData.rafaga5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga6"
                                                    defaultValue={formData.rafaga6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga7"
                                                    defaultValue={formData.rafaga7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga8"
                                                    defaultValue={formData.rafaga8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga9"
                                                    defaultValue={formData.rafaga9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rafaga10"
                                                    defaultValue={formData.rafaga10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    5-Rechupe
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe1"
                                                    defaultValue={formData.rechupe1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe2"
                                                    defaultValue={formData.rechupe2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe3"
                                                    defaultValue={formData.rechupe3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe4"
                                                    defaultValue={formData.rechupe4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe5"
                                                    defaultValue={formData.rechupe5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe6"
                                                    defaultValue={formData.rechupe6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe7"
                                                    defaultValue={formData.rechupe7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe8"
                                                    defaultValue={formData.rechupe8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe9"
                                                    defaultValue={formData.rechupe9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="rechupe10"
                                                    defaultValue={formData.rechupe10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    6-Pieza completa
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta1"
                                                    defaultValue={formData.piezaCompleta1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta2"
                                                    defaultValue={formData.piezaCompleta2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta3"
                                                    defaultValue={formData.piezaCompleta3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta4"
                                                    defaultValue={formData.piezaCompleta4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta5"
                                                    defaultValue={formData.piezaCompleta5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta6"
                                                    defaultValue={formData.piezaCompleta6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta7"
                                                    defaultValue={formData.piezaCompleta7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta8"
                                                    defaultValue={formData.piezaCompleta8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta9"
                                                    defaultValue={formData.piezaCompleta9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="piezaCompleta10"
                                                    defaultValue={formData.piezaCompleta10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    7-Grietas de tensión
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas1"
                                                    defaultValue={formData.grietas1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas2"
                                                    defaultValue={formData.grietas2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas3"
                                                    defaultValue={formData.grietas3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas4"
                                                    defaultValue={formData.grietas4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas5"
                                                    defaultValue={formData.grietas5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas6"
                                                    defaultValue={formData.grietas6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas7"
                                                    defaultValue={formData.grietas7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas8"
                                                    defaultValue={formData.grietas8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas9"
                                                    defaultValue={formData.grietas9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="grietas10"
                                                    defaultValue={formData.grietas10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    8-Punto de inyección
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion1"
                                                    defaultValue={formData.inyeccion1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion2"
                                                    defaultValue={formData.inyeccion2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion3"
                                                    defaultValue={formData.inyeccion3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion4"
                                                    defaultValue={formData.inyeccion4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion5"
                                                    defaultValue={formData.inyeccion5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion6"
                                                    defaultValue={formData.inyeccion6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion7"
                                                    defaultValue={formData.inyeccion7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion8"
                                                    defaultValue={formData.inyeccion8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion9"
                                                    defaultValue={formData.inyeccion9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="inyeccion10"
                                                    defaultValue={formData.inyeccion10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    9-Consistencia
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia1"
                                                    defaultValue={formData.consistencia1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia2"
                                                    defaultValue={formData.consistencia2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia3"
                                                    defaultValue={formData.consistencia3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia4"
                                                    defaultValue={formData.consistencia4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia5"
                                                    defaultValue={formData.consistencia5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia6"
                                                    defaultValue={formData.consistencia6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia7"
                                                    defaultValue={formData.consistencia7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia8"
                                                    defaultValue={formData.consistencia8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia9"
                                                    defaultValue={formData.consistencia9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="consistencia10"
                                                    defaultValue={formData.consistencia10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    10-Funcionalidad
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad1"
                                                    defaultValue={formData.funcionalidad1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad2"
                                                    defaultValue={formData.funcionalidad2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad3"
                                                    defaultValue={formData.funcionalidad3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad4"
                                                    defaultValue={formData.funcionalidad4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad5"
                                                    defaultValue={formData.funcionalidad5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad6"
                                                    defaultValue={formData.funcionalidad6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad7"
                                                    defaultValue={formData.funcionalidad7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad8"
                                                    defaultValue={formData.funcionalidad8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad9"
                                                    defaultValue={formData.funcionalidad9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="funcionalidad10"
                                                    defaultValue={formData.funcionalidad10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    11-Empaque
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque1"
                                                    defaultValue={formData.empaque1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque2"
                                                    defaultValue={formData.empaque2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque3"
                                                    defaultValue={formData.empaque3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque4"
                                                    defaultValue={formData.empaque4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque5"
                                                    defaultValue={formData.empaque5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque6"
                                                    defaultValue={formData.empaque6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque7"
                                                    defaultValue={formData.empaque7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque8"
                                                    defaultValue={formData.empaque8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque9"
                                                    defaultValue={formData.empaque9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="empaque10"
                                                    defaultValue={formData.empaque10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    12-Otros
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros1"
                                                    defaultValue={formData.otros1}
                                                    disabled={revision1 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros2"
                                                    defaultValue={formData.otros2}
                                                    disabled={revision2 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros3"
                                                    defaultValue={formData.otros3}
                                                    disabled={revision3 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros4"
                                                    defaultValue={formData.otros4}
                                                    disabled={revision4 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros5"
                                                    defaultValue={formData.otros5}
                                                    disabled={revision5 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros6"
                                                    defaultValue={formData.otros6}
                                                    disabled={revision6 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros7"
                                                    defaultValue={formData.otros7}
                                                    disabled={revision7 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros8"
                                                    defaultValue={formData.otros8}
                                                    disabled={revision8 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros9"
                                                    defaultValue={formData.otros9}
                                                    disabled={revision9 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    name="otros10"
                                                    defaultValue={formData.otros10}
                                                    disabled={revision10 != 1}
                                                >
                                                    <option></option>
                                                    <option value="ok">OK</option>
                                                    <option value="noOK">NO OK</option></Form.Control>
                                            </Col>

                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Total de piezas revisadas
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas1"
                                                    defaultValue={formData.piezasRevisadas1}
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas2"
                                                    defaultValue={formData.piezasRevisadas2}
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas3"
                                                    defaultValue={formData.piezasRevisadas3}
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas4"
                                                    defaultValue={formData.piezasRevisadas4}
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas5"
                                                    defaultValue={formData.piezasRevisadas5}
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas6"
                                                    defaultValue={formData.piezasRevisadas6}
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas7"
                                                    defaultValue={formData.piezasRevisadas7}
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas8"
                                                    defaultValue={formData.piezasRevisadas8}
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas9"
                                                    defaultValue={formData.piezasRevisadas9}
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="piezasRevisadas10"
                                                    defaultValue={formData.piezasRevisadas10}
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                            <Col sm="2">
                                                <Form.Label>
                                                    Cantidad de piezas por defecto
                                                </Form.Label>
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas1"
                                                    defaultValue={formData.cantidadPiezas1}
                                                    disabled={revision1 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas2"
                                                    defaultValue={formData.cantidadPiezas2}
                                                    disabled={revision2 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas3"
                                                    defaultValue={formData.cantidadPiezas3}
                                                    disabled={revision3 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas4"
                                                    defaultValue={formData.cantidadPiezas4}
                                                    disabled={revision4 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas5"
                                                    defaultValue={formData.cantidadPiezas5}
                                                    disabled={revision5 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas6"
                                                    defaultValue={formData.cantidadPiezas6}
                                                    disabled={revision6 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas7"
                                                    defaultValue={formData.cantidadPiezas7}
                                                    disabled={revision7 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas8"
                                                    defaultValue={formData.cantidadPiezas8}
                                                    disabled={revision8 != 1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas9"
                                                    defaultValue={formData.cantidadPiezas9}
                                                    disabled={revision9 != 1}
                                                />
                                            </Col>

                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="cantidadPiezas10"
                                                    defaultValue={formData.cantidadPiezas10}
                                                    disabled={revision10 != 1}
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                </Container>
                            </div>

                            <Form.Group as={Row} className="botones">
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

            </LayoutPrincipal>
        </>
    );
}

function initialFormData() {
    return {
        fechaElaboracion: "",
        producto: "",
        ordenProduccion: "",
        numeroParte: "",
        fechaArranque: "",
        material: "",
        numeroMaquina: "",
        cantidadLote: "",
        nombreCliente: "",
        elaboro: "",
        operador: "",
        revision1: "",
        revision2: "",
        revision3: "",
        revision4: "",
        revision5: "",
        revision6: "",
        revision7: "",
        revision8: "",
        revision9: "",
        revision10: "",
        hora1: "",
        hora2: "",
        hora3: "",
        hora4: "",
        hora5: "",
        hora6: "",
        hora7: "",
        hora8: "",
        hora9: "",
        hora10: "",
        tono1: "",
        tono2: "",
        tono3: "",
        tono4: "",
        tono5: "",
        tono6: "",
        tono7: "",
        tono8: "",
        tono9: "",
        tono10: "",
        contaminacion1: "",
        contaminacion2: "",
        contaminacion3: "",
        contaminacion4: "",
        contaminacion5: "",
        contaminacion6: "",
        contaminacion7: "",
        contaminacion8: "",
        contaminacion9: "",
        contaminacion10: "",
        rebanada1: "",
        rebanada2: "",
        rebanada3: "",
        rebanada4: "",
        rebanada5: "",
        rebanada6: "",
        rebanada7: "",
        rebanada8: "",
        rebanada9: "",
        rebanada10: "",
        rafaga1: "",
        rafaga2: "",
        rafaga3: "",
        rafaga4: "",
        rafaga5: "",
        rafaga6: "",
        rafaga7: "",
        rafaga8: "",
        rafaga9: "",
        rafaga10: "",
        rechupe1: "",
        rechupe2: "",
        rechupe3: "",
        rechupe4: "",
        rechupe5: "",
        rechupe6: "",
        rechupe7: "",
        rechupe8: "",
        rechupe9: "",
        rechupe10: "",
        piezaCompleta1: "",
        piezaCompleta2: "",
        piezaCompleta3: "",
        piezaCompleta4: "",
        piezaCompleta5: "",
        piezaCompleta6: "",
        piezaCompleta7: "",
        piezaCompleta8: "",
        piezaCompleta9: "",
        piezaCompleta10: "",
        grietas1: "",
        grietas2: "",
        grietas3: "",
        grietas4: "",
        grietas5: "",
        grietas6: "",
        grietas7: "",
        grietas8: "",
        grietas9: "",
        grietas10: "",
        inyeccion1: "",
        inyeccion2: "",
        inyeccion3: "",
        inyeccion4: "",
        inyeccion5: "",
        inyeccion6: "",
        inyeccion7: "",
        inyeccion8: "",
        inyeccion9: "",
        inyeccion10: "",
        consistencia1: "",
        consistencia2: "",
        consistencia3: "",
        consistencia4: "",
        consistencia5: "",
        consistencia6: "",
        consistencia7: "",
        consistencia8: "",
        consistencia9: "",
        consistencia10: "",
        funcionalidad1: "",
        funcionalidad2: "",
        funcionalidad3: "",
        funcionalidad4: "",
        funcionalidad5: "",
        funcionalidad6: "",
        funcionalidad7: "",
        funcionalidad8: "",
        funcionalidad9: "",
        funcionalidad10: "",
        empaque1: "",
        empaque2: "",
        empaque3: "",
        empaque4: "",
        empaque5: "",
        empaque6: "",
        empaque7: "",
        empaque8: "",
        empaque9: "",
        empaque10: "",
        otros1: "",
        otros2: "",
        otros3: "",
        otros4: "",
        otros5: "",
        otros6: "",
        otros7: "",
        otros8: "",
        otros9: "",
        otros10: "",
        piezasRevisadas1: "",
        piezasRevisadas2: "",
        piezasRevisadas3: "",
        piezasRevisadas4: "",
        piezasRevisadas5: "",
        piezasRevisadas6: "",
        piezasRevisadas7: "",
        piezasRevisadas8: "",
        piezasRevisadas9: "",
        piezasRevisadas10: "",
        cantidadPiezas1: "",
        cantidadPiezas2: "",
        cantidadPiezas3: "",
        cantidadPiezas4: "",
        cantidadPiezas5: "",
        cantidadPiezas6: "",
        cantidadPiezas7: "",
        cantidadPiezas8: "",
        cantidadPiezas9: "",
        cantidadPiezas10: "",
    }
}

export default RegistraInspeccionMaterial;
