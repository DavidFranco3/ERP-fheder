import { useState, useEffect } from 'react';
import "./ModificarAlmacenes.scss"
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map, size, values } from "lodash";
import { actualizaExistenciasAlmacenes } from "../../../api/almacenes";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { listarProduccion } from "../../../api/produccion";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";
import { obtenerDatosProduccion } from "../../../api/produccion";
import { LogTrackingActualizacion } from "../../Tracking/Gestion/GestionTracking";
import { getSucursal, getAlmacen } from '../../../api/auth';
import BuscarEmpaque from '../../../page/BuscarArticuloAlmacen';
import BuscarInsumos from '../../../page/BuscarInsumos';
import BuscarMaterial from '../../../page/BuscarMaterial';
import BuscarProducto from '../../../page/BuscarProducto';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../Modal/BasicModal";
import { listarUM } from "../../../api/unidadesMedida";

function ModificarAlmacenes(props) {
    const { datos, setShowModal, location, history } = props;

    const { id } = datos;

    // Para hacer uso del modal
    const [showModal2, setShowModal2] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

        // Para la eliminacion fisica de usuarios
        const buscarArticulo = (content) => {
            setTitulosModal("Buscar articulo");
            setContentModal(content);
            setShowModal2(true);
        }

    // Define el motivo de la salida
    const [motivoSalida, setMotivoSalida] = useState("");

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData(datos));

    // Para almacenar los datos del formulario
    const [formDataBusqueda, setFormDataBusqueda] = useState(initialFormDataBusqueda(datos));

    // Para la eliminacion fisica de usuarios
    const buscarMaterial = (content) => {
        setTitulosModal("Buscar material");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarInsumo = (content) => {
        setTitulosModal("Buscar insumo");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para la eliminacion fisica de usuarios
    const buscarProducto = (content) => {
        setTitulosModal("Buscar producto");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para almacenar el listado de proveedores
    const [listUM, setListUM] = useState(null);

    useEffect(() => {
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
    }, []);

    // Para almacenar el listado de productos activos
    const [listProduccion, setListProduccion] = useState(null);

    // Para traer el listado de productos activos
    useEffect(() => {
        try {
            listarProduccion(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)

                if (!listProduccion && data) {
                    setListProduccion(formatModelProduccion(data));
                } else {
                    const datosProduccion = formatModelProduccion(data);
                    setListProduccion(datosProduccion);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Para cerrar el modal
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar la fecha actual
    const [fechaActual, setFechaActual] = useState(new Date);

    const onSubmit = (e) => {
        e.preventDefault()
        // console.log(formData)

        if (!formDataBusqueda.folioArticulo) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {

                    // console.log(temp)

                    const dataTemp = {
                        idArticulo: formDataBusqueda.idArticulo,
                        folioArticulo: formDataBusqueda.folioArticulo,
                        nombreArticulo: formDataBusqueda.nombreArticulo,
                        tipo: formData.tipoOperacion,
                        sucursal: getSucursal(),
                        almacen: getAlmacen(),
                        fecha: formData.fecha,
                        descripcion: formData.descripcion,
                        um: formDataBusqueda.um,
                        cantidadExistencia: formData.cantidad,
                        estado: "true"
                    }

                    // console.log(dataTemp)
                    actualizaExistenciasAlmacenes(id, dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje);
                        LogsInformativos("Se ha modificado el articulo " + formData.nombreArticulo, dataTemp)
                        history.push({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }).catch(e => {
                        console.log(e)
                    })
            } catch (e) {
                console.log(e)
            }
        }
    }

    // Para almacenar la informacion del formulario
    const [formDataArticulo, setFormDataArticulo] = useState(initialFormDataArticulo(datos));
    console.log(formDataArticulo)

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataArticulo({ ...formDataArticulo, [e.target.name]: e.target.value })
        setFormDataBusqueda({ ...formDataBusqueda, [e.target.name]: e.target.value })
    }

    // Para almacenar el lote 
    const [lote, setLote] = useState("");

    // Para almacenar el lote 
    const [ordenVenta, setOrdenVenta] = useState("");

    useEffect(() => {
        try {

            if (formData.tipoOperacion == "Entrada") {
                obtenerDatosInspeccion(formData.referencia).then(response => {
                    const { data } = response;
                    const { lote, ordenVenta } = data;
                    setLote(lote);
                    setOrdenVenta(ordenVenta)
                }).catch(e => {
                    console.log(e)
                })
            } else if (formData.tipoOperacion == "Salida") {
                obtenerDatosProduccion(formData.referencia).then(response => {
                    const { data } = response;
                    const { generalidades } = data;
                    setOrdenVenta(generalidades.ordenVenta)
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [formData.referencia, formData.tipoOperacion]);

    const temp = formData.articulo.split("/")

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Fecha
                            </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Escribe la fecha"
                                name="fecha"
                                defaultValue={formData.fecha}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalNoInterno">
                            <Form.Label align="center">
                                Que es lo que se registra
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                defaultValue={formData.tipo}
                            >
                                <option >Elige....</option>
                                <option value="Materiales" selected={formData.tipo==="Materiales"}>Materiales</option>
                                <option value="Productos" selected={formData.tipo==="Productos"}>Productos</option>
                            </Form.Control>
                        </Form.Group>

                        {
                            formData.tipo === "Materiales" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                        <Form.Label>
                                            Busqueda
                                        </Form.Label>
                                        <Col>
                                            <div className="flex items-center mb-1">
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={formDataBusqueda.nombreArticulo}
                                                    placeholder="Buscar materia prima"
                                                    name="nombreArticulo"
                                                />
                                                <FontAwesomeIcon
                                                    className="cursor-pointer py-2 -ml-6"
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        buscarMaterial(
                                                            <BuscarMaterial
                                                                formData={formDataBusqueda}
                                                                setFormData={setFormDataBusqueda}
                                                                setShowModal={setShowModal2}
                                                            />)
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                        }

                        {
                            formData.tipo === "Productos" &&
                            (
                                <>
                                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                        <Form.Label>
                                            Busqueda
                                        </Form.Label>
                                        <Col>
                                            <div className="flex items-center mb-1">
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={formDataBusqueda.nombreArticulo}
                                                    placeholder="Buscar producto"
                                                    name="nombreArticulo"
                                                />
                                                <FontAwesomeIcon
                                                    className="cursor-pointer py-2 -ml-6"
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        buscarProducto(
                                                            <BuscarProducto
                                                                formData={formDataBusqueda}
                                                                setFormData={setFormDataBusqueda}
                                                                setShowModal={setShowModal2}
                                                            />)
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                </>
                            )
                        }
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="um"
                                defaultValue={formDataBusqueda.um}
                            >
                                <option>Elige una opción</option>
                                {map(listUM, (um, index) => (
                                    <option key={index} value={um?.nombre} selected={formDataBusqueda.um == um?.nombre}>{um?.nombre}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3 motivoSalida">
                            <Form.Label>
                                Tipo operacion
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                    value="Entrada"
                                    type="radio"
                                    label="Entrada"
                                    name="tipoOperacion"
                                    id="tipoOperacion"
                                    defaultValue={formData.tipoOperacion}
                                    checked={formData.tipoOperacion==="Entrada"}
                                />
                            </Col>
                            <Col sm={10}>
                                <Form.Check
                                    value="Salida"
                                    type="radio"
                                    label="Salida"
                                    name="tipoOperacion"
                                    id="tipoOperacion"
                                    defaultValue={formData.tipoOperacion}
                                    checked={formData.tipoOperacion==="Salida"}
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                {formData.tipoOperacion == "Entrada" ? "Cantidad entrada" : formData.tipoOperacion == "Salida" ? "Cantidad salida" : "Cantidad"}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={formData.tipoOperacion == "Entrada" ? "escribe la cantidad de entrada" : formData.tipoOperacion == "Salida" ? "Escribe la cantidad de salida" : "Escribe la cantidad"}
                                name="cantidad"
                                defaultValue={formData.cantidad}

                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalDescripcion" className="descripcionMP">
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    as="textarea" rows={2}
                                    placeholder={formData.tipo === "Salida" ? "Escribe motivo de la salida" : "Escribe el motivo de la entrada"}
                                    name="descripcion"
                                    defaultValue={formData.descripcion}
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Guardar información del movimiento"
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
                                    cancelarRegistro()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                    <BasicModal show={showModal2} setShow={setShowModal} title={titulosModal}>
                        {contentModal}
                    </BasicModal>
                </Form>
            </div>
        </>
    );
}

function initialFormData(data) {
    return {
        articulo: data.nombreArticulo,
        tipo: data.tipo,
        descripcion: data.descripcion,
        referencia: "",
        tipo: data.tipoArticulo,
        cantidad: data.cantidadExistencia,
        fecha: data.fecha,
        referencia: "",
        tipoOperacion: data.tipo,
        referenciaOP: "",
        lote: "",
        um: data.um,
    }
}

function initialFormDataArticulo(data) {
    return {
        folioArticulo: data.folioArticulo,
        nombreArticulo: data.nombreArticulo,
        um: data.um,
        cantidadExistencia: data.cantidadExistencia
    }
}

function initialFormDataBusqueda(data) {
    return {
        idArticulo: data.idArticulo,
        folioArticulo: data.folioArticulo,
        nombreArticulo: data.nombreArticulo,
        um: data.um,
    }
}

function formatModelAlmacenes(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            idArticulo: data.idArticulo,
            folioArticulo: data.folioArticulo,
            nombreArticulo: data.nombreArticulo,
            sucursal: data.sucursal,
            almacen: data.almacen,
            um: data.um,
            movimientos: data.movimientos,
            cantidadExistencia: data.cantidadExistencia,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelProduccion(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            generalidades: data.generalidades,
            planeacion: data.planeacion,
            bom: data.bom,
            resultados: data.resultados,
            materiaPrima: data.materiaPrima,
            observaciones: data.observaciones,
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

export default ModificarAlmacenes;
