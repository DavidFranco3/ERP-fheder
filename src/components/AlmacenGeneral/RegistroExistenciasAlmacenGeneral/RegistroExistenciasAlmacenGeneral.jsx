import { useState, useEffect } from 'react';
import { listarInsumo } from "../../../api/insumos";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { map, size, values } from "lodash";
import { toast } from "react-toastify";
import { obtenerFolioActualAlmacenGeneral, registraAlmacenGeneral } from "../../../api/almacenGeneral";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";

function RegistroExistenciasAlmacenGeneral(props) {
    const { setShowModal, location, history } = props;

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    // Inicia recuperacion del folio actual de la existencia en almacén general
    const [folioActualAG, setFolioActualAG] = useState("");

    useEffect(() => {
        try {
            obtenerFolioActualAlmacenGeneral().then(response => {
                const { data } = response
                // console.log(data)
                const { folio } = data;
                setFolioActualAG(folio)
            }).catch(e => {
                // console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    // Almacenar el listado de materias primas
    const [listInsumos, setListInsumos] = useState(null);

    useEffect(() => {
        try {
            listarInsumo().then(response => {
                const { data } = response;
                //console.log(data)
                if (!listInsumos && data) {
                    setListInsumos(formatModelInsumos(data));
                } else {
                    const datosInsumos = formatModelInsumos(data);
                    setListInsumos(datosInsumos);
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

        if (!formData.nombre || !formData.descripcion) {
            toast.warning("Completa el formulario")
        } else {
            // console.log(formData)
            setLoading(true)

            const temp = formData.nombre.split("/")

            const dataTemp = {
                folioAlmacen: folioActualAG,
                idInsumo: temp[0],
                folioInsumo: temp[1],
                nombre: temp[2],
                descripcion: formData.descripcion,
                um: temp[3],
                tipo: formData.tipo,
                existenciasOV: "0",
                existenciasStock: "0",
                existenciasTotales: "0",
                estado: "activo"
            }
            try {
                registraAlmacenGeneral(dataTemp).then(response => {
                    const { data } = response;
                    const { mensaje, datos } = data;
                    toast.success(mensaje)
                    setLoading(false)
                    LogsInformativos("Se ha registrado un articulo en el almacen general", datos)
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

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const temp = formData.nombre.split("/")

    return (
        <>
            <div className="contenidoFormularioPrincipal">
                <Form onChange={onChange} onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFolioAG">
                            <Form.Label>
                                Folio
                            </Form.Label>
                            <Form.Control
                                type="text"
                                nombre="folio"
                                defaultValue={folioActualAG}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>
                                Nombre
                            </Form.Label>
                            <Form.Control
                                as="select"
                                defaultValue={formData.nombre}
                                name="nombre"
                            >
                                <option>Elige una opción</option>
                                {map(listInsumos, (insumo, index) => (
                                    <option key={index} value={insumo?.id + "/" + insumo?.folio + "/" + insumo?.descripcion +"/"+ insumo?.um}>{insumo?.folio + " -- " + insumo?.descripcion}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formHorizontalUnidadMedida" className="unidadMedidaMP">
                            <Form.Label>
                                Unidad de medida
                            </Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name="um"
                                    value={temp[3]}
                                    disabled
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formHorizontalDescripcion" className="descripcionMP">
                            <Form.Label>
                                Descripción
                            </Form.Label>
                            <Form.Control
                                as="textarea" rows={2}
                                placeholder="Escribe la descripcion"
                                name="descripcion"
                                defaultValue={formData.descripcion}
                            />
                        </Form.Group>
                    </Row>

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

function initialFormData() {
    return {
        nombre: "",
        descripcion: "",
        um: "",
        tipo: ""
    }
}

function formatModelInsumos(data) {
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            descripcion: data.descripcion,
            precio: data.precio,
            um: data.um,
            proveedor: data.proveedor,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistroExistenciasAlmacenGeneral;
