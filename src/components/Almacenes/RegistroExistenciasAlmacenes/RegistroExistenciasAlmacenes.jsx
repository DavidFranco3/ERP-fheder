import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { map } from "lodash";
import "./RegistroExistenciasAlmacenes.scss"
import { toast } from "react-toastify";
import { obtenerItemAlmacen, obtenerFolioActualAlmacenes, registroInicialAlmacenes } from "../../../api/almacenes";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { set } from 'lodash';
import { getAlmacen, getSucursal } from "../../../api/auth";
import BuscarInsumos from '../../../page/BuscarInsumos';
import BuscarMaterial from '../../../page/BuscarMaterial';
import BuscarProducto from '../../../page/BuscarProducto';
import BasicModal from "../../Modal/BasicModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faSearch } from "@fortawesome/free-solid-svg-icons";

function RegistroExistenciasAlmacenes(props) {
    const { setShowModal, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para almacenar los datos del formulario
    const [formDataBusqueda, setFormDataBusqueda] = useState(initialFormDataBusqueda());

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Para almacenar la materia prima
    const [materiaPrima, setMateriaPrima] = useState("");

    // Para almacenar la unidad de medida
    const [unidadMedida, setUnidadMedida] = useState("");

    // Para almacenar el lote 
    const [lote, setLote] = useState("");

    // Para almacenar el lote 
    const [ordenVenta, setOrdenVenta] = useState("");

    // Para hacer uso del modal
    const [showModal2, setShowModal2] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    useEffect(() => {
        try {

            obtenerDatosInspeccion(formData.referencia).then(response => {
                const { data } = response;
                const { nombre, unidadMedida, lote, ordenVenta } = data;
                setMateriaPrima(nombre);
                setUnidadMedida(unidadMedida);
                setLote(lote);
                setOrdenVenta(ordenVenta)

            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [formData.referencia]);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar el folio actual
    const [itemActual, setItemActual] = useState("");

    useEffect(() => {
        try {
            obtenerItemAlmacen().then(response => {
                const { data } = response;
                // console.log(data)
                const { item } = data;
                setItemActual(item)
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    useEffect(() => {
        try {
            listarMateriaPrima(getSucursal()).then(response => {
                const { data } = response;
                //console.log(data)
                if (!listMateriasPrimas && data) {
                    setListMateriasPrimas(formatModelMateriasPrimas(data));
                } else {
                    const datosProductos = formatModelMateriasPrimas(data);
                    setListMateriasPrimas(datosProductos);
                }
            }).catch(e => {
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()
        // console.log(formData)

        if (!formDataBusqueda.folioArticulo) {
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                obtenerFolioActualAlmacenes().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noAlmacen } = data;

                    // console.log(temp)

                    const dataTemp = {
                        item: itemActual,
                        folio: noAlmacen,
                        idArticulo: formDataBusqueda.idArticulo,
                        folioArticulo: formDataBusqueda.folioArticulo,
                        nombreArticulo: formDataBusqueda.nombreArticulo,
                        tipo: formData.tipo,
                        sucursal: getSucursal(),
                        almacen: getAlmacen(),
                        um: formDataBusqueda.um,
                        cantidadExistencia: "0",
                        estado: "true"
                    }

                    // console.log(dataTemp)
                    registroInicialAlmacenes(dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje);
                        LogsInformativos("Se ha registrado el articulo " + formData.nombreArticulo, dataTemp)
                        history.push({
                            search: queryString.stringify(""),
                        });
                        setShowModal(false)
                    }).catch(e => {
                        console.log(e)
                    })
                }).catch(e => {
                    console.log(e)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormDataBusqueda({ ...formDataBusqueda, [e.target.name]: e.target.value })
    }

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

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
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
                                <option value="Materias primas">Materias primas</option>
                                <option value="Insumos">Insumos</option>
                                <option value="Productos">Productos</option>
                            </Form.Control>
                        </Form.Group>

                        {
                            formData.tipo === "Materias primas" &&
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
                            formData.tipo === "Insumos" &&
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
                                                    placeholder="Buscar insumo"
                                                    name="nombreArticulo"
                                                />
                                                <FontAwesomeIcon
                                                    className="cursor-pointer py-2 -ml-6"
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        buscarInsumo(
                                                            <BuscarInsumos
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

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="um"
                                placeholder='UM'
                                value={formDataBusqueda.um}
                                disabled
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group as={Row} className="botones">
                        <Col>
                            <Button
                                type="submit"
                                title="Guardar información del formulario"
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
                                    cancelarRegistro()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>

                <BasicModal show={showModal2} setShow={setShowModal2} title={titulosModal}>
                    {contentModal}
                </BasicModal>
            </div>
        </>
    );
}

function initialFormData() {
    return {
        tipo: ""
    }
}

function initialFormDataBusqueda() {
    return {
        idArticulo: "",
        folioArticulo: "",
        nombreArticulo: "",
        um: "",
    }
}

function formatModelMateriasPrimas(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            descripcion: data.descripcion,
            um: data.um,
            tiempoespera: data.tiempoespera,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistroExistenciasAlmacenes;
