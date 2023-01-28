import { useState, useEffect } from 'react';
import queryString from "query-string";
import "./EliminacionLogicaSucursales.scss";
import { Button, Col, Form, Row, Spinner, Container, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { deshabilitaSucursal } from "../../../api/sucursales";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";

function EliminacionLogicaSucursales(props) {
    const { data, setShowModal, history } = props;
    const { id, estadoSucursal } = data;

    //console.log(dataUsuario)

    // Para almacenar datos del formulario
    const [formData, setFormData] = useState(initialFormData(data));

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    // Para cancelar el registro
    const regresaPagina = () => {
        setShowModal(false)
    }

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            estadoSucursal: estadoSucursal === "false" ? "true" : "false"
        }
        //console.log(dataTemp)

        try {
            deshabilitaSucursal(id, dataTemp).then(response => {
                const { data } = response;
                //console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se ha actualizado el estado de la sucursal " + formData.nombre, data)
                setShowModal(false);
                setLoading(false);
                history.push({
                    search: queryString.stringify(""),
                });
            })
        } catch (e) {
            console.log(e)
        }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container>
                <div className="formularioDatos">
                    {estadoSucursal == "true" ?
                        (
                            <>
                                <Alert variant="danger">
                                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                                    <p className="mensaje">
                                        Esta acción deshabilitara en el sistema la sucursal.
                                    </p>
                                </Alert>
                            </>
                        ) : (
                            <>
                                <Alert variant="success">
                                    <Alert.Heading>Atención! Acción contructiva!</Alert.Heading>
                                    <p className="mensaje">
                                        Esta acción habilitara en el sistema la sucursal.
                                    </p>
                                </Alert>
                            </>
                        )
                    }

                    <Form onChange={onChange} onSubmit={onSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formHorizontalNombre">
                                <Form.Label>
                                    Nombre
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe el nombre"
                                    name="nombre"
                                    disabled
                                    defaultValue={formData.nombre}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label align="center">
                                Datos del domicilio
                            </Form.Label>
                            <Form.Group as={Col} controlId="formHorizontalCalle">
                                <Form.Label>
                                    Calle
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Escribe la calle"
                                    name="calle"
                                    disabled
                                    defaultValue={formData.calle}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridNumeroExterior">
                                <Form.Label>
                                    Numero exterior
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Numero exterior"
                                    name="numeroExterior"
                                    disabled
                                    defaultValue={formData.numeroExterior}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridNumeroInterior">
                                <Form.Label>
                                    Numero interior
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Numero interior"
                                    name="numeroInterior"
                                    disabled
                                    defaultValue={formData.numeroInterior}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEstado">
                                <Form.Label>
                                    Estado
                                </Form.Label>

                                <Form.Control
                                    as="select"
                                    defaultValue={formData.estado}
                                    name="estado"
                                    disabled
                                >
                                    <option>Elige una opción</option>
                                    <option value="Aguascalientes">Aguascalientes</option>
                                    <option value="Baja California">Baja California</option>
                                    <option value="Baja California Sur">Baja California Sur</option>
                                    <option value="Campeche">Campeche</option>
                                    <option value="Chiapas">Chiapas</option>
                                    <option value="Chihuahua">Chihuahua</option>
                                    <option value="CDMX">Ciudad de México</option>
                                    <option value="Coahuila">Coahuila</option>
                                    <option value="Colima">Colima</option>
                                    <option value="Durango">Durango</option>
                                    <option value="Estado de México">Estado de México</option>
                                    <option value="Guanajuato">Guanajuato</option>
                                    <option value="Guerrero">Guerrero</option>
                                    <option value="Hidalgo">Hidalgo</option>
                                    <option value="Jalisco">Jalisco</option>
                                    <option value="Michoacán">Michoacán</option>
                                    <option value="Morelos">Morelos</option>
                                    <option value="Nayarit">Nayarit</option>
                                    <option value="Nuevo León">Nuevo León</option>
                                    <option value="Oaxaca">Oaxaca</option>
                                    <option value="Puebla">Puebla</option>
                                    <option value="Querétaro">Querétaro</option>
                                    <option value="Quintana Roo">Quintana Roo</option>
                                    <option value="San Luis Potosí">San Luis Potosí</option>
                                    <option value="Sinaloa">Sinaloa</option>
                                    <option value="Sonora">Sonora</option>
                                    <option value="Tabasco">Tabasco</option>
                                    <option value="Tamaulipas">Tamaulipas</option>
                                    <option value="Tlaxcala">Tlaxcala</option>
                                    <option value="Veracruz">Veracruz</option>
                                    <option value="Yucatán">Yucatán</option>
                                    <option value="Zacatecas">Zacatecas</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridMunicipio">
                                <Form.Label>
                                    Municipio
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Municipio"
                                    name="municipio"
                                    disabled
                                    defaultValue={formData.municipio}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridColonia">
                                <Form.Label>
                                    Codigo postal
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Codigo postal"
                                    name="codigoPostal"
                                    disabled
                                    defaultValue={formData.codigoPostal}
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group as={Col} className="botones">
                            <Row>
                                <Col>
                                    <Button
                                        type="submit"
                                        variant="success"
                                        className="registrar"
                                    >
                                        {!loading ? (estadoSucursal === "true" ? "Deshabilitar" : "Habilitar") : <Spinner animation="border" />}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        variant="danger"
                                        className="cancelar"
                                        onClick={() => {
                                            regresaPagina()
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
            </Container>
        </>
    );
}

function initialFormData(data) {
    return {
        nombre: data.nombre,
        calle: data.calle,
        numeroExterior: data.numeroExterior,
        numeroInterior: data.numeroInterior,
        municipio: data.municipio,
        estado: data.estado,
        codigoPostal: data.codigoPostal
    }
}

export default EliminacionLogicaSucursales;
