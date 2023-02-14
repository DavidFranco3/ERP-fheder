import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import queryString from "query-string";
import { Button, Col, Form, Row, Spinner, Alert } from "react-bootstrap";
import { habilitaMartesT2 } from "../../../api/programaProduccion";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function HabilitarMartesT2(props) {
    const { datos, setShowModal, history } = props;

    const { id, folio, programa } = datos;

    const { fechaInicio, lunesT1, estadoLT1, lunesT2, estadoLT2, martesT1, estadoMT1, martesT2, estadoMT2, miercolesT1, estadoMIT1, miercolesT2, estadoMIT2, juevesT1, estadoJT1, juevesT2, estadoJT2, viernesT1, estadoVT1, viernesT2, estadoVT2, sabadoT1, estadoST1} = programa;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    //console.log(datosPedido)

    // Para cancelar la actualizacion
    const cancelarEliminacion = () => {
        setShowModal(false)
    }

    // Para determinar el uso de la animacion
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const dataTemp = {
            programa: {
                fechaInicio: fechaInicio,
                lunesT1: lunesT1,
                estadoLT1: estadoLT1,
                lunesT2: lunesT2,
                estadoLT2: estadoLT2,
                martesT1: martesT1,
                estadoMT1: estadoMT1,
                martesT2: martesT2,
                estadoMT2: estadoMT2 === "false" ? "true" : "false",
                miercolesT1: miercolesT1,
                estadoMIT1: estadoMIT1,
                miercolesT2: miercolesT2,
                estadoMIT2: estadoMIT2,
                juevesT1: juevesT1,
                estadoJT1: estadoJT1,
                juevesT2: juevesT2,
                estadoJT2: estadoJT2,
                viernesT1: viernesT1,
                estadoVT1: estadoVT1,
                viernesT2: viernesT2,
                estadoVT2: estadoVT2,
                sabadoT1: sabadoT1,
                estadoST1: estadoST1,
            }
        }
        //console.log(dataTemp)

        try {
            habilitaMartesT2(id, dataTemp).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje);
                LogsInformativos("Se actualizo el estado del segundo turno del martes " + folio, dataTemp);
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

                {estadoMT1 == "false" ?
                    (
                        <>
                            <Alert variant="success">
                                <Alert.Heading>Atención! Acción constructiva!</Alert.Heading>
                                <p className="mensaje">
                                    Esta acción habilitara el segundo turno del martes.
                                </p>
                            </Alert>
                        </>
                    ) : (<>
                        <Alert variant="danger">
                            <Alert.Heading>Atención! Acción destructiva!</Alert.Heading>
                            <p className="mensaje">
                                Esta acción deshabilitara el segundo turno del martes.
                            </p>
                        </Alert>
                    </>)
                }

                <Row>
                    <Form.Group as={Col} controlId="formGridCliente">
                        <Form.Label>
                            Fecha del MartesT2
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={dayjs(martesT2).format("LL")}
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
                            {!loading ? estadoMT2 == "true" ? "Deshabilitar" : "Habilitar" : <Spinner animation="border" />}
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
                            Cerrar
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );
}

export default HabilitarMartesT2;
