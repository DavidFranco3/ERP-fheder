import { useState, useEffect } from 'react';
import {Alert, Button, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";
import { useHistory, withRouter } from "react-router-dom";
import LayoutPrincipal from "../../layout/layoutPrincipal";
import BasicModal from "../../components/Modal/BasicModal";
import RegistroNuevaEtiqueta from "../../components/StatusMaterial/RegistraEtiqueta";

function StatusMaterial(props) {
    const { setRefreshCheckLogin, location, history } = props;
    
    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para el registro en el almacen de mp
    const nuevaEtiqueta = (content) => {
        setTitulosModal("Nuevo etiqueta");
        setContentModal(content);
        setShowModal(true);
    }

     // Para definir el enrutamiento
     const enrutamiento = useHistory()

     const rutaRegreso = () => {
        enrutamiento.push("/DashboardCalidad")
    }

    return (
        <>
            <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
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
                                onClick={() => {
                                    nuevaEtiqueta(
                                        <RegistroNuevaEtiqueta
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faCirclePlus} /> Nueva etiqueta
                            </Button>
                            <Button
                                className="btnRegistroVentas"
                                onClick={() => {
                                    rutaRegreso()
                                }}
                            >
                                <FontAwesomeIcon icon={faArrowCircleLeft} /> Regresar
                            </Button>
                        </Col>
                    </Row>
                </Alert>
                
                <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                    {contentModal}
                </BasicModal>
                
            </LayoutPrincipal>
        </>
    );
}

export default withRouter(StatusMaterial);
