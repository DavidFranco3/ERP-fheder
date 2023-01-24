import { useState, useEffect, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import { Button, Container } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import "./ListUnidadesMedida.scss";
import { Badge } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaUnidadesMedida from "../EliminacionFisica";
import ModificacionUnidadesMedida from "../Modificacion";
import EliminacionLogicaUnidadesMedida from '../EliminacionLogica';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListUnidadesMedida(props) {
    const { listUM, setRefreshCheckLogin, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    const enrutamiento = useHistory();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de clientes
    const eliminaUM = (content) => {
        setTitulosModal("Eliminando");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos
    const modificaUM = (content) => {
        setTitulosModal("Modificando");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de clientes
    const eliminaLogicaUM = (content) => {
        setTitulosModal("Deshabilitando unidad de medida");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de clientes
    const habilitaUM = (content) => {
        setTitulosModal("Habilitando unidad de medida");
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Estado',
            sortable: false,
            center: true,
            reorder: false,
            selector: row => row.estadoUM === "true" ?
                (
                    <>
                        <Badge
                            bg="success" 
                            className="editar"
                            title="Deshabilitar UM"
                            onClick={() => {
                                eliminaLogicaUM(
                                    <EliminacionLogicaUnidadesMedida
                                        dataUM={row}
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            Activo
                        </Badge>
                    </>
                )
                :
                (
                    <>
                        <Badge
                            bg="danger"
                            className="eliminar"
                            title="Habilitar cliente"
                            onClick={() => {
                                habilitaUM(
                                    <EliminacionLogicaUnidadesMedida
                                        dataUM={row}
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            Inactivo
                        </Badge>
                    </>
                )
        },
        {
            name: 'Última modificación',
            selector: row => dayjs(row.fechaActualizacion).format("LL"),
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
                        className="editar"
                        title="Modificar"
                        onClick={() => {
                            modificaUM(
                                <ModificacionUnidadesMedida
                                    dataUM={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaUM(
                                <EliminacionFisicaUnidadesMedida
                                    dataUM={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />)
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
            setRows(listUM);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    // Procesa documento para descargar en csv
    function convertArrayOfObjectsToCSV(array) {
        let result;
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(filteredItems[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
        const filename = 'Datos.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Descargar CSV</Button>;

    const descargaCSV = useMemo(() => <Export onExport={() => downloadCSV(filteredItems)} />, []);

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


    const filteredItems = listUM.filter(
        item => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToogle(!resetPaginationToogle);
                setFilterText('');
            }
        };

        return (
            <>
                <TextField
                    id="search"
                    type="text"
                    placeholder="Busqueda por nombre"
                    aria-label="Search Input"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
                <ClearButton type="button" onClick={handleClear}>
                    X
                </ClearButton>
            </>
        );
    }, [filterText, resetPaginationToogle]);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    //actions={descargaCSV}
                    //subHeader
                    //subHeaderComponent={subHeaderComponentMemo}
                    data={listUM}
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

export default ListUnidadesMedida;
