import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { obtenerProductoCatalogo, actualizaProductosCatalogo } from "../../../api/catalogoProductos";
import {Alert, Button, Col, Container, Form, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faCirclePlus, faArrowLeftLong} from "@fortawesome/free-solid-svg-icons";
import { listarClientes } from "../../../api/clientes";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {map} from "lodash";
import {listarMateriaPrima} from "../../../api/materiaPrima";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";

function ModificaProductos(props) {
    const { setRefreshCheckLogin } = props;

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

    // Define la extraccion de los parametros enviados por la url
    const parametros = useParams();
    const { id } = parametros

    //console.log(parametros);

    useEffect(() => {
        // Para obtener los datos del producto
        try {
            obtenerProductoCatalogo(id).then(response => {
                const { data } = response;
                //console.log(data)
                setFormData(finalFormData(data))
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

        //console.log(formData)

        const dataTemp = {
            ...formData,
            porcentajeScrap: formData.porcentajeScrap / 100,
            porcentajeMolido: formData.porcentajeMolido / 100,
            estado: "true"
        }
        //console.log(dataTemp)
        try {
            actualizaProductosCatalogo(id, dataTemp).then(response => {
                const { data } = response;
                LogsInformativos("Actualización de información para producto del catálogo con no. interno", dataTemp.noInterno, dataTemp)
                toast.success(data.status)
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
                                Modificando el producto
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegresoProductos()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowLeftLong} /> Regresa a la vista de productos
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                <Container>
                    <Col>
                        <div className="formlarioRegistroProductos">
                            <Form onChange={onChange} onSubmit={onSubmit}>
                                <Row>
                                <Form.Group as={Col} className="mb-3" controlId="formHorizontalNumeroInterno">
                                    <Form.Label>
                                        Número interno
                                    </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el numero interno"
                                            name="noInterno"
                                            defaultValue={formData.noInterno}
                                            required
                                            ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group as={Col} className="mb-3" controlId="formCliente">
                                    <Form.Label>
                                        Cliente
                                    </Form.Label>
                                        <Form.Control as="select"
                                                      name="cliente"
                                                      defaultValue={formData.cliente}
                                                      required
                                        >
                                            <option>Elige una opción</option>
                                            {map(listClientes, (cliente, index) => (
                                                <option key={index} value={cliente?.id}>{cliente?.nombre}</option>
                                            ))}
                                        </Form.Control>
                                </Form.Group>
                                </Row>
                                

                                {/* No. molde y cav molde */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridNumeroMolde">
                                        <Form.Label>
                                            Número de Molde
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el no. del molde"
                                            name="noMolde"
                                            defaultValue={formData.noMolde}
                                            required
                                        />
                                    </Form.Group>
                                                                                                           
                                    <Form.Group as={Col} controlId="formGridPesoColada">
                                        <Form.Label>
                                            Peso colada (kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.000001"
                                            min="0"
                                            placeholder="Escribe el peso"
                                            name="pesoColada"
                                            defaultValue={formData.pesoColada}
                                            required
                                        />
                                    </Form.Group>
                                </Row>

                                {/* No. parte y descripcion */}
                                <Row className="mb-3">
                                    
                                    <Form.Group as={Col} controlId="formGridCAVMolde">
                                        <Form.Label>
                                            Cavidades del molde
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el CAV del molde"
                                            name="cavMolde"
                                            defaultValue={formData.cavMolde}
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="formGridPesoTotalInyeccion">
                                        <Form.Label>
                                            Peso de la inyección (kg)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.000001"
                                            min="0"
                                            placeholder="Escribe el peso"
                                            name="pesoTotalInyeccion"
                                            defaultValue={formData.pesoTotalInyeccion}
                                            required
                                        />
                                    </Form.Group>
                                    </Row>
                                    
                                    
                                    <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridNumeroParte">
                                        <Form.Label>
                                            Número de parte
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe el no. de parte"
                                            name="noParte"
                                            defaultValue={formData.noParte}
                                            required
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="formGridPorcentajescrap">
                                        <Form.Label>
                                            Porcentaje scrap (%)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            placeholder="Escribe el porcentaje"
                                            name="porcentajeScrap"
                                            defaultValue={formData.porcentajeScrap}
                                            required
                                        />
                                    </Form.Group>
                                </Row>

                                {/* pesoPiezas y pesoColada */}
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridDescripcion">
                                        <Form.Label>
                                            Descripcion
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Escribe la descripcion"
                                            name="descripcion"
                                            defaultValue={formData.descripcion}
                                        />
                                    </Form.Group>
                                    
                                    <Form.Group as={Col} controlId="formGridPorcentajeMolido">
                                        <Form.Label>
                                            Porcentaje de molido (%)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.00000000000001"
                                            min="0"
                                            placeholder="Escribe el porcentaje"
                                            name="porcentajeMolido"
                                            defaultValue={formData.porcentajeMolido}
                                            required
                                        />
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
                                                {!loading ? "Actualizar" : <Spinner animation="border" />}
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

export default ModificaProductos;
