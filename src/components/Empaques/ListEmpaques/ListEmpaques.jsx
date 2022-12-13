import { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../Modal/BasicModal";
import { Badge, Container } from "react-bootstrap";
import EliminaEmpaque from '../EliminaEmpaque';
import ModificaEmpaque from '../ModificaEmpaque';
import { estilos } from "../../../utils/tableStyled";

function ListEmpaques(props) {
    const { setRefreshCheckLogin, listEmpaques, history, location } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de materiales
    const eliminaEmpaque = (content) => {
        setTitulosModal("Eliminando el empaque");
        setContentModal(content);
        setShowModal(true);
    }

    //Para editar la informacion del material
    const actualizaEmpaque = (content) => {
        setTitulosModal("Actualizando datos");
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "UM",
            selector: row => row.um,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Precio",
            selector: row => (
                <>
                    {row.precio ? new Intl.NumberFormat('es-MX', {
                        style: "currency",
                        currency: "MXN"
                    }).format(row.precio) : "No disponible"}
                    { } MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Acciones',
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        bg="success"
                        title="Modificar"
                        className="editar"
                        onClick={() => {
                            actualizaEmpaque(
                                <ModificaEmpaque
                                    dataEmpaque={row}
                                    location={location}
                                    history={history}
                                    setShowModal={setShowModal}
                                />
                            )
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaEmpaque(
                                <EliminaEmpaque
                                    dataEmpaque={row}
                                    location={location}
                                    history={history}
                                    setShowModal={setShowModal}
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
            setRows(listEmpaques);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={listEmpaques}
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

export default ListEmpaques;
