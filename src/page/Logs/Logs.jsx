import { useState, useEffect, Suspense } from 'react';
import {Alert, Button, Col, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import { totalLogs, listarLogsPaginacion } from "../../api/logsGenerales";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import ListLogs from "../../components/Logs/ListLogs";
import moment from "moment";
import "./Logs.scss";
import {toast} from "react-toastify";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';

function Logs(props) {
    const { setRefreshCheckLogin, location, history } = props;
    
    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [noTotalLogs, setNoTotaLogs] = useState(0);
    // Para almacenar todos los log del sistema
    const [listLog, setListLog] = useState(null);

    moment.locale("es");

    useEffect(() => {
        try {
            totalLogs().then(response => {
                const { data } = response;
                setNoTotaLogs(data)
            }).catch(e => {
                // console.log(e)
                if(e.message === 'Network Error') {
                    toast.error("Conexión al servidor no disponible");
                }
            })

            if(page === 0) {
                setPage(1)
                listarLogsPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listLog && data){
                        setListLog(formatModelLogs(data));
                    } else {
                        const datosLogs = formatModelLogs(data);
                        setListLog(datosLogs)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                listarLogsPaginacion(page, rowsPerPage).then(response => {
                    const { data } = response;
                    //console.log(data)
                    if(!listLog && data){
                        setListLog(formatModelLogs(data));
                    } else {
                        const datosLogs = formatModelLogs(data);
                        setListLog(datosLogs)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        } catch (e) {
            console.log(e)
        }
    }, [location, page, rowsPerPage]);


    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                <Alert className="alertLogsSistema">
                    <Row>
                        <Col xs={12} md={8}>
                            <h1>
                                Logs del sistema
                            </h1>
                        </Col>
                        <Col xs={6} md={4}>
                        </Col>
                    </Row>
                </Alert>

                <div className="listadoLogs">
                    {
                        listLog ?
                            (
                                <>
                                    <Suspense fallback={<Spinner />}>
                                    <ListLogs
                                    listLogs={listLog}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    rowsPerPage={rowsPerPage}
                                    setRowsPerPage={setRowsPerPage}
                                    page={page}
                                    setPage={setPage}
                                    noTotalLogs={noTotalLogs}
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
                </div>

            </LayoutPrincipal>
        </>
    );
}

function formatModelLogs(data){
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        dataTemp.push({
            id: data._id,
            folio: data.folio,
            usuario: data.usuario,
            correo: data.correo,
            ip: data.ip,
            dispositivo: data.dispositivo,
            descripcion: data.descripcion,
            detalles: data.detalles,
            mensaje: data.detalles.mensaje,
            fechaCreacion: moment(data.createdAt).format('LL'),
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(Logs);
