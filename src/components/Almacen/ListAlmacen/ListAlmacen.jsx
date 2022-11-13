import {useState} from 'react';
import LayoutPrincipal from "../../../layout/layoutPrincipal";
import {useHistory} from "react-router-dom";
import moment from "moment";
import {Badge, Table} from "react-bootstrap";
import {map} from "lodash";
import EliminacionLogicaUsuarios from "../../Usuarios/EliminacionLogica";
import EliminacionFisicaUsuarios from "../../Usuarios/EliminacionFisica";
import BasicModal from "../../Modal/BasicModal";

function ListAlmacen(props) {
    const { setRefreshCheckLogin, listArticulosAlmacen, history } = props;

    const enrutamiento = useHistory();

    //console.log(listUsuarios)

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de usuarios
    const eliminaUsuarios = (content) => {
        setTitulosModal("Eliminando el cliente");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de datos
    const modificaUsuarios = (id) => {
        enrutamiento.push(`/ModificacionAlmacen/${id}`);
    }

    return (
        <>
            <Table striped bordered hover responsive="xl" className="responsive-table">
                <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Orden Producción</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Ingreso</th>
                    <th scope="col">Modificación</th>
                    <th scope="col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {map(listArticulosAlmacen, (usuario, index) => (
                    <tr key={index}>
                        <th scope="row">
                            {usuario?.nombre}
                        </th>
                        <td data-title="Tipo">{usuario?.curp}</td>
                        <td data-title="Orden Producción">{usuario?.nss}</td>
                        <td data-title="Precio">{usuario?.rfc}</td>
                        <td data-title="Ingreso">{usuario?.telefonoCelular}</td>
                        <td data-title="Fecha modificación">
                            {moment(usuario?.fechaActualizacion).subtract(10, 'days').calendar() === "21/12/0000"
                                ? ("Nunca")
                                :
                                (
                                    moment(usuario?.fechaActualizacion).calendar()
                                )
                            }
                        </td>
                        <td data-title="Acciones"
                            className="acciones">
                            <>
                                <Badge
                                    bg="success"
                                    className="editar"
                                    onClick={() => {
                                        modificaUsuarios(usuario?.id)
                                    }}
                                >
                                    Editar
                                </Badge>
                                <Badge
                                    bg="danger"
                                    className="eliminar"
                                    onClick={() => {
                                        const dataUsuario = {
                                            id: usuario?.id,
                                            nombre: usuario?.nombre,
                                            apellidos: usuario?.apellidos,
                                            estadoUsuario: usuario?.estadoUsuario
                                        }
                                        eliminaUsuarios(<EliminacionFisicaUsuarios dataUsuario={dataUsuario} setShowModal={setShowModal} history={history} />)
                                    }}
                                >
                                    Eliminar
                                </Badge>
                            </>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListAlmacen;
