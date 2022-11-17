import { useEffect, useMemo, useState } from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import AgregarResultado from "../AgregarResultado";
import AgregarRegistro from "../AgregarRegistro";
import { useHistory } from "react-router-dom";
import "./RegistroProduccion.scss";
import { map } from "lodash";
import { listarMatrizProductosActivos } from "../../../api/matrizProductos";
import { obtenerCliente } from "../../../api/clientes";
import { obtenerNumeroProduccion, obtenerItemProduccion, registraProduccion } from "../../../api/produccion";
import { toast } from "react-toastify";
import BuscarOV from "../BuscarOV";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

function RegistroProduccion(props) {
    const { setRefreshCheckLogin } = props;

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [listResultados, setListResultados] = useState([]);

    const [listRegistros, setListRegistros] = useState([]);

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
        enrutamiento.push("/Produccion")
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

        if (!formData.fecha) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerItemProduccion().then(response => {
                const { data } = response;
                const dataTemp = {
                    item: data.item,
                    folio: folioActual,
                    generalidades: {
                        ordenVenta: ordenVenta,
                        noInterno: producto.noIntermo,
                        noParte: producto.noParte,
                        producto: producto.descripcion,
                        cliente: producto.cliente,
                    },
                    planeacion: {
                        ordenProduccion: folioActual,
                        fecha: formData.fecha,
                        noParte: producto.noParte,
                        noCavidades: producto.cavMolde,
                        cantidadProducir: formData.cantidadProducir,
                        opcionesMaquinaria: {
                            1: {
                                numeroMaquina1: formData.numeroMaquina1,
                                maquina1: formData.maquina1,
                                ciclo1: formData.ciclo1,
                                pieza1: formData.pieza1,
                                bolsa1: formData.bolsa1,
                            },
                            2: {
                                numeroMaquina2: formData.numeroMaquina2,
                                maquina2: formData.maquina2,
                                ciclo2: formData.ciclo2,
                                pieza2: formData.pieza2,
                                bolsa2: formData.bolsa2,
                            },
                            3: {
                                numeroMaquina3: formData.numeroMaquina3,
                                maquina3: formData.maquina3,
                                ciclo3: formData.ciclo3,
                                pieza3: formData.pieza3,
                                bolsa3: formData.bolsa3,
                            },
                        },
                    },
                    bom: {
                        material: producto.material,
                        molido: producto.molido,
                        pesoPieza: producto.pesoPieza,
                        pesoColada: producto.pesoColada,
                        kgMaterial: formData.kgMaterial,
                        pigmento: producto.pigmentoMb,
                        aplicacion: producto.aplicacionGxKG,
                        pigMb: formData.kgPIGMB,
                        materialxTurno: formData.materialTurno,
                        merma: formData.merma,
                        empaque: producto.empaque,
                        bolsasCajasUtilizar: producto.bolsasCajasUtilizar,
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

                    // Actualizacion del tracking
                    LogTrackingActualizacion(ordenVenta, "En produccion", "6")
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

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Para eliminar productos del listado
    const removeItemResultado = (resultado) => {
        let newArray = listResultados;
        newArray.splice(newArray.findIndex(a => a.ID === resultado.ID), 1);
        setListResultados([...newArray]);
    }

    // Para eliminar productos del listado
    const removeItemRegistro = (registro) => {
        let newArray = listRegistros;
        newArray.splice(newArray.findIndex(a => a.ID === registro.ID), 1);
        setListRegistros([...newArray]);
    }

    const [ordenVenta, setOrdenVenta] = useState("");

    const buscarOV = (content) => {
        setTitulosModal("Buscar orden de venta");
        setContentModal(content);
        setShowModal(true);
    }

    return (
        <>
            <LayoutPrincipal className="RegistroProduccion" paginaSeleccionada="Produccion" setRefreshCheckLogin={setRefreshCheckLogin}>
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
                                                Orden Venta
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Orden de venta"
                                                name="ordenVenta"
                                                value={ordenVenta}
                                                disabled
                                            />
                                        </Form.Group>

                                        <Col sm="5">
                                            <Button
                                                variant="success"
                                                className="agregar"
                                                onClick={() => {
                                                    buscarOV(
                                                        <BuscarOV
                                                            setOrdenVenta={setOrdenVenta}
                                                            setShowModal={setShowModal}
                                                        />)
                                                }}
                                            >
                                                Orden venta
                                            </Button>
                                        </Col>
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
                                                value={producto.noIntermo}
                                                disabled
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
                                                value={producto.noParte}
                                                disabled
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Nombre del producto
                                            </Form.Label>
                                            <Form.Control
                                                as="select"
                                                onChange={(e) => {
                                                    handleProducto(e.target.value)
                                                }}
                                                defaultValue={formData.producto}
                                                name="producto"
                                            >
                                                <option>Elige</option>
                                                {map(listProductosActivos, (producto, index) => (
                                                    <option
                                                        key={index}
                                                        value={producto.id + "/" + producto.noInterno + "/" + producto.noParte + "/" + producto.descripcion + "/" + producto.cliente + "/" + producto.datosMolde.cavMolde + "/" + producto.materiaPrima.descripcion + "/" + producto.datosPieza.porcentajeMolido + "/" + producto.datosPieza.pesoPiezas + "/" + producto.datosPieza.pesoColada + "/" + producto.pigmentoMasterBach.descripcion + "/" + producto.pigmentoMasterBach.aplicacionGxKG + "/" + producto.materialEmpaque.descripcionBolsa + "/" + producto.materialEmpaque.noPiezasxEmpaque}
                                                    >
                                                        {producto.descripcion}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Cliente
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Cliente"
                                                name="Cliente"
                                                value={formData.producto == "" ? "" : nombreCliente}
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
                                                defaultValue={formData.fecha}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                No. Parte
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Numero de parte"
                                                name="numeroParte"
                                                value={producto.noParte}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                No. Cavidades
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Numero de cavidades"
                                                name="numeroCavidades"
                                                defaultValue={producto.cavMolde}
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
                                                defaultValue={formData.cantidadProducir}
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
                                                    defaultValue={formData.numeroMaquina1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="maquina1"
                                                    defaultValue={formData.maquina1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="ciclo1"
                                                    defaultValue={formData.ciclo1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="pieza1"
                                                    defaultValue={formData.pieza1}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="bolsa1"
                                                    defaultValue={formData.bolsa1}
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
                                                    defaultValue={formData.numeroMaquina2}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="maquina2"
                                                    defaultValue={formData.maquina2}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="ciclo2"
                                                    defaultValue={formData.ciclo2}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="pieza2"
                                                    defaultValue={formData.pieza2}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="bolsa2"
                                                    defaultValue={formData.bolsa2}
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
                                                    defaultValue={formData.numeroMaquina3}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="maquina3"
                                                    defaultValue={formData.maquina3}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="ciclo3"
                                                    defaultValue={formData.ciclo3}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="pieza3"
                                                    defaultValue={formData.pieza3}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Control
                                                    type="text"
                                                    name="bolsa3"
                                                    defaultValue={formData.bolsa3}
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
                                                placeholder="Material"
                                                name="Material"
                                                value={producto.material}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalNoParte">
                                            <Form.Label align="center">
                                                Molido
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Molido"
                                                name="Molido"
                                                value={producto.molido}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Peso de la pieza (Kg)
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Peso de la pieza"
                                                name="pesoPieza"
                                                value={producto.pesoPieza}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Peso colada (Kg)
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Peso colada"
                                                name="pesoColada"
                                                value={producto.pesoColada}
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
                                                defaultValue={formData.kgMaterial}
                                            />
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Pigmento/MB
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Pigmento/MB"
                                                name="Pigmento"
                                                value={producto.pigmentoMb}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Aplicación (gr/kg)
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Apliación (gr/kg)"
                                                name="aplicacion"
                                                value={producto.aplicacionGxKG}
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
                                                defaultValue={formData.kgPIGMB}
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
                                                defaultValue={formData.materialTurno}
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
                                                defaultValue={formData.merma}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Empaque
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Empaque"
                                                name="empaque"
                                                value={producto.empaque}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formHorizontalProducto">
                                            <Form.Label align="center">
                                                Bolsas o cajas a utilizar
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Bolsas o cajas a utilizar"
                                                name="bolsasCajasUtilizar"
                                                value={producto.bolsasCajasUtilizar}
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
        producto: "",
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
        fecha: "",
        cantidadProducir: "",
        notasImportantes: "",
        elaboro: "",
        observaciones: ""
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

export default RegistroProduccion;
