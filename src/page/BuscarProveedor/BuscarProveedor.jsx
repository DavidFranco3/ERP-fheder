import { useState, useEffect, Suspense } from 'react';
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../utils/withRouter";
import { toast } from "react-toastify";
import BuscarClientes from '../../components/Busquedas/BuscarClientes';
import { listarProveedoresActivos } from "../../api/proveedores";
import "./BuscarProveedor.scss"
import { getTokenApi, isExpiredToken, logoutApi, getSucursal } from "../../api/auth";
import { obtenerUsuario } from "../../api/usuarios";
import Lottie from 'react-lottie-player';
import AnimacionLoading from '../../assets/json/loading.json';
import BuscarProveedores from '../../components/Busquedas/BuscarProveedores';

function BuscarProveedor(props) {
    const { setFormData, formData, setShowModal, setRefreshCheckLogin, location, history } = props;

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

    // Almacena los datos de la orden de venta
    const [listProveedores, setListProveedores] = useState(null);

    useEffect(() => {
        try {
            listarProveedoresActivos(getSucursal()).then(response => {
                const { data } = response;

                //console.log(data);

                if (!listProveedores && data) {
                    setListProveedores(formatModelProveedores(data));
                } else {
                    const datosProveedores = formatModelProveedores(data);
                    setListProveedores(datosProveedores);
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

            {
                listProveedores ?
                    (
                        <>
                            <Suspense fallback={<Spinner />}>
                                <BuscarProveedores
                                    listProveedores={listProveedores}
                                    setShowModal={setShowModal}
                                    location={location}
                                    history={history}
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                    formData={formData}
                                    setFormData={setFormData}
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

function formatModelProveedores(data) {
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            apellidos: data.apellidos,
            sucursal: data.sucursal,
            rfc: data.rfc,
            telefonoCelular: data.telefonoCelular,
            personalContacto: data.personalContacto,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            correo: data.correo,
            foto: data.foto,
            estadoProveedor: data.estadoProveedor,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default withRouter(BuscarProveedor);
