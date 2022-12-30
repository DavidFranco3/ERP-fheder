import { useState, useEffect } from 'react';
import {listarMatrizProductosActivos} from "../../../api/matrizProductos";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {map} from "lodash";
import {obtenerFolioActualAlmacenPT, registraAlmacenPT} from "../../../api/almacenPT";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import {getSucursal} from "../../../api/auth";

function RegistroExistenciasAlmacenPt(props) {
    const { setShowModal, location, history } = props;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Almacenar el listado de materias primas
    const [listProductos, setListProductos] = useState(null);

    useEffect(() => {
        try {
            listarMatrizProductosActivos(getSucursal()).then(response => {
                const { data } = response;
                //console.log(data)
                if(!listProductos &&data) {
                    setListProductos(formatModelMatrizProductos(data));
                } else {
                    const datosProductos = formatModelMatrizProductos(data);
                    setListProductos(datosProductos);
                }
            }).catch(e => {
                //console.log(e)
            })
        } catch (e) {
            //console.log(e)
        }
    }, []);

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

        const onSubmit = (e) => {
        e.preventDefault()
        // console.log(formData)

        if(!formData.materiaPrima || !formData.descripcion || !formData.um || !formData.status){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                obtenerFolioActualAlmacenPT().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noAlmacen } = data;

                    const temp = formData.materiaPrima.split("/")
                    // console.log(temp)

                    const dataTemp = {
                        folioAlmacen: noAlmacen,
                        idProducto: temp[0],
                        folioMP: temp[1],
                        nombre: temp[2],
                        descripcion: formData.descripcion,
                        sucursal: getSucursal(),
                        um: formData.um,
                        existenciasOV: "0",
                        existenciasStock: "0",
                        existenciasTotales: "0",
                        estado: formData.status
                    }

                    // console.log(dataTemp)
                    setLoading(false)
                    registraAlmacenPT(dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje)
                        LogsInformativos("Se ha registrado la materia en el almacen de MP " + temp[2], dataTemp)
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
    }

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                        <Form.Label>
                            Selecciona el producto
                        </Form.Label>
                        <Form.Control as="select"
                                      defaultValue={formData.materiaPrima}
                                      name="materiaPrima"
                        >
                            <option>Elige una opción</option>
                            {map(listProductos, (producto, index) => (
                                <option key={index} value={producto?.id + "/" +producto?.noInterno + "/" + producto?.descripcion}>{ producto?.noInterno + " -- " + producto?.descripcion}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalDescripcion">
                        <Form.Label>
                            Descripción
                        </Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formData.descripcion}
                            />
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalUnidadMedida" className="unidadMedidaMP">
                        <Form.Label>
                            Unidad de medida
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="um"
                                defaultValue={formData.um}
                            >
                                <option >Elige....</option>
                                <option value="KG">KG</option>
                                <option value="Litros">Litros</option>
                                <option value="Piezas">Pieza</option>
                                <option value="Otros">Otros</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalStatus" className="status">
                        <Form.Label>
                            Status
                        </Form.Label>
                        <Col>
                            <Form.Control
                                as="select"
                                name="status"
                                defaultValue={formData.status}
                            >
                                <option >Elige....</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </Form.Control>
                        </Col>
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
            </div>
        </>
    );
}

function initialFormData(){
    return {
        descripcion: "",
        um: "",
        status: ""
    }
}

function formatModelMatrizProductos(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            noInterno: data. noInterno,
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

export default RegistroExistenciasAlmacenPt;
