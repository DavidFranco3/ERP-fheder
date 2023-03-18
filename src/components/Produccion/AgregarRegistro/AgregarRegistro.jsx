import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Row, Form, Container, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import BasicModal from "../../Modal/BasicModal";
import BuscarArticuloAlmacen from '../../../page/BuscarArticuloAlmacen';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { LogRegistroAlmacenes } from '../../Almacenes/Gestion/GestionAlmacenes';

function AgregarRegistro(props) {
    const { listRegistros, setListRegistros, setShowModal, registroAnterior, setRegistroAnterior, kgMaterial } = props;

    // Para hacer uso del modal
    const [showModal2, setShowModal2] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para almacenar la informacion del formulario
    const [formDataAlmacen, setFormDataAlmacen] = useState(initialAlmacen());

    // Para almacenar la informacion del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para la eliminacion fisica de usuarios
    const buscarArticulo = (content) => {
        setTitulosModal("Buscar articulo del almacen");
        setContentModal(content);
        setShowModal2(true);
    }

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    // Para cerrar el modal
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const addItems = () => {
        const fecha = document.getElementById("fecha").value
        const acumulado = document.getElementById("acumulado").value
        const material = document.getElementById("material").value
        const pendienteSurtir = document.getElementById("pendienteSurtir").value
        const virgenMolido = document.getElementById("virgenMolido").value
        const surtio = document.getElementById("surtio").value
        const recibio = document.getElementById("recibio").value
        const observaciones = document.getElementById("observaciones").value
        const cantidadSurtida = document.getElementById("cantidadSurtida").value

        if (!fecha || !acumulado || !material || !pendienteSurtir || !virgenMolido || !surtio || !recibio || !observaciones || !cantidadSurtida) {
            toast.warning("Completa la información del resultado");
        } else {
            if (parseInt(cantidadSurtida) > parseInt(cantidadExistencia)) {
                toast.warning("La cantidad surtida no puede ser mayor a la que hay en almacen");
            } else {
                setLoading(true);

                const dataTemp = {
                    fecha: fecha,
                    acumulado: acumulado,
                    material: material,
                    pendienteSurtir: pendienteSurtir,
                    virgenMolido: virgenMolido,
                    surtio: surtio,
                    recibio: recibio,
                    observaciones: observaciones,
                    cantidadSurtida: cantidadSurtida,
                }


                // console.log(dataTemp)

                setListRegistros(
                    [...listRegistros, dataTemp]
                );

                LogRegistroAlmacenes(formDataAlmacen.folioArticulo, material, formDataAlmacen.almacen, formDataAlmacen.um, cantidadSurtida, "Salida");

                setRegistroAnterior(acumulado)

                setShowModal(false)
            }
        }
    }

    const hoy = new Date();
    // const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + " " + hora;
    const fecha = (hoy.getMonth() + 1) > 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
        : (hoy.getMonth() + 1) < 10 && hoy.getDate() > 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + hoy.getDate()
            : (hoy.getMonth() + 1) < 10 && hoy.getDate() < 10 ? hoy.getFullYear() + '-' + "0" + (hoy.getMonth() + 1) + '-' + "0" + hoy.getDate()
                : hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

    const [fechaRegistro, setFechaRegistro] = useState(fecha);

    const [acumulado, setAcumulado] = useState(0);

    const [cantidadExistencia, setCantidadExistencia] = useState(0);

    const [pendienteSurtir, setPendienteSurtir] = useState(0);

    const calcularTotal = () => {
        const totalAcumulado = parseInt(formDataAlmacen.cantidadExistencia) + parseInt(registroAnterior);
        setAcumulado(totalAcumulado);

        const totalPendiente = parseFloat(kgMaterial) - parseInt(acumulado);
        setPendienteSurtir(totalPendiente);
    }

    useEffect(() => {
        calcularTotal();
    }, [formDataAlmacen.cantidadExistencia, pendienteSurtir, acumulado]);

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormDataAlmacen({ ...formDataAlmacen, [e.target.name]: e.target.value })
    }

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalFecha">
                        <Form.Label align="center">
                            Fecha
                        </Form.Label>
                        <Form.Control
                            id="fecha"
                            type="date"
                            placeholder="Fecha"
                            name="fecha"
                            value={fechaRegistro}
                            onChange={e => setFechaRegistro(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formHorizontalPiezasDefectuosas">
                        <Form.Label align="center">
                            Cantidad surtida
                        </Form.Label>
                        <Form.Control
                            id="cantidadSurtida"
                            type="number"
                            placeholder="Cantidad surtida"
                            name="cantidadExistencia"
                            max={parseInt(cantidadExistencia)}
                            defaultValue={formDataAlmacen.cantidadExistencia}
                            onChange={onChange}
                        />
                    </Form.Group>

                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalTurno">
                        <Form.Label align="center">
                            Material
                        </Form.Label>
                        <div className="flex items-center mb-1">
                            <Form.Control
                                id="material"
                                type="text"
                                placeholder="Material"
                                name="material"
                                defaultValue={formDataAlmacen.nombreArticulo}
                                onChange={onChange}
                            />
                            <FontAwesomeIcon
                                className="cursor-pointer py-2 -ml-6"
                                title="Buscar en el almacen"
                                icon={faSearch}
                                onClick={() => {
                                    buscarArticulo(
                                        <BuscarArticuloAlmacen
                                            setFormData={setFormDataAlmacen}
                                            formData={formDataAlmacen}
                                            setShowModal={setShowModal2}
                                            registroAnterior={registroAnterior}
                                            setCantidadExistencia={setCantidadExistencia}
                                            setRegistroAnterior={setRegistroAnterior}
                                        />)
                                }}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalAcumulado">
                        <Form.Label align="center">
                            Acumulado
                        </Form.Label>
                        <Form.Control
                            id="acumulado"
                            type="number"
                            placeholder="acumulado"
                            name="acumulado"
                            onChange={e => setAcumulado(e.target.value)}
                            value={acumulado == "0" ? registroAnterior : acumulado}
                            disabled
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalOperador">
                        <Form.Label align="center">
                            Virgen/Molido
                        </Form.Label>
                        <Form.Control
                            id="virgenMolido"
                            as="select"
                            placeholder="Virgen/Molido"
                            name="virgenMolido"
                            onChange={onChange}
                        >
                            <option>Elige una opción</option>
                            <option value="Virgen">Virgen</option>
                            <option value="Molido">Molido</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalPiezasDefectuosas">
                        <Form.Label align="center">
                            Pendiente de surtir
                        </Form.Label>
                        <Form.Control
                            id="pendienteSurtir"
                            type="text"
                            placeholder="Pendiente de surtir"
                            name="pendienteSurtir"
                            onChange={e => setPendienteSurtir(e.target.value)}
                            value={pendienteSurtir == "0" ? kgMaterial : pendienteSurtir}
                            disabled
                        />
                    </Form.Group>

                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formHorizontalEficiencia">
                        <Form.Label align="center">
                            Surtio
                        </Form.Label>
                        <Form.Control
                            id="surtio"
                            type="text"
                            placeholder="Surtio"
                            name="surtio"
                            onChange={onChange}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formHorizontalCiclo">
                        <Form.Label align="center">
                            Recibio
                        </Form.Label>
                        <Form.Control
                            id="recibio"
                            type="text"
                            placeholder="Recibio"
                            name="recibio"
                            onChange={onChange}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} controlId="formHorizontalObservaciones">
                        <Form.Label align="center">
                            Observaciones
                        </Form.Label>
                        <Form.Control
                            id="observaciones"
                            as="textarea"
                            placeholder="Observaciones"
                            name="observaciones"
                        />
                    </Form.Group>
                </Row>

                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            type="submit"
                            title="Guardar el registro"
                            variant="success"
                            className="registrar"
                            onClick={() => {
                                addItems()
                            }}
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
            </Container>
            <BasicModal show={showModal2} setShow={setShowModal2} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

function initialFormData() {
    return {
        virgenMolido: "",
        surtio: "",
        recibio: "",
        observaciones: "",
    }
}

function initialAlmacen() {
    return {
        folioArticulo: "",
        nombreArticulo: "",
        almacen: "",
        um: "",
        cantidadExistencia: "",

    }
}

export default AgregarRegistro;
