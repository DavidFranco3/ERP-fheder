import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
// Inician importaciones para la tabla
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
import EliminacionFisicaEtiquetasPT from "../EliminacionFisica";
import ModificaIdentificacionPT from '../ModificaIdentificacionPT';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { map } from "lodash";

function ListEtiquetasPT(props) {
    const { setRefreshCheckLogin, listEtiquetas, history, location } = props;
    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useHistory();

    //Para la eliminacion de compras
    const eliminacionEtiqueta = (content) => {
        setTitulosModal("Eliminando Etiqueta PT");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de compras
    const modifcaEtiqueta = (content) => {
        setTitulosModal("Modificando etiqueta PT");
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
            name: "ITEM",
            selector: row => row.item,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha",
            selector: row => moment(row.fecha).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Descripción",
            selector: row => row.descripcion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. de parte",
            selector: row => row.noParte,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Orden de produdcción",
            selector: row => row.noOrden,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Turno",
            selector: row => row.turno,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Operador",
            selector: row => row.operador,
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
                            modifcaEtiqueta(
                                <ModificaIdentificacionPT
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
                            eliminacionEtiqueta(
                                <EliminacionFisicaEtiquetasPT
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
            setRows(listEtiquetas);
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
                    data={listEtiquetas}
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

export default ListEtiquetasPT;
