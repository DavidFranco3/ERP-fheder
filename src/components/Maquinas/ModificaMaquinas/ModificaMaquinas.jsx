import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Container, Spinner } from "react-bootstrap";
import { actualizaMaquina, obtenerMaquina } from "../../../api/maquinas";
import { toast } from "react-toastify";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import { getSucursal } from "../../../api/auth";
import { listarClasificacionMaquinaria } from '../../../api/clasificacionMaquinaria';
import { listarSucursales } from "../../../api/sucursales";
import { map } from "lodash";

function ModificaMaquinas(props) {
    const { setShowModal, history, data } = props;

    const { id } = data;

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

    useEffect(() => {
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
    }, []);

    // Para almacenar el listado de proveedores
    const [listSucursales, setListSucursales] = useState(null);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMaquina(id).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if (!formData && data) {
                    setFormData(valoresAlmacenados(data));
                } else {
                    const datosMaquinas = valoresAlmacenados(data);
                    setFormData(datosMaquinas);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
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
                fechaAdquisicion: formData.fechaAdquisicion,
            }
            // console.log(dataTemp)

            try {
                actualizaMaquina(id, dataTemp).then(response => {
                    const { data } = response;
                    toast.success(data.mensaje)
                    LogsInformativos("Se ha modificadp la maquina " + formData.numeroMaquina, dataTemp)
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
                                        <option key={index} value={maquina?.nombre} selected={maquina?.nombre == formData.tipoMaquina}>{maquina?.nombre}</option>
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
                                        <option key={index} value={sucursal?.nombre} selected={sucursal?.nombre == formData.lugar}>{sucursal?.nombre}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formHorizontalNoInterno">
                                <Form.Label>Fecha de adquisición</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Fecha de adquisicion"
                                    name="fechaAdquisicion"
                                    defaultValue={formData.fechaAdquisicion}
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

function valoresAlmacenados(data) {
    return {
        numeroMaquina: data.numeroMaquina,
        tipoMaquina: data.tipoMaquina,
        nombreMaquina: data.nombre,
        marca: data.marca,
        modelo: data.modelo,
        noSerie: data.noSerie,
        fechaAdquisicion: data.fechaAdquisicion,
        lugar: data.lugar
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

export default ModificaMaquinas;
