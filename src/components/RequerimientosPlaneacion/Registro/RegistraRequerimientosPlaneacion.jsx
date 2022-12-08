import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import BuscarOV from "../../../page/BuscarOV";
import { useHistory } from "react-router-dom";
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
import { obtenerMaquina } from "../../../api/maquinas";

function RegistraRequerimientosPlaneacion(props) {
    const { setRefreshCheckLogin } = props;

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [formDataPlaneacion, setFormDataPlaneacion] = useState(initialFormDataPlaneacionInitial());

    // Para almacenar la cantidad en el almacen de materia prima
    const [cantidadAlmacen, setCantidadAlmacen] = useState("0");

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
                setCantidadAlmacen(data.cantidadExistencia)
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

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    console.log(producto)

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

    const [item, setItem] = useState("");

    useEffect(() => {
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
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.semana) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            const temp = formData.materiaPrima.split("/")

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerNumeroRequerimiento().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: item,
                    folio: data.noRequerimiento,
                    requerimiento: {
                        semana: formData.semana,
                        producto: formDataPlaneacion.id,
                        nombreProducto: formDataPlaneacion.descripcion,
                        um: unidadMedida,
                        ov: ordenVentaPrincipal,
                        almacenProductoTerminado: cantidad,
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
                        molido: formDataPlaneacion.porcentajeMolido,
                        pesoPieza: formDataPlaneacion.pesoPiezas,
                        pesoColada: formDataPlaneacion.pesoColada,
                        kgMaterial: kgMaterial,
                        pigmento: formDataPlaneacion.descripcionPigmento,
                        aplicacion: formDataPlaneacion.aplicacionGxKG,
                        pigMb: pigMB,
                        materialxTurno: materialTurno,
                        merma: formDataPlaneacion.porcentajeScrap,
                        empaque: formDataPlaneacion.descripcionBolsa,
                        bolsasCajasUtilizar: bolsasCajasUtilizar
                    },
                    datosRequisicion: {
                        kgMaterial: kgMaterial,
                        almacenMP: cantidadAlmacen,
                        cantidadSugerida: Number(kgMaterial) - Number(cantidadAlmacen),
                        cantidadPedir: formData.cantidadMP
                    },
                    estado: "true"
                }
                // console.log(dataTemp)
                // Registro de la gestión de la planeación -- LogRegistroPlaneacion(ordenVenta, productos
                // 
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
        setCantidadPedir(Number(kgMaterial) - Number(cantidadAlmacen))
    }, [formData.materiaPrima, formDataPlaneacion.idMaterial, totalProducir]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataPlaneacion({ ...formDataPlaneacion, [e.target.name]: e.target.value })
    }

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
                                                value={ordenVenta}
                                                disabled
                                            />
                                            <FontAwesomeIcon
                                                className="cursor-pointer py-2 -ml-6"
                                                icon={faSearch}
                                                onClick={() => {
                                                    buscarOV(
                                                        <BuscarOV
                                                            setOrdenVenta={setOrdenVenta}
                                                            setOrdenVentaPrincipal={setOrdenVentaPrincipal}
                                                            setClienteOV={setClienteOV}
                                                            setCantidadRequeridaOV={setCantidadRequeridaOV}
                                                            setProducto={setProducto}
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
                                            value={cantidadRequeridaOV}
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
                                    <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                        <Form.Label align="center">
                                            Semana
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            placeholder="Semana"
                                            name="semana"
                                            defaultValue={formData.semana}
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridMateriaPrima" className="producto">
                                        <Form.Label>
                                            Producto
                                        </Form.Label>
                                        { producto.length == 1 ? (
                                            <>
                                            <Form.Control 
                                            type="text"
                                                defaultValue={formDataPlaneacion.descripcion}
                                                name="materiaPrima"
                                            />
                                            </>
                                        ):(
                                            <>
                                            <Form.Control as="select"
                                                onChange={(e) => {
                                                    handleMateriaPrima(e.target.value)
                                                }}
                                                defaultValue={formData.materiaPrima}
                                                name="materiaPrima"
                                            >
                                                <option>Elige una opción</option>
                                                {map(producto, (productos, index) => (
                                                    <option
                                                        key={index}
                                                        value={productos?.ID + "/" + productos?.item }
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
                                            defaultValue={unidadMedida}
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
                                            defaultValue={cantidad}
                                            placeholder="Almacen producto terminado"
                                            name="almacenPT"
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
                                            <th scope="col">Eliminar</th>
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
                                                <td data-title="Eliminar">
                                                    <div
                                                        className="eliminarProductoListado"
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
                                                defaultValue={formDataPlaneacion.tiempoCiclo2}
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
                                                defaultValue={formDataPlaneacion.noPiezasxEmpaque}
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
                                                defaultValue={formDataPlaneacion.tiempoCiclo3}
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
                            </Container>
                        </div>

                        <br />

                        <div className="datosBOM">
                            <Container fluid>
                                <br />
                                <div className="tituloSeccion">
                                    <h4>
                                        Datos de la requisición
                                    </h4>
                                </div>

                                <Row className="mb-3">
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
                                            Almacen MP
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Kg de material"
                                            name="CantidadMP"
                                            value={Number(cantidadAlmacen)}
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
                                            value={cantidadPedir}
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
                                            name="cantidadMP"
                                            defaulValue={cantidadPedir}
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
        </>
    );
}

function initialFormDataPlaneacion(data) {
    return {
        id: data._id,
        noInterno: data.noInterno,
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
        descripcionPigmento: data.pigmentoMasterBach.descripcion,
        aplicacionGxKG: data.pigmentoMasterBach.aplicacionGxKG,
        proveedor: data.pigmentoMasterBach.proveedor,
        nombreProveedor: data.pigmentoMasterBach.nombreProveedor,
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

export default RegistraRequerimientosPlaneacion;
