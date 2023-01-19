import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import { listarStatusMaterial } from "../../api/statusMaterial";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { toast } from "react-toastify";
import ListCalidad from '../../components/StatusMaterial/ListStatusCalidad';

function StatusMaterial(props) {
    const { setRefreshCheckLogin, location, history } = props;

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

    // Para definir el enrutamiento
    const enrutamiento = useHistory()

    const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
    }

    const rutaRegistro = () => {
        enrutamiento.push("/RegistroStatusMaterial")
    }

    // Para almacenar la lista de pedidos de venta
    const [listStatus, setListStatus] = useState(null);

    useEffect(() => {
        try {
            listarStatusMaterial(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listStatus && data) {
                    setListStatus(formatModelStatusMaterial(data));
                } else {
                    const datosStatus = formatModelStatusMaterial(data);
                    setListStatus(datosStatus);
                }
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, [location]);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Identificación de status del material
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva etiqueta de status de material"
                            onClick={() => {
                                rutaRegistro()
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                        <Button
                            className="btnRegistroVentas"
                            title="Regresar al menú calidad"
                            onClick={() => {
                                rutaRegreso()
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            {
                listStatus ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <ListCalidad
                                    listStatus={listStatus}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                />
                            </Suspense>
                        </>
                    )
                    :
                    (
                        <>
                            <Lottie loop={true} play={true} animationData={AnimacionLoading} />
                        </>
                    )
            }
        </>
    );
}

function formatModelStatusMaterial(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            item: data.item,
            folio: data.folio,
            sucursal: data.sucursal,
            folioInspeccion: data.folioInspeccion,
            propiedadInspeccion: data.propiedadInspeccion,
            cantidadInspeccion: data.cantidadInspeccion,
            fechaInspeccion: data.fechaInspeccion,
            tipoMaterialInspeccion: data.tipoMaterialInspeccion,
            recibioInspeccion: data.recibioInspeccion,
            loteInspeccion: data.loteInspeccion,
            nombreInspeccion: data.nombreInspeccion,
            resultadoInspeccion: data.resultadoInspeccion,
            etiqueta: data.etiqueta,
            fecha: data.fecha,
            descripcionMaterial: data.descripcionMaterial,
            rechazo: data.rechazo,
            nombre: data.nombre,
            auditor: data.auditor,
            supervisor: data.supervisor,
            descripcionDefecto: data.descripcionDefecto,
            cantidad: data.cantidad,
            tipoRechazo: data.tipoRechazo,
            correccion: data.correccion,
            clienteProveedor: data.clienteProveedor,
            lote: data.lote,
            recibio: data.recibio,
            turno: data.turno,
            propiedad: data.propiedad,
            liberacion: data.liberacion,
            descripcion: data.descripcion,
            comentarios: data.comentarios,
            condicion: data.condicion,
            observaciones: data.observaciones,
            estado: data.estado,
            fechaRegistro: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(StatusMaterial);
