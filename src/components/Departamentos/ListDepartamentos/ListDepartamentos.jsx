import { useState, useEffect, useMemo } from 'react';
import moment from "moment";
import 'moment/locale/es';
import { useHistory } from "react-router-dom";
import styled from 'styled-components';
import {Button, Container} from "react-bootstrap";
import DataTable, { ExpanderComponentProps, createTheme } from 'react-data-table-component';
import "./ListDepartamentos.scss";
import {map} from "lodash";
import {Badge, Table} from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaDepartamentos from "../EliminacionFisica";
import ModificacionDepartamentos from "../Modificacion";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";

function ListDepartamentos(props) {
    const { listDepartamentos, setRefreshCheckLogin, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalDepartamentos } = props;

    //console.log(listDepartamentos)
    moment.locale("es");

    const enrutamiento = useHistory();

    // Para ir hacia la ruta de los departamentos
    const regresarRuta = () => {
        enrutamiento.push("/Departamentos");
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de clientes
    const eliminaDepartamentos = (content) => {
        setTitulosModal("Eliminando");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos
    const modificaDepartamentos = (content) => {
        setTitulosModal("Modificando");
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
            name: 'Última modificación',
            selector: row => moment(row.fechaActualizacion).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        }
        ,
        {
            name: 'Acciones',
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        bg="success"
                        className="editar"
                        onClick={() => {
                            modificaDepartamentos(<ModificacionDepartamentos dataDepto={row} setShowModal={setShowModal} history={history} />)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        onClick={() => {
                            eliminaDepartamentos(<EliminacionFisicaDepartamentos dataDepto={row} setShowModal={setShowModal} history={history} />)
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
            setRows(listDepartamentos);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    // Definicion de la paginacion
    const handlePageChange = (page) => {
        setPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage)
    }

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
    const ClearButton = styled(Button) ` 
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

    const TextField = styled.input ` 
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


    const filteredItems = listDepartamentos.filter(
        item => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
    );

    const  subHeaderComponentMemo = useMemo(() => {
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
                    data={filteredItems}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    paginationServer
                    paginationTotalRows={noTotalDepartamentos}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
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

export default ListDepartamentos;
