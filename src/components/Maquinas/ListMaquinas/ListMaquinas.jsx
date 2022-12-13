import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
// Inician importaciones para la tabla
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
//import EliminacionFisicaEtiquetasPT from "../EliminacionFisica";
//import ModificaIdentificacionPT from '../ModificaIdentificacionPT';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { map } from "lodash";
import EliminacionFisicaMaquinas from '../EliminacionFisica';
import ModificaMaquinas from '../ModificaMaquinas';
import EliminacionLogicaMaquinas from '../EliminacionLogica';

function ListMaquinas(props) {
    const { setRefreshCheckLogin, listMaquinas, history, location } = props;
    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useHistory();

    //Para la eliminacion de compras
    const eliminacionMaquina = (content) => {
        setTitulosModal("Eliminando maquina");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de compras
    const modifcaMaquina = (content) => {
        setTitulosModal("Modificando etiqueta PT");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de compras
    const cambiaEstadoMaquina = (content) => {
        setTitulosModal("Cambiando estado de la maquina");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de compras
    const modificacionCompraAlmacen = (folio) => {
        enrutamiento.push(`/Compras/AlmacenMP/Modificacion/${folio}`)
    }

    const modificacionCompra = (folio) => {
        enrutamiento.push(`/ModificacionCompras/${folio}`)
    }

    const columns = [
        {
            name: "Numero de maquina",
            selector: row => row.numeroMaquina,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Marca",
            selector: row => row.marca,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tonelaje",
            selector: row => row.tonelaje,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Lugar donde se encuentra",
            selector: row => row.lugar,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Status",
            selector: row => row.status === "true" ?
                (
                    <>
                        <Badge
                            bg="success" className="activo"
                            onClick={() => {
                                cambiaEstadoMaquina(
                                    <EliminacionLogicaMaquinas
                                        data={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            Activa
                        </Badge>
                    </>
                )
                :
                (
                    <>
                        <Badge
                            bg="danger" className="obsoleto"
                            onClick={() => {
                                cambiaEstadoMaquina(
                                    <EliminacionLogicaMaquinas
                                        data={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            Fuera de servicio
                        </Badge>
                    </>
                ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de registro",
            selector: row => moment(row.fechaRegistro).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ultima modificacion",
            selector: row => moment(row.fechaActualizacion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            center: true,
            reorder: true,
            selector: row => (
                <>
                    <Badge
                        bg="info"
                        title="Generar PDF"
                        className="evaluacionProveedor"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="success"
                        title="Modificar"
                        className="eliminarProveedor"
                        onClick={() => {
                            modifcaMaquina(
                                <ModificaMaquinas
                                    data={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />
                            )
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>

                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminarProveedor"
                        onClick={() => {
                            eliminacionMaquina(
                                <EliminacionFisicaMaquinas
                                    data={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />
                            )
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                    </Badge>
                </>
            )
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listMaquinas);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    // Defino barra de busqueda
    const ClearButton = styled(Button)` 
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 34px;
        width: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const TextField = styled.input` 
        height: 32px;
        border-radius: 3px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid #e5e5e5;
        padding: 0 32px 0 16px;
      &:hover {
        cursor: pointer;
      }
    `;

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    // actions={descargaCSV}
                    data={listMaquinas}
                    //expandableRows
                    //expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListMaquinas;
