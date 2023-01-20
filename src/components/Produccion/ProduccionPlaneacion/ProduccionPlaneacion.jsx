import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import AgregarResultado from "../AgregarResultado";
import AgregarRegistro from "../AgregarRegistro";
import { useHistory, useParams } from "react-router-dom";
import "./ProduccionPlaneacion.scss";
import { map } from "lodash";
import { listarMatrizProductosActivos, obtenerMatrizProducto } from "../../../api/matrizProductos";
import { obtenerCliente } from "../../../api/clientes";
import { obtenerNumeroProduccion, obtenerItemProduccion, registraProduccion } from "../../../api/produccion";
import { toast } from "react-toastify";
import BuscarOV from "../../../page/BuscarOV";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import BuscarPlaneacion from '../../../page/BuscarPlaneacion';
import { obtenerMaquina } from "../../../api/maquinas";
import { obtenerRequerimiento } from "../../../api/requerimientosPlaneacion";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function ProduccionPlaneacion(props) {
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

    const params = useParams();
    const { id } = params

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataPlaneacion, setFormDataPlaneacion] = useState(initialPlaneacion());

    // Para almacenar la informacion del formulario
    const [formDataProduccion, setFormDataProduccion] = useState(initialFormDataPlaneacionInitial());

    const [listResultados, setListResultados] = useState([]);

    const [listRegistros, setListRegistros] = useState([]);

    const [cantidadRequeridaOV, setCantidadRequeridaOV] = useState("");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para almacenar el folio actual
    const [folioActual, setFolioActual] = useState("");

    useEffect(() => {
        try {
            obtenerNumeroProduccion().then(response => {
                const { data } = response;
                // console.log(data)
                const { noProduccion } = data;
                setFolioActual(noProduccion)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerRequerimiento(id).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formDataPlaneacion && data) {
                    setFormDataPlaneacion(initialFormDataPlaneacion(data));
                } else {
                    const datosProduccion = initialFormDataPlaneacion(data);
                    setFormDataPlaneacion(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [id]);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMatrizProducto(formDataPlaneacion.producto).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formDataProduccion && data) {
                    setFormDataProduccion(initialFormDataProduccion(data));
                } else {
                    const datosProduccion = initialFormDataProduccion(data);
                    setFormDataProduccion(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataPlaneacion.producto]);

    const [numeroMaquina1, setNumeroMaquina1] = useState("");

    const [nombreMaquina1, setNombreMaquina1] = useState("");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(formDataProduccion.opcion1).then(response => {
                const { data } = response;
                setNumeroMaquina1(data.numeroMaquina);
                setNombreMaquina1(data.marca)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataProduccion.opcion1]);

    const [numeroMaquina2, setNumeroMaquina2] = useState("");

    const [nombreMaquina2, setNombreMaquina2] = useState("");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(formDataProduccion.opcion2).then(response => {
                const { data } = response;
                setNumeroMaquina2(data.numeroMaquina);
                setNombreMaquina2(data.marca)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataProduccion.opcion2]);

    const [numeroMaquina3, setNumeroMaquina3] = useState("");

    const [nombreMaquina3, setNombreMaquina3] = useState("");

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(formDataProduccion.opcion3).then(response => {
                const { data } = response;
                setNumeroMaquina3(data.numeroMaquina);
                setNombreMaquina3(data.marca)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [formDataProduccion.opcion3]);

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

    // Para almacenar la materia prima seleccionada
    const [producto, setProducto] = useState([]);

    const handleProducto = (articulo) => {
        // console.log(articulo)
        // {materiaprima?.folioMP + "/" + materiaprima?.nombre + "/" + materiaprima?.um + "/" + materiaprima?.existenciasOV + "/" + materiaprima?.existenciasStock + "/" + materiaprima?.existenciasTotales}
        const temp = articulo.split("/")
        // console.log(temp)

        // console.log(dataTemp)
        setProducto({
            id: temp[0],
            noIntermo: temp[1],
            noParte: temp[2],
            descripcion: temp[3],
            cliente: temp[4],
            cavMolde: temp[5],
            material: temp[6],
            molido: temp[7],
            pesoPieza: temp[8],
            pesoColada: temp[9],
            pigmentoMb: temp[10],
            aplicacionGxKG: temp[11],
            empaque: temp[12],
            bolsasCajasUtilizar: temp[13]
        })
    }

    const [nombreCliente, setNombreCliente] = useState("");

    useEffect(() => {
        try {
            obtenerCliente(producto.cliente).then(response => {
                const { data } = response;
                const { nombre, apellidos } = data;
                setNombreCliente(nombre + " " + apellidos)

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [producto.cliente]);

    const onSubmit = e => {
        e.preventDefault();
        //console.log("Continuar")
        setLoading(true)

        // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
        obtenerItemProduccion().then(response => {
            const { data } = response;
            const dataTemp = {
                item: data.item,
                folio: folioActual,
                sucursal: getSucursal(),
                generalidades: {
                    ordenVenta: formDataPlaneacion.ordenVenta,
                    folioPlaneacion: formDataPlaneacion.folioPlaneacion,
                    noInterno: formDataProduccion.noInterno,
                    noParte: formDataProduccion.noParte,
                    idProducto: formDataPlaneacion.producto,
                    producto: formDataPlaneacion.nombreProducto,
                    cliente: formDataProduccion.cliente,
                    nombreCliente: formDataProduccion.nombreCliente
                },
                planeacion: {
                    ordenProduccion: folioActual,
                    fecha: fechaActual,
                    noParte: formDataProduccion.noParte,
                    noCavidades: formDataProduccion.cavMolde,
                    cantidadProducir: formDataPlaneacion.cantidadProducir,
                    opcionesMaquinaria: {
                        1: {
                            numeroMaquina1: numeroMaquina1,
                            maquina1: nombreMaquina1,
                            ciclo1: formDataProduccion.tiempoCiclo1,
                            pieza1: piezasTurno1,
                            bolsa1: formDataProduccion.noPiezasxEmpaque,
                        },
                        2: {
                            numeroMaquina2: numeroMaquina2,
                            maquina2: nombreMaquina2,
                            ciclo2: formDataProduccion.tiempoCiclo2,
                            pieza2: piezasTurno2,
                            bolsa2: formDataProduccion.noPiezasxEmpaque,
                        },
                        3: {
                            numeroMaquina3: numeroMaquina3,
                            maquina3: nombreMaquina3,
                            ciclo3: formDataProduccion.tiempoCiclo3,
                            pieza3: piezasTurno3,
                            bolsa3: formDataProduccion.noPiezasxEmpaque,
                        },
                    },
                },
                bom: {
                    material: formDataProduccion.descripcionMP,
                    molido: formDataProduccion.porcentajeMolido,
                    pesoPieza: formDataProduccion.pesoPiezas,
                    pesoColada: formDataProduccion.pesoColada,
                    kgMaterial: kgMaterial,
                    pigmento: formDataProduccion.descripcionPigmento,
                    aplicacion: formDataProduccion.aplicacionGxKG,
                    pigMb: pigMB,
                    materialxTurno: materialTurno,
                    merma: formDataProduccion.porcentajeScrap,
                    empaque: formDataProduccion.descripcionBolsa,
                    bolsasCajasUtilizar: bolsasCajasUtilizar,
                    notas: formData.notasImportantes,
                    elaboro: formData.elaboro,
                },
                resultados: listResultados,
                materiaPrima: listRegistros,
                observaciones: formData.observaciones,
                estado: "true"
            }
            // console.log(dataTemp)
            // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
            // 
            // Modificar el pedido creado recientemente
            registraProduccion(dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                LogsInformativos("Se a registrado la produccion " + folioActual, dataTemp)
                // Actualizacion del tracking
                LogTrackingActualizacion(formDataPlaneacion.ordenVenta, "En produccion", "6")
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

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataPlaneacion({ ...formDataPlaneacion, [e.target.name]: e.target.value })
        setFormDataProduccion({ ...formDataProduccion, [e.target.name]: e.target.value })
    }

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

    const [ordenVenta, setOrdenVenta] = useState("");

    const buscarOV = (content) => {
        setTitulosModal("Buscar planeacion");
        setContentModal(content);
        setShowModal(true);
    }

    //let totalProducir = (listOVCargadas.reduce((amount, item) => (amount + parseInt(item.cantidadProducirOV)), 0));

    let kgMaterial = ((Number(formDataProduccion.pesoPiezas) + (Number(formDataProduccion.pesoColada) / Number(formDataProduccion.cavMolde))) * Number(formDataPlaneacion.cantidadProducir)) * (1 + (Number(formDataProduccion.porcentajeScrap) / 100));

    let materialTurno = (((Number(formDataProduccion.pesoColada) / Number(formDataProduccion.cavMolde)) + Number(formDataProduccion.pesoPiezas)) * Number(formDataProduccion.piezasxTurno)) * (1 + (Number(formDataProduccion.porcentajeScrap) / 100));

    let pigMB = (Number(formDataProduccion.aplicacionGxKG) * Number(kgMaterial)) / 1000;

    let bolsasCajasUtilizar = (Number(formDataPlaneacion.cantidadProducir) / Number(formDataProduccion.noPiezasxEmpaque));

    let piezasTurno1 = (((3600 / Number(formDataProduccion.tiempoCiclo1)) * Number(formDataProduccion.cavMolde)) * 12);

    let piezasTurno2 = (((3600 / Number(formDataProduccion.tiempoCiclo2)) * Number(formDataProduccion.cavMolde)) * 12);

    let piezasTurno3 = (((3600 / Number(formDataProduccion.tiempoCiclo3)) * Number(formDataProduccion.cavMolde)) * 12);

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDay() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaActual, setFechaActual] = useState(fecha);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nueva Orden de Producción
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
                                        Generalidades
                                    </h4>
                                </div>


                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Planeacion
                                        </Form.Label>
                                        <div className="flex items-center mb-1">
                                            <Form.Control
                                                type="text"
                                                placeholder="Orden de venta"
                                                name="ordenVenta"
                                                value={formDataPlaneacion.folioPlaneacion}
                                                disabled
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                title="Buscar entre las planeaciones"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarOV(
                                                        <BuscarPlaneacion
                                                            setFormData={setFormDataPlaneacion}
                                                            formData={formDataPlaneacion}
                                                            setShowModal={setShowModal}
                                                        />)
                                                }}
                                            />
                                        </div>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            No. Interno
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Número interno"
                                            name="NúmeroInterno"
                                            defaultValue={formDataProduccion.noInterno}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            No. Parte
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Número de parte"
                                            name="NúmeroParte"
                                            defaultValue={formDataProduccion.noParte}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Nombre del producto
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="nombre del producto"
                                            defaultValue={formDataPlaneacion.nombreProducto}
                                            name="nombreProducto"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cliente
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Cliente"
                                            name="cliente"
                                            defaultValue={formDataProduccion.nombreCliente}
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
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Orden de producción
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Orden de producción"
                                            name="ordenProducción"
                                            defaultValue={folioActual}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalNoParte">
                                        <Form.Label align="center">
                                            Fecha
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="fecha"
                                            name="fecha"
                                            value={fechaActual}
                                            onChange={e => setFechaActual(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            No. Parte
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero de parte"
                                            name="NúmeroParte"
                                            defaultValue={formDataProduccion.noParte}
                                            disabled
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            No. Cavidades
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Numero de cavidades"
                                            name="noCavidades"
                                            defaultValue={formDataProduccion.cavMolde}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Cantidad a producir
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Cantidad a producir"
                                            name="cantidadProducir"
                                            defaultValue={formDataPlaneacion.cantidadProducir}
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
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="maquina1"
                                                defaultValue={nombreMaquina1}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo1"
                                                defaultValue={formDataProduccion.tiempoCiclo1}
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
                                                defaultValue={formDataProduccion.noPiezasxEmpaque}
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
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="maquina2"
                                                defaultValue={nombreMaquina2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo2"
                                                defaultValue={formDataProduccion.tiempoCiclo2}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="pieza2"
                                                value={piezasTurno2.toFixed(2)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="bolsa2"
                                                defaultValue={formDataProduccion.noPiezasxEmpaque}
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
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="maquina3"
                                                defaultValue={nombreMaquina3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="ciclo3"
                                                defaultValue={formDataProduccion.tiempoCiclo3}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="pieza3"
                                                value={piezasTurno3.toFixed(2)}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                name="bolsa3"
                                                defaultValue={formDataProduccion.noPiezasxEmpaque}
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
                                            defaultValue={formDataProduccion.descripcionMP}
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
                                            defaultValue={formDataProduccion.porcentajeMolido}
                                            name="Molido"
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Peso de la pieza (Kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            defaultValue={formDataProduccion.pesoPiezas}
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
                                            defaultValue={formDataProduccion.pesoColada}
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
                                            defaultValue={formDataProduccion.descripcionBolsa}
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
                                            defaultValue={formDataProduccion.descripcionPigmento}
                                            name="Pigmento"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formHorizontalProducto">
                                        <Form.Label align="center">
                                            Aplicación (gr/kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            defaultValue={formDataProduccion.aplicacionGxKG}
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
                                            defaultValue={formDataProduccion.porcentajeScrap}
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
                                    <table className="responsive-tableRegistroVentas"
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
                                    </table>
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
                                    <table className="responsive-tableRegistroVentas"
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
                                    </table>
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

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar la planeación"
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
        ordenVenta: data.requerimiento.ov,
        folioPlaneacion: data.folio,
        producto: data.requerimiento.producto,
        nombreProducto: data.requerimiento.nombreProducto,
        cantidadProducir: data.requerimiento.totalProducir
    }
}

function initialPlaneacion() {
    return {
        ordenVenta: "",
        folioPlaneacion: "",
        producto: "",
        nombreProducto: "",
        cantidadProducir: "",
    }
}

function initialFormData() {
    return {
        producto: "",
        semana: "",
        fecha: "",
        notasImportantes: "",
        elaboro: "",
        observaciones: "",
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
        fecha: "",
        cantidadProducir: "",
        notasImportantes: "",
        elaboro: "",
        observaciones: "",
    }
}

function initialFormDataProduccion(data) {
    return {
        noInterno: data.noInterno,
        cliente: data.cliente,
        nombreCliente: data.nombreCliente,
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
        descripcionPigmento: data.pigmentoMasterBach.descripcion,
        aplicacionGxKG: data.pigmentoMasterBach.aplicacionGxKG,
        proveedor: data.pigmentoMasterBach.proveedor,
        tiempoCiclo: data.tiempoCiclo,
        noOperadores: data.noOperadores,
        piezasxHora: data.piezasxHora,
        piezasxTurno: data.piezasxTurno,
        descripcionBolsa: data.materialEmpaque.descripcionBolsa,
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
        cliente: "",
        nombreCliente: "",
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

export default ProduccionPlaneacion;
