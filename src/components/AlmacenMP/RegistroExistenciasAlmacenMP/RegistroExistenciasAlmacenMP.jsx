import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { listarMateriaPrima } from "../../../api/materiaPrima";
import { map } from "lodash";
import "./RegistroExistenciasAlmacenMP.scss"
import { toast } from "react-toastify";
import { obtenerFolioActualAlmacenMP, registroInicialAlmacenMP, obtenerItem } from "../../../api/almacenMP";
import { obtenerDatosInspeccion } from "../../../api/inspeccionMaterial";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { set } from 'lodash';

function RegistroExistenciasAlmacenMp(props) {
    const { setShowModal, location, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

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
            obtenerItem().then(response => {
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

    const onSubmit = (e) => {
        e.preventDefault()
        // console.log(formData)

        if(formData.referencia.length < parseInt(4)){
            toast.warning("Completa el formulario")
        } else {
            setLoading(true)
            try {
                obtenerFolioActualAlmacenMP().then(response => {
                    const { data } = response;
                    // console.log(data)
                    const { noAlmacen } = data;

                    //const temp = formData.materiaPrima.split("/")
                    // console.log(temp)

                    const dataTemp = {
                        item: itemActual,
                        folioAlmacen: noAlmacen,
                        referencia: formData.referencia,
                        ordenVenta: ordenVenta,
                        nombreMP: materiaPrima,
                        um: unidadMedida,
                        lote: lote,
                        cantidadExistencia: "0",
                        estado: "true"
                    }

                    // console.log(dataTemp)
                    setLoading(false)
                    registroInicialAlmacenMP(dataTemp).then(response => {
                        const { data } = response;
                        const { mensaje, datos } = data;
                        toast.success(mensaje)
                        setLoading(false)
                        LogsInformativos("Se ha registrado la materia en el almacen de MP", datos)
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
                        <Form.Group as={Col} controlId="formHorizontalDescripcion">
                            <Form.Label>
                                Referencia
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la referencia"
                                name="referencia"
                                defaultValue={formData.referencia}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Materia prima
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la materia prima"
                                name="materiaPrima"
                                value={formData.referencia.length < parseInt(4) ? "" : materiaPrima}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                U.M
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe la unidad de medida"
                                name="unidadMedida"
                                value={formData.referencia.length < parseInt(4) ? "" : unidadMedida}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                            <Form.Label>
                                Lote
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Escribe el lote"
                                name="lote"
                                value={formData.referencia.length < parseInt(4) ? "" : lote}
                                disabled
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
        fecha: "",
        referencia: ""
    }
}

export default RegistroExistenciasAlmacenMp;
