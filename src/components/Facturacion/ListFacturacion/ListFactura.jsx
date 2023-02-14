import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { TablePagination } from "@mui/material";
import BasicModal from "../../Modal/BasicModal";

function ListFactura(props) {
    const { listFacturas, location, history, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalFacturacion } = props;

    // Para controlar la paginacion
    const handleChangePage = (event, newPage) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // define el uso del enrutamiento
    const enrutamiento = useNavigate()

    // Para el modal de eliminación de facturas
    const eliminacionFacturas = (content) => {
        setTitulosModal("Eliminando factura");
        setContentModal(content);
        setShowModal(true);
    }

    // Para editar la carga de facturas
    const modificarFacturas = (content) => {
        setTitulosModal("Modificando carga de facturas");
        setContentModal(content);
        setShowModal(true);
    }

    // Inicia definicion del cuerpo de la tabla
    // Termina definicion del cuerpo de la tabla

    function labelDisplayRows({ from, to, count }) { return `Visualizando ${to} de ${count !== -1 ? count + " Registros" : `more than ${to}`}`; }

    return (
        <>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Documento</TableCell>
                            <TableCell align="right">Nombre del cliente</TableCell>
                            <TableCell align="right">Fecha</TableCell>
                            <TableCell align="right">Importe</TableCell>
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Cuerpo de la tabla */}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                id="paginacion"
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={noTotalFacturacion}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={labelDisplayRows}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListFactura;
