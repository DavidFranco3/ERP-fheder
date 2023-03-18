import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { eliminaNotas } from "../../../api/notas";
import { obtenerDatosFactura } from "../../../api/facturas";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { LogCuentaActualizacion } from "../../CuentasClientes/Gestion/GestionCuentasClientes";

function EliminacionFisicaNotas(props) {
    const { datos, setShowModal, history } = props;
    const { id, folio, factura, tipo, total } = datos;

    //console.log(datosPedido)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const [cliente, setCliente] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");

    const cargarDatosFactura = () => {
        //
        obtenerDatosFactura(factura).then(response => {
            const { data } = response;
            //console.log(data)
            setCliente(data.cliente);
            setNombreCliente(data.nombreCliente);
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        cargarDatosFactura();
    }, []);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);
        //console.log(dataTemp)

        try {
            eliminaNotas(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos("Se ha eliminado la nota con el folio de " + tipo + " con folio" + folio, datos);
                LogCuentaActualizacion(cliente, nombreCliente, tipo == "Cargo" ? parseFloat(total) * -1 : tipo == "Credito" ? parseFloat(total) : tipo == "Devolución" ? parseFloat(total) : "");
                //LogTrackingEliminacion(folio)
                setShowModal(false);
                setLoading(false);
                history({
                    search: queryString.stringify(""),
                });
            })
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <>
            <Form onSubmit={onSubmit}>

                <Alert variant="danger">
                    <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                    <p className="mensaje">
                        Esta acción eliminara del sistema la nota de {tipo}.
                    </p>
                </Alert>
                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Folio
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={folio}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Cuenta por cobrar
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={factura}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <br />

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Tipo
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={tipo}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Total
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={total}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Eliminar el registro"
                            variant="success"
                            className="registrar"
                        >
                            {!loading ? "Eliminar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelarEliminacion()
                            }}
                        >
                            Cancelar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminacionFisicaNotas;
