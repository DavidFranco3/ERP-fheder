import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory, useParams } from "react-router-dom";
import "./ModificaReporteProduccion.scss";
import NuevoRegistro from "../NuevoRegistro";
import { registraReporteProducción, obtenerNumeroReporteProduccion, obtenerReporteProduccion, actualizaReporteProduccion } from "../../../api/reporteProduccion";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { map } from "lodash";

function RegistroReporteProduccion(props) {
    const { setRefreshCheckLogin } = props;

    const params = useParams();
    const { id } = params

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [listRegistros, setListRegistros] = useState([]);

    useEffect(() => {
        //
        obtenerReporteProduccion(id).then(response => {
            const { data } = response;
            //console.log(data)
            const { supervisor, turno, asistencias, faltas, fecha, registros, eficienciaGeneralMaquinas, observacionesTurno } = data;
            const dataTemp = {
                supervisor: supervisor,
                turno: turno,
                asistencias: asistencias,
                faltas: faltas,
                fecha: fecha,
                eficienciaGeneralMaquinas: eficienciaGeneralMaquinas,
                observacionesTurno: observacionesTurno
            }
            setFormData(valoresAlmacenados(dataTemp))
            setListRegistros(registros)
            // setFechaCreacion(fechaElaboracion)
        }).catch(e => {
            console.log(e)
        })
    }, []);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro de produccion");
        setContentModal(content);
        setShowModal(true);
    }

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    // Define la ruta de registro
    const rutaRegreso = () => {
        enrutamiento.push("/ReporteProduccion")
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Para eliminar productos del listado
    const removeItemRegistro = (registro) => {
        let newArray = listRegistros;
        newArray.splice(newArray.findIndex(a => a.ID === registro.ID), 1);
        setListRegistros([...newArray]);
    }

    const onSubmit = e => {
        e.preventDefault();

        if (!formData.fecha || !formData.asistencias || !formData.faltas || !formData.supervisor || !formData.turno || !formData.eficienciaGeneralMaquinas || !formData.observacionesTurno) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            const dataTemp = {
                fecha: formData.fecha,
                asistencias: formData.asistencias,
                faltas: formData.faltas,
                supervisor: formData.supervisor,
                turno: formData.turno,
                registros: listRegistros,
                eficienciaGeneralMaquinas: formData.eficienciaGeneralMaquinas,
                observacionesTurno: formData.observacionesTurno
            }
            // Modificar el pedido creado recientemente
            actualizaReporteProduccion(id, dataTemp).then(response => {
                const { data: { mensaje, datos } } = response;
                // console.log(response)
                toast.success(mensaje)
                setLoading(false)
                rutaRegreso()
            }).catch(e => {
                console.log(e)
            })
        }
    }

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Nuevo reporte de producción
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

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="1">
                                    <Form.Label align="center">
                                        Fecha
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha"
                                        name="fecha"
                                        defaultValue={formData.fecha}
                                    />
                                </Col>

                                <Col sm="1">
                                    <Form.Label align="center">
                                        Turno
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Turno"
                                        name="turno"
                                        defaultValue={formData.turno}
                                    />
                                </Col>

                                <Col sm="1">
                                    <Form.Label align="center">
                                        Supervisor
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Supervisor"
                                        name="supervisor"
                                        defaultValue={formData.supervisor}
                                    />
                                </Col>

                                <Col sm="1">
                                    <Form.Label align="center">
                                        Asistencias
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Asistencias"
                                        name="asistencias"
                                        defaultValue={formData.asistencias}
                                    />
                                </Col>

                                <Col sm="1">
                                    <Form.Label align="center">
                                        Faltas
                                    </Form.Label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Faltas"
                                        name="faltas"
                                        defaultValue={formData.faltas}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <br />

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Col sm="2">
                                    <Button
                                        className="registrar"
                                        title="Agregar un registro"
                                        variant="success"
                                        onClick={() => {
                                            nuevoRegistro(
                                                <NuevoRegistro
                                                    setShowModal={setShowModal}
                                                    setListRegistros={setListRegistros}
                                                    listRegistros={listRegistros}
                                                />
                                            )
                                        }}
                                    >
                                        Nuevo registro
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Row>

                        <table className="responsive-tableRegistroVentas"
                        >
                            <thead>
                                <tr>
                                    <th scope="col">Maquina</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Producción</th>
                                    <th scope="col">Eficiencia</th>
                                    <th scope="col">Ciclo</th>
                                    <th scope="col">Estandar</th>
                                    <th scope="col">Scrap</th>
                                    <th scope="col">Observaciones</th>
                                    <th scope="col"></th>
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
                                            {registro.producto}
                                        </td>
                                        <td data-title="Descripcion">
                                            {registro.produccion}
                                        </td>
                                        <td data-title="UM">
                                            {registro.eficiencia}
                                        </td>
                                        <td data-title="Descripción">
                                            {registro.ciclo}
                                        </td>
                                        <td data-title="Orden de compra">
                                            {registro.estandar}
                                        </td>
                                        <td data-title="Observaciones">
                                            {registro.scrap}
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

                        <br />

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Eficiencia general de turno de todas las maquinas
                                    </Form.Label>
                                </Col>
                                <Col sm="5">
                                    <Form.Control
                                        type="text"
                                        placeholder="Eficiencia general de turno de todas las maquinas"
                                        name="eficienciaGeneralMaquinas"
                                        defaultValue={formData.eficienciaGeneralMaquinas}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Row} controlId="formHorizontalNoInterno">
                                <Col sm="3">
                                    <Form.Label align="center">
                                        Observaciones generales del turno
                                    </Form.Label>
                                </Col>
                                <Col sm="5">
                                    <Form.Control
                                        type="text"
                                        placeholder="Observaciones generales del turno"
                                        name="observacionesTurno"
                                        defaultValue={formData.observacionesTurno}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Actualizar el registro"
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

function initialFormData() {
    return {
        fecha: "",
        turno: "",
        supervisor: "",
        asistencias: "",
        faltas: "",
        eficienciaGeneralMaquinas: "",
        observacionesTurno: ""
    }
}

function valoresAlmacenados(data) {
    return {
        fecha: data.fecha,
        turno: data.turno,
        supervisor: data.supervisor,
        asistencias: data.asistencias,
        faltas: data.faltas,
        eficienciaGeneralMaquinas: data.eficienciaGeneralMaquinas,
        observacionesTurno: data.observacionesTurno
    }
}

export default RegistroReporteProduccion;
