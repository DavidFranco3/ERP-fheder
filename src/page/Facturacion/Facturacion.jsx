import { useState, useEffect } from 'react';
import { Alert, Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getTokenApi, isExpiredToken, logoutApi } from "../../api/auth";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import BasicModal from "../../components/Modal/BasicModal";
import ListFactura from "../../components/Facturacion/ListFacturacion";
import RegistroFactura from "../../components/Facturacion/Registro";

function Facturacion(props) {
    const { setRefreshCheckLogin, location, history } = props;

    // Para controlar la paginación
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [noTotalFacturacion, setNoTotalFacturacion] = useState(0);

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para un nuevo registro de archivos pdf y xml
    const nuevoRegistro = (content) => {
        setTitulosModal("Nuevo registro");
        setContentModal(content);
        setShowModal(true);
    }

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

    // Para almacenar el listado de facturas cargadas al sistema
    const [listFacturas, setListFacturas] = useState(null);

    return (
        <>
            <Alert>
                <Row>
                    <Col xs={12} md={8}>
                        <h1>
                            Facturación
                        </h1>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button
                            className="btnRegistroVentas"
                            title="Registrar una nueva factura"
                            onClick={() => {
                                nuevoRegistro(
                                    <RegistroFactura
                                        setShowModal={setShowModal}
                                        location={location}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            <FontAwesomeIcon icon={faCirclePlus} /> Registrar
                        </Button>
                    </Col>
                </Row>
            </Alert>

            <ListFactura
                listFacturas={listFacturas}
                location={location}
                history={history}
                setRefreshCheckLogin={setRefreshCheckLogin}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                page={page}
                setPage={setPage}
                noTotalFacturacion={noTotalFacturacion}
            />
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default withRouter(Facturacion);
