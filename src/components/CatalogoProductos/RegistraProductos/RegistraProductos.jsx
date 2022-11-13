import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCirclePlus, faArrowLeftLong} from "@fortawesome/free-solid-svg-icons";
import { registraCatalogoProductos } from "../../../api/catalogoProductos";
import { listarClientes } from "../../../api/clientes";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {map} from "lodash";
import {listarMateriaPrima} from "../../../api/materiaPrima";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function RegistraProductos(props) {

    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    // Para almacenar los datos del producto
    const [datosProducto, setDatosProducto] = useState(null);

    // Para almacenar el listado de clientes
    const [listClientes, setListClientes] = useState(null);
    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    // para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // Para definir el enrutamiento hacia productos
    const enrutamiento = useHistory();

    // Define el regreso hacia los productos
    const rutaRegresoProductos = () => {
        enrutamiento.push("/CatalogoProductos")
    }

    useEffect(() => {
        // Para obtener el listado de materias primas
        try {
            listarMateriaPrima().then(response => {
                const { data } = response;
                //console.log(data)
                if(!listMateriasPrimas &&data) {
                    setListMateriasPrimas(formatModelMateriasPrimas(data));
                } else {
                    const datosProductos = formatModelMateriasPrimas(data);
                    setListMateriasPrimas(datosProductos);
                }
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        } catch (e) {
            console.log(e)
        }
        // Para obtener el listado de clientes
        try {
            listarClientes().then(response => {
                const { data } = response;
                //console.log(data)
                const tempClientes = []
                if(data){
                    map(data, (cliente, index) => {
                        //console.log(cliente.tipo)
                        if(cliente.tipo === "interno"){
                            tempClientes.push(cliente)
                        }
                    })
                    setListClientes(tempClientes)
                }
            }).catch(e => {
                //console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
                }
            })
        }catch (e) {
            console.log(e)
        }
    }, []);

    const onSubmit = e => {
        e.preventDefault()
        
        if (!formData.noInterno || !formData.cliente || !formData.noMolde || !formData.cavMolde || !formData.noParte || !formData.descripcion || !formData.pesoPiezas || !formData.pesoColada || !formData.pesoTotalInyeccion || !formData.porcentajeScrap || !formData.porcentajeMolido || !formData.materiaPrima) {
            toast.warning("Completa el formulario");
        } else {
        
        //console.log(formData)
        setLoading(true)

        const dataTemp = {
            noInterno: formData.noInterno,
            cliente: formData.cliente,
            datosMolde: {
                noMolde: formData.noMolde,
                cavMolde: formData.cavMolde
            },
            noParte: formData.noParte,
            descripcion: formData.descripcion,
            datosPieza: {
                pesoPiezas: formData.pesoPiezas,
                pesoColada: formData.pesoColada,
                pesoTotalInyeccion: formData.pesoTotalInyeccion,
                porcentajeScrap: formData.porcentajeScrap,
                porcentajeMolido: formData.porcentajeMolido
            },
            materiaPrima: formData.materiaPrima,
            estado: "true"
        }

        //console.log(dataTemp)
        try {
            registraCatalogoProductos(dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Nuevo producto registrado en el catálogo con No. interno ", dataTemp.noInterno, dataTemp)
                setLoading(false)
                toast.success(data.mensaje)
                rutaRegresoProductos()
            }).catch(e => {
                console.log(e)
                if(e.message === 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");
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

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Nuevo producto
                            </h1>
                        </Col>
                    </Row>
                </Alert>

                <Container fluid>
                    <Col>
                        <div className="formlarioRegistroProductos">
                            <Form onChange={onChange} onSubmit={onSubmit}>
                            <Row>
                                <Form.Group as={Row} className="mb-3" controlId="formHorizontalNumeroInterno">
                                <Col sm="2">
                                    <Form.Label>
                                        Número interno
                                    </Form.Label>
                                </Col>
                                <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el numero interno"
                                            name="noInterno"
                                            defaultValue={formData.noInterno}
                                            />
                                            </Col>
                                            <Col sm="2">
                                    <Form.Label>
                                        Cliente
                                    </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control as="select"
                                                      name="cliente"
                                                      defaultValue={formData.cliente}
                                        >
                                            <option>Elige una opción</option>
                                            {map(listClientes, (cliente, index) => (
                                                <option key={index} value={cliente?.id}>{cliente?.nombre}</option>
                                            ))}
                                        </Form.Control>
                                        </Col>
                                </Form.Group>
                                </Row>
                                

                                {/* No. molde y cav molde */}
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridNumeroMolde">
                                    <Col sm="2">
                                        <Form.Label>
                                            Número de Molde
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el no. del molde"
                                            name="noMolde"
                                            defaultValue={formData.noMolde}
                                        />
                                    </Col>
                                    
                                    <Col sm="2">
                                        <Form.Label>
                                            Peso colada (kg)
                                        </Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="number"
                                            step="0.000001"
                                            min="0"
                                            placeholder="Escribe el peso"
                                            name="pesoColada"
                                            defaultValue={formData.pesoColada}
                                        />
                                    </Col>
                                    </Form.Group>
                                </Row>

                                {/* No. parte y descripcion */}
                                <Row className="mb-3">
                                    
                                    <Form.Group as={Row} controlId="formGridCAVMolde">
                                        <Col sm="2">
                                        <Form.Label>
                                            Cavidades del molde
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el CAV del molde"
                                            name="cavMolde"
                                            defaultValue={formData.cavMolde}
                                        />
                                        </Col>
                                        
                                        <Col sm="2">
                                        <Form.Label>
                                            Peso de la inyección (kg)
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="number"
                                            step="0.000001"
                                            min="0"
                                            placeholder="Escribe el peso"
                                            name="pesoTotalInyeccion"
                                            defaultValue={formData.pesoTotalInyeccion}
                                        />
                                        </Col>
                                    </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridNumeroParte">
                                        <Col sm="2">
                                        <Form.Label>
                                            Número de parte
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el no. de parte"
                                            name="noParte"
                                            defaultValue={formData.noParte}
                                        />
                                        </Col>
                                        
                                        <Col sm="2">
                                        <Form.Label>
                                            Porcentaje scrap (%)
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            placeholder="Escribe el porcentaje"
                                            name="porcentajeScrap"
                                            defaultValue={formData.porcentajeScrap}
                                        />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                {/* pesoPiezas y pesoColada */}
                                <Row className="mb-3">
                                    <Form.Group as={Row} controlId="formGridDescripcion">
                                        <Col sm="2">
                                        <Form.Label>
                                            Descripcion
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe la descripcion"
                                            name="descripcion"
                                            defaultValue={formData.descripcion}
                                        />
                                        </Col>
                                        
                                        <Col sm="2">
                                        <Form.Label>
                                            Porcentaje de molido (%)
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="number"
                                            step="0.00000000000001"
                                            min="0"
                                            placeholder="Escribe el porcentaje"
                                            name="porcentajeMolido"
                                            defaultValue={formData.porcentajeMolido}
                                        />
                                        </Col>
                                    </Form.Group>
                                </Row>

                                {/* porcentajeMolido y materiaPrima */}
                                <Row className="mb-3">                        
                                    <Form.Group as={Row} controlId="formGridNumeroParte">
                                        <Col sm="2">
                                        <Form.Label>
                                            Peso de la pieza (kg)
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control
                                            type="number"
                                            step="0.000001"
                                            min="0"
                                            placeholder="Escribe el peso"
                                            name="pesoPiezas"
                                            defaultValue={formData.pesoPiezas}
                                        />
                                        </Col>
                                        
                                        <Col sm="2">
                                        <Form.Label>
                                            Selecciona la materia prima
                                        </Form.Label>
                                        </Col>
                                        <Col>
                                        <Form.Control as="select"
                                                      defaultValue={formData.materiaPrima}
                                                      name="materiaPrima"
                                        >
                                            <option>Elige una opción</option>
                                            {map(listMateriasPrimas, (materiaprima, index) => (
                                                <option key={index} value={materiaprima?.folio}>{materiaprima?.folio + " -- " + materiaprima?.descripcion}</option>
                                            ))}
                                        </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Form.Group as={Row} className="botones">
                                    <Row>
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
                                                    rutaRegresoProductos()
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Container>
            </LayoutPrincipal>
        </>
    );
}

function initialFormData() {
    return {
        noInterno: "",
        cliente: "",
        noMolde: "",
        cavMolde: "",
        noParte: "",
        descripcion: "",
        pesoPiezas: "",
        pesoColada: "",
        pesoTotalInyeccion: "",
        porcentajeScrap: "",
        porcentajeMolido: "",
        materiaPrima: ""
    }
}

function finalFormData(data) {
    const { noInterno, cliente, descripcion, materiaPrima, noParte, datosMolde: { cavMolde, noMolde }, datosPieza: { pesoColada, pesoPiezas, pesoTotalInyeccion, porcentajeScrap, porcentajeMolido } } = data;

    return {
        noInterno: noInterno,
        cliente: cliente,
        noMolde: noMolde,
        cavMolde: cavMolde,
        noParte: noParte,
        descripcion: descripcion,
        pesoPiezas: pesoPiezas,
        pesoColada: pesoColada,
        pesoTotalInyeccion: pesoTotalInyeccion,
        porcentajeScrap: porcentajeScrap * 100,
        porcentajeMolido: porcentajeMolido * 100,
        materiaPrima: materiaPrima
    }
}

function formatModelMateriasPrimas(data){
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            descripcion: data.descripcion,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default RegistraProductos;
