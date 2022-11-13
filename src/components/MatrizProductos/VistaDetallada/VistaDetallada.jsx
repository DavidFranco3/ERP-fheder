import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import {listarMateriaPrima} from "../../../api/materiaPrima";
import {toast} from "react-toastify";
import {listarClientes} from "../../../api/clientes";
import {listarProveedores} from "../../../api/proveedores";
import {Alert, Button, Col, Container, Form, Image, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeftLong, faArrowLeftRotate, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import {map} from "lodash";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {obtenerMatrizProducto} from "../../../api/matrizProductos";
import LogoPDF from "../../../assets/png/pdf.png"
import Regreso from "../../../assets/png/back.png"
import "./VistaDetallada.scss";

function VistaDetallada(props) {

    // Para el enrutamiento
    const enrutamiento = useHistory();

    // Para recibir los parametros de la url
    const parametros = useParams()

    const { producto } = parametros;

    // Para la animacion del spinner
    const [loading, setLoading] = useState(false);

    // Para almacenar el listado de clientes
    const [listClientes, setListClientes] = useState(null);
    // Para almacenar el listado de materias primas
    const [listMateriasPrimas, setListMateriasPrimas] = useState(null);

    // para almacenar los datos del formulario
    const [formData, setFormData] = useState(initialFormData());

    // para almacenar el listado de porveedores
    const [listProveedores, setListProveedores] = useState(null);

    // Define el regreso hacia los productos
    const rutaRegresoProductos = () => {
        enrutamiento.push("/MatrizProductos")
    }

    const descargaPDF = () => {
        console.log("descarga pdf")
    }

    // Para guardar los datos del producto
    const [informacionProducto, setInformacionProducto] = useState(null);

    useEffect(() => {
        // Para buscar el producto en la matriz de productos
        try {
            obtenerMatrizProducto(producto).then(response => {
                const { data } = response;
                // console.log(data)
                // initialData

                if(!informacionProducto &&data) {
                    setInformacionProducto(initialData(data));
                } else {
                    const datosProductos = initialData(data);
                    setInformacionProducto(datosProductos);
                }
            }).catch(e => {
                console.log(e)
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
                // console.log(data)
                const tempClientes = []
                /*if(data){
                    map(data, (cliente, index) => {
                        //console.log(cliente.tipo)
                        if(cliente.tipo === "interno"){
                            tempClientes.push(cliente)
                        }
                    })
                    setListClientes(tempClientes)
                }*/

                if(!listClientes &&data) {
                    setListClientes(formatModelClientes(data));
                } else {
                    const datosProductos = formatModelClientes(data);
                    setListClientes(datosProductos);
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

        // Para obtener el listado de proveedores
        try {
            listarProveedores().then(response => {
                const { data } = response;
                // console.log(data)

                if(!listProveedores &&data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProductos = formatModelProveedores(data);
                    setListProveedores(datosProductos);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <>
            <LayoutPrincipal>
                <Alert>
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Características del producto
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegresoProductos()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowLeftRotate} /> Regresa a la vista de productos
                            </Button>
                        </Col>
                    </Row>
                </Alert>

                <Container fluid>
                    <Col>
                        <div className="formularioInformacionMatrizProductos">
                            <Form>

                                {
                                    informacionProducto &&
                                        (
                                            <>
                                                <div className="contenidoVistaDetallada">
                                                    <div className="encabezado">
                                                        {/* No. interno, cliente, no. parte */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridNumeroInterno">
                                                                <Form.Label>
                                                                    No. interno
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe el no. interno"
                                                                    name="noInterno"
                                                                    defaultValue={informacionProducto.noInterno}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridProveedor">
                                                                <Form.Label>
                                                                    Cliente
                                                                </Form.Label>
                                                                <Form.Control as="select"
                                                                              defaultValue={informacionProducto.cliente}
                                                                              name="cliente"

                                                                >
                                                                    <option>Elige una opción</option>
                                                                    {map(listClientes, (cliente, index) => (
                                                                        <option key={index} value={cliente?.id}>{cliente?.nombre + " " + cliente.apellidos}</option>
                                                                    ))}
                                                                </Form.Control>
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridNoParte">
                                                                <Form.Label>
                                                                    No. parte
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe el no.parte"
                                                                    name="noParte"
                                                                    defaultValue={informacionProducto.noParte}
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        {/* No. molde, cav. molde */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridNumeroMolde">
                                                                <Form.Label>
                                                                    No. molde
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe el no. de molde"
                                                                    name="noMolde"
                                                                    defaultValue={informacionProducto.noMolde}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridCAVMolde">
                                                                <Form.Label>
                                                                    CAV molde
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe el cav del molde"
                                                                    name="cavMolde"
                                                                    defaultValue={informacionProducto.cavMolde}
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        {/* Descripción */}
                                                        <Form.Group as={Col} controlId="formGridDescripciónPieza">
                                                            <Form.Label>
                                                                Descripción
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe la descripción"
                                                                name="descripcion"
                                                                defaultValue={informacionProducto.descripcion}
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                    </div>

                                                    {/* Datos de la pieza */}
                                                    <div className="datosPieza">
                                                        <div className="tituloSeccion">
                                                            <h4>
                                                                Datos de la pieza
                                                            </h4>
                                                        </div>
                                                        {/* Peso piezas, peso colada, peso total inyeccion*/}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridNumeroParte">
                                                                <Form.Label>
                                                                    Peso de la pieza
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.000001"
                                                                    min="0"
                                                                    placeholder="Escribe el peso"
                                                                    name="pesoPiezas"
                                                                    defaultValue={informacionProducto.pesoPiezas}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridPesoColada">
                                                                <Form.Label>
                                                                    Peso colada
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.000001"
                                                                    min="0"
                                                                    placeholder="Escribe el peso"
                                                                    name="pesoColada"
                                                                    defaultValue={informacionProducto.pesoColada}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridPesoTotalInyeccion">
                                                                <Form.Label>
                                                                    Peso total de inyección
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.000001"
                                                                    min="0"
                                                                    placeholder="Escribe el peso"
                                                                    name="pesoTotalInyeccion"
                                                                    defaultValue={informacionProducto.pesoTotalInyeccion}
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                        {/* porcentaje scrap, porcentaje molido*/}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridPorcentaje scrap">
                                                                <Form.Label>
                                                                    Porcentaje scrap
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.1"
                                                                    min="0"
                                                                    placeholder="Escribe el porcentaje"
                                                                    name="porcentajeScrap"
                                                                    defaultValue={informacionProducto.porcentajeScrap}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridPorcentajeMolido">
                                                                <Form.Label>
                                                                    Porcentaje de molido
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.00000000000001"
                                                                    min="0"
                                                                    placeholder="Escribe el porcentaje"
                                                                    name="porcentajeMolido"
                                                                    defaultValue={informacionProducto.porcentajeMolido}
                                                                    disabled
                                                                />
                                                            </Form.Group>
                                                        </Row>
                                                    </div>

                                                    {/* Materia prima */}
                                                    <div className="materiaPrima">
                                                        <div className="tituloSeccion">
                                                            <h4>
                                                                Materia prima
                                                            </h4>
                                                        </div>
                                                        {/* Descripción */}
                                                        <Form.Group as={Col} controlId="formGridDescripcionMateriaPrima">
                                                            <Form.Control as="select"
                                                                          defaultValue={informacionProducto.descripcionMP}
                                                                          name="descripcionMP"
                                                                          required
                                                            >
                                                                <option>Elige una opción</option>
                                                                {map(listMateriasPrimas, (materiaprima, index) => (
                                                                    <option key={index} value={materiaprima?.id === informacionProducto.descripcionMP}>{materiaprima?.descripcion}</option>
                                                                ))}
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </div>

                                                    {/* Pigmento */}
                                                    <div className="pigmentoMasterBach">
                                                        <div className="tituloSeccion">
                                                            <h4>
                                                                Pigmento / Master bach
                                                            </h4>
                                                        </div>
                                                        {/* Descripcion */}
                                                        <Form.Group as={Col} controlId="formGridDescripciónPigmento">
                                                            <Form.Label>
                                                                Descripción
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Escribe la descripción"
                                                                name="descripcionPigmento"
                                                                defaultValue={informacionProducto.descripcionPigmento}
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                        {/* Aplicacion gxkg, proveedor */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridNumeroParte">
                                                                <Form.Label>
                                                                    Aplicación G x K.G.
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.000001"
                                                                    min="0"
                                                                    placeholder="Escribe la aplicación"
                                                                    name="aplicacionGxKG"
                                                                    defaultValue={informacionProducto.aplicacionGxKG}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridProveedor">
                                                                <Form.Label>
                                                                    Proveedor
                                                                </Form.Label>
                                                                <Form.Control as="select"
                                                                              defaultValue={informacionProducto.proveedor}
                                                                              name="proveedor"
                                                                              required
                                                                >
                                                                    <option>Elige una opción</option>
                                                                    {map(listProveedores, (proveedor, index) => (
                                                                        <option key={index} value={proveedor?.id}>{proveedor?.nombre + " " + proveedor.apellidos}</option>
                                                                    ))}
                                                                </Form.Control>
                                                            </Form.Group>

                                                        </Row>
                                                        {/* Tiempo ciclo (seg), no operadores, piezas x hora, piezas x turno */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridTiempoCiclo">
                                                                <Form.Label>
                                                                    Tiempo ciclo
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.1"
                                                                    min="0"
                                                                    placeholder="Escribe el tiempo"
                                                                    name="tiempoCiclo"
                                                                    defaultValue={informacionProducto.tiempoCiclo}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridNoOperadores">
                                                                <Form.Label>
                                                                    No. de operadores
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Escribe el numero de operadores"
                                                                    name="noOperadores"
                                                                    defaultValue={informacionProducto.noOperadores}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridPiezasxHora">
                                                                <Form.Label>
                                                                    Piezas x Hora
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Escribe el numero de piezas"
                                                                    name="piezasxHora"
                                                                    defaultValue={informacionProducto.piezasxHora}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridPiezasxTurno">
                                                                <Form.Label>
                                                                    Piezas x Turno
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Escribe el numero de piezas"
                                                                    name="piezasxTurno"
                                                                    defaultValue={informacionProducto.piezasxTurno}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                        </Row>
                                                    </div>

                                                    {/* Material de empaque */}
                                                    <div className="materialEmpaque">
                                                        <div className="tituloSeccion">
                                                            <h4>
                                                                Material de empaque
                                                            </h4>
                                                        </div>
                                                        {/* Porcentaje scrap, no piezas por empaque */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridPorcentajeScrap">
                                                                <Form.Label>
                                                                    % Scrap
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    step="0.1"
                                                                    min="0"
                                                                    placeholder="Escribe el porcentaje"
                                                                    name="descripcionBolsa"
                                                                    defaultValue={informacionProducto.descripcionBolsa}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridNoPiezasEmpaque">
                                                                <Form.Label>
                                                                    No. de piezas por empaque
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe el numero de piezas"
                                                                    name="noPiezasxEmpaque"
                                                                    defaultValue={informacionProducto.noPiezasxEmpaque}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                        </Row>
                                                    </div>

                                                    {/* Opciones maquinaria */}
                                                    <div className="opcionesMaquinaria">
                                                        <div className="tituloSeccion">
                                                            <h4>
                                                                Opciones de maquina
                                                            </h4>
                                                        </div>
                                                        {/* Opcion 1, Tiempo ciclo (seg) */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridOpcion1">
                                                                <Form.Label>
                                                                    Opción 1
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe una opción"
                                                                    name="opcion1"
                                                                    defaultValue={informacionProducto.opcion1}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridTimepoCiclo1">
                                                                <Form.Label>
                                                                    Tiempo ciclo
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Escribe el tiempo de ciclo"
                                                                    name="tiempoCiclo1"
                                                                    defaultValue={informacionProducto.tiempoCiclo1}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                        </Row>
                                                        {/* Opcion 2, Tiempo ciclo (seg) */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridOpcion2">
                                                                <Form.Label>
                                                                    Opción 2
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe una opción"
                                                                    name="opcion2"
                                                                    defaultValue={informacionProducto.opcion2}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridTimepoCiclo2">
                                                                <Form.Label>
                                                                    Tiempo ciclo
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Escribe el tiempo de ciclo"
                                                                    name="tiempoCiclo2"
                                                                    defaultValue={informacionProducto.tiempoCiclo2}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                        </Row>
                                                        {/* Opcion 3, Tiempo ciclo (seg) */}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridOpcion3">
                                                                <Form.Label>
                                                                    Opción 3
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Escribe una opción"
                                                                    name="opcion3"
                                                                    defaultValue={informacionProducto.opcion3}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridTimepoCiclo3">
                                                                <Form.Label>
                                                                    Tiempo ciclo
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    placeholder="Escribe el tiempo de ciclo"
                                                                    name="tiempoCiclo3"
                                                                    defaultValue={informacionProducto.tiempoCiclo3}
                                                                    disabled
                                                                />
                                                            </Form.Group>

                                                        </Row>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                }

                                <div className="botones">
                                    <Form.Group as={Row} className="botones">
                                        <Row>
                                            <Col>
                                                <div
                                                    className="generacionPDF"
                                                >
                                                    <Image
                                                        src={LogoPDF}
                                                        className="logoPDF"
                                                        onClick={() => {
                                                            descargaPDF()
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col>
                                                <div
                                                    className="regreso"
                                                >
                                                    <Image
                                                        src={Regreso}
                                                        className="regresarVistaAnterior"
                                                        onClick={() => {
                                                            rutaRegresoProductos()
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
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
        descripcionMP: "",
        descripcionPigmento: "",
        aplicacionGxKG: "",
        proveedor: "",
        tiempoCiclo: "",
        noOperadores: "",
        piezasxHora: "",
        piezasxTurno: "",
        descripcionBolsa: "",
        noPiezasxEmpaque: "",
        opcion1: "",
        tiempoCiclo1: "",
        opcion2: "",
        tiempoCiclo2: "",
        opcion3: "",
        tiempoCiclo3: ""
    }
}

function initialData(data){
    // const { } = data.opcionMaquinaria;
    // console.log(data.opcionMaquinaria[0][1].tiempoCiclo1)

    return {
        noInterno: data.noInterno,
        cliente: data.cliente,
        noMolde: data.datosMolde.noMolde,
        cavMolde: data.datosMolde.cavMolde,
        noParte: data.noParte,
        descripcion: data.descripcion,
        pesoPiezas: data.datosPieza.pesoPiezas,
        pesoColada: data.datosPieza.pesoColada,
        pesoTotalInyeccion: data.datosPieza.pesoTotalInyeccion,
        porcentajeScrap: data.datosPieza.porcentajeScrap,
        porcentajeMolido: data.datosPieza.porcentajeMolido,
        descripcionMP: data.materiaPrima.descripcion,
        descripcionPigmento: data.pigmentoMasterBach.descripcion,
        aplicacionGxKG: data.pigmentoMasterBach.aplicacionGxKG,
        proveedor: data.pigmentoMasterBach.proveedor,
        tiempoCiclo: data.tiempoCiclo,
        noOperadores: data.noOperadores,
        piezasxHora: data.piezasxHora,
        piezasxTurno: data.piezasxTurno,
        descripcionBolsa: data.materialEmpaque.descripcionBolsa,
        noPiezasxEmpaque: data.materialEmpaque.noPiezasxEmpaque,
        opcionMaquinaria: data.opcionMaquinaria,
        opcion1: data.opcionMaquinaria[0][1].opcion1,
        tiempoCiclo1: data.opcionMaquinaria[0][1].tiempoCiclo1,
        opcion2: data.opcionMaquinaria[0][2].opcion2,
        tiempoCiclo2: data.opcionMaquinaria[0][2].tiempoCiclo2,
        opcion3: data.opcionMaquinaria[0][3].opcion3,
        tiempoCiclo3: data.opcionMaquinaria[0][3].tiempoCiclo3
    }
}

function formatModelMateriasPrimas(data){
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            descripcion: data.descripcion,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelProveedores(data){
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            telefonoCelular: data.telefonoCelular,
            telefonoFijo: data.telefonoFijo,
            rfc: data.rfc,
            correo: data.correo,
            calle: data.direccion.calle,
            numeroExterior: data.direccion.numeroExterior,
            numeroInterior: data.direccion.numeroInterior,
            colonia: data.direccion.colonia,
            estado: data.direccion.estado,
            municipio: data.direccion.municipio,
            pais: data.direccion.pais,
            razonSocial: data.razonSocial,
            leadTime: data.leadTime,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

function formatModelClientes(data){
    // console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            telefonoCelular: data.telefonoCelular,
            telefonoFijo: data.telefonoFijo,
            rfc: data.rfc,
            correo: data.correo,
            calle: data.direccion.calle,
            numeroExterior: data.direccion.numeroExterior,
            numeroInterior: data.direccion.numeroInterior,
            colonia: data.direccion.colonia,
            estado: data.direccion.estado,
            municipio: data.direccion.municipio,
            pais: data.direccion.pais,
            razonSocial: data.razonSocial,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default VistaDetallada;
