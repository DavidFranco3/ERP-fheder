import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row, Form, Container, Badge, Spinner } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./RegistroReporteProduccion.scss";
import NuevoRegistro from "../NuevoRegistro";
import { registraReporteProducción, obtenerNumeroReporteProduccion } from "../../../api/reporteProduccion";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faX, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { map } from "lodash";
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../../api/auth";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function RegistroReporteProduccion(props) {
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

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    const [listRegistros, setListRegistros] = useState([]);

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

        if (!formData.asistencias || !formData.faltas || !formData.supervisor || !formData.turno || !formData.eficiencia || !formData.observaciones) {
            toast.warning("Completa el formulario");
        } else {
            //console.log("Continuar")
            setLoading(true)

            // Obtener el id del pedido de venta para registrar los demas datos del pedido y el tracking
            obtenerNumeroReporteProduccion().then(response => {
                const { data } = response;
                const dataTemp = {
                    folio: data.folio,
                    fecha: fechaActual,
                    asistencias: formData.asistencias,
                    faltas: formData.faltas,
                    supervisor: formData.supervisor,
                    turno: formData.turno,
                    sucursal: getSucursal(),
                    registros: listRegistros,
                    eficienciaGeneralMaquinas: formData.eficiencia,
                    observacionesTurno: formData.observaciones,
                    estado: "true"
                }
                LogsInformativos("Se a registrado un nuevo reporte de producción " + dataTemp.folio, dataTemp)
                // Modificar el pedido creado recientemente
                registraReporteProducción(dataTemp).then(response => {
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

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaActual, setFechaActual] = useState(fecha);

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
                        <br />
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
                                        value={fechaActual}
                                        onChange={e => setFechaActual(e.target.value)}
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
                                        name="eficiencia"
                                        defaultValue={formData.eficiencia}
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
                                        name="observaciones"
                                        defaultValue={formData.observaciones}
                                    />
                                </Col>
                            </Form.Group>
                        </Row>

                        <Form.Group as={Row} className="botones">
                            <Col>
                                <Button
                                    type="submit"
                                    title="Guardar la información del formulario"
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

function initialFormData() {
    return {
        fecha: "",
        turno: "",
        supervisor: "",
        asistencias: "",
        faltas: "",
        eficiencia: "",
        observaciones: ""
    }
}

export default RegistroReporteProduccion;
