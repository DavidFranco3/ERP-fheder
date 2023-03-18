import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { registraMaquina } from "../../../api/maquinas";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { listarClasificacionMaquinaria } from '../../../api/clasificacionMaquinaria';
import { listarSucursales } from "../../../api/sucursales";
import { map } from "lodash";

function RegistraMaquinas(props) {
    const { setShowModal, history } = props;

    // Para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Cancelar y cerrar el formulario
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para almacenar el listado de proveedores
    const [listTipoMaquina, setListTipoMaquina] = useState(null);

    const cargarListaTipoMaquinas = () => {
        try {
            listarClasificacionMaquinaria(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarClasificacionMaquinaria() && data) {
                    setListTipoMaquina(formatModelClasificacionMaquinaria(data));
                } else {
                    const datosMaquinas = formatModelClasificacionMaquinaria(data);
                    setListTipoMaquina(datosMaquinas);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        cargarListaTipoMaquinas();
    }, []);

    // Para almacenar el listado de proveedores
    const [listSucursales, setListSucursales] = useState(null);

    const cargarListaSucursales = () => {
        try {
            listarSucursales(getSucursal()).then(response => {
                const { data } = response;
                // console.log(data)
                if (!listarSucursales() && data) {
                    setListSucursales(formatModelSucursales(data));
                } else {
                    const datosSucursales = formatModelSucursales(data);
                    setListSucursales(datosSucursales);
                }

            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    } 

    useEffect(() => {
        cargarListaSucursales();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault()

        if (!formData.numeroMaquina) {
            toast.warning("Completa el formulario");
        } else {
            setLoading(true)

            const dataTemp = {
                numeroMaquina: formData.numeroMaquina,
                tipoMaquina: formData.tipoMaquina,
                nombre: formData.nombreMaquina,
                marca: formData.marca,
                modelo: formData.modelo,
                noSerie: formData.noSerie,
                lugar: formData.lugar,
                sucursal: getSucursal(),
                fechaAdquisicion: fechaAdquisicion,
                status: "true"
            }
            // console.log(dataTemp)

            try {
                registraMaquina(dataTemp).then(response => {
                    const { data } = response;
                    toast.success(data.mensaje)
                    LogsInformativos("Se ha registrado una nueva maquina " + formData.numeroMaquina, dataTemp)
                    history({
                        search: queryString.stringify(""),
                    });
                    setShowModal(false)
                }).catch(e => {
                    console.log(e)
                    if (e.message === 'Network Error') {
                        //console.log("No hay internet")
                        toast.error("Conexión al servidor no disponible");
                        setLoading(false);
                    } else {
                        if (e.response && e.response.status === 401) {
                            const { mensaje } = e.response.data;
                            toast.error(mensaje);
                            setLoading(false);
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 9 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 9 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaAdquisicion, setFechaAdquisicion] = useState(fecha);

    return (
        <>
            <Container fluid>
                <div className="formularioDatos">
                    <Form onChange={onChange} onSubmit={onSubmit}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Numero de maquina</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Numero de maquina"
                                    name="numeroMaquina"
                                    defaultValue={formData.numeroMaquina}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Tipo de maquina</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="tipoMaquina"
                                    defaultValue={formData.tipoMaquina}
                                >
                                    <option>Elige una opción</option>
                                    {map(listTipoMaquina, (maquina, index) => (
                                        <option key={index} value={maquina?.nombre}>{maquina?.nombre}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Nombre de la maquina</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre de la maquina"
                                    name="nombreMaquina"
                                    defaultValue={formData.nombreMaquina}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>No. Serie</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Numero de serie"
                                    name="noSerie"
                                    defaultValue={formData.noSerie}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Marca"
                                    name="marca"
                                    defaultValue={formData.marca}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Modelo"
                                    name="modelo"
                                    defaultValue={formData.modelo}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Lugar en el que se encuentra</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="lugar"
                                    defaultValue={formData.lugar}
                                >
                                    <option>Elige una opción</option>
                                    {map(listSucursales, (sucursal, index) => (
                                        <option key={index} value={sucursal?.nombre}>{sucursal?.nombre}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Fecha de adquisición</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha de adquisicion"
                                    name="fechaAdquisicion"
                                    value={fechaAdquisicion}
                                    onChange={e => setFechaAdquisicion(e.target.value)}
                                />
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
                                        cancelarRegistro()
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData() {
    return {
        numeroMaquina: "",
        tipoMaquina: "",
        nombreMaquina: "",
        marca: "",
        modelo: "",
        noSerie: "",
        fechaAdquisicion: "",
        lugar: ""
    }
}

function formatModelClasificacionMaquinaria(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            sucursal: data.sucursal,
            estado: data.estado,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelSucursales(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, municipio, estado, codigoPostal } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            sucursal: data.sucursal,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            municipio: municipio,
            estado: estado,
            codigoPostal: codigoPostal,
            estadoSucursal: data.estadoSucursal,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistraMaquinas;
