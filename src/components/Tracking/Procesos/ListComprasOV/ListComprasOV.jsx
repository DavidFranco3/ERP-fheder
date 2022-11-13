import { useState, useEffect } from 'react';
import moment from "moment";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {TablePagination, Typography} from "@mui/material";
import ProveedoresenCompras from "../../../Compras/ListCompras/ProveedoresenCompras";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Badge} from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";

function ListComprasOv(props) {
    const { listCompras, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalComprasOV } = props;

    moment.locale("es");

    // Para controlar la paginación
    const handleChangePage = (event, newPage) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    // Inicia configuración del cuerpo de la tabla
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = useState(false);

        return (
            <>
                {/* Inicia definición del cuerpo de la tabla principal */}
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.folio}
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {
                            row.diasCredito ?
                                (
                                    <>
                                        {row.diasCredito}
                                    </>
                                )
                                :
                                (
                                    <>
                                        No disponible
                                    </>
                                )
                        }
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.departamento}
                    </TableCell>
                    <TableCell align="center">
                        {row.proveedor ?
                            (
                                <>
                                    <ProveedoresenCompras
                                        id={row.proveedor}
                                    />
                                </>
                            )
                            :
                            (
                                "No disponible"
                            )
                        }
                    </TableCell>
                    <TableCell align="center">
                        {
                            row.fechaSolicitud ?
                                (
                                    moment(row.fechaSolicitud).format('LL')
                                )
                                :
                                (
                                    "No disponible"
                                )
                        }
                    </TableCell>
                    <TableCell align="center">
                        {
                            row.fechaEntrega ?
                                moment(row.fechaEntrega).format('LL')
                                :
                                "No disponible"
                        }
                    </TableCell>
                    <TableCell align="center">{row.productos ? row.productos.length : "No disponible"}</TableCell>
                    <TableCell align="center">
                        {row.total ? new Intl.NumberFormat('es-MX', {
                            style: "currency",
                            currency: "MXN"
                        }).format(row.total) : "No disponible"}
                        {} MXN
                    </TableCell>

                </TableRow>
                {/* Termina definición del cuerpo de la tabla principal */}

                {/* Inicio de la definición del componente desplegable */}
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Listado de productos de la orden de compra
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">#</TableCell>
                                            <TableCell align="center">Descripción</TableCell>
                                            <TableCell align="center">Cantidad</TableCell>
                                            <TableCell align="center">UM</TableCell>
                                            <TableCell align="center">Precio</TableCell>
                                            <TableCell align="center">Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.productos.map((producto, indexListProductos) => (
                                            <>
                                                <TableCell component="th" scope="row">
                                                    {indexListProductos + 1}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {producto.descripcion}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {producto.cantidad}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {producto.um}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.total ? new Intl.NumberFormat('es-MX', {
                                                        style: "currency",
                                                        currency: "MXN"
                                                    }).format(producto.precio) : "No disponible"}
                                                    MXN
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.total ? new Intl.NumberFormat('es-MX', {
                                                        style: "currency",
                                                        currency: "MXN"
                                                    }).format(producto.subtotal) : "No disponible"}
                                                    MXN
                                                </TableCell>
                                                <br />
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                {/* Termino de la definición del desplegable */}
            </>
        );
    }
    // Termina configuración del cuerpo de la tabla

    function labelDisplayRows({ from, to, count }) { return `Visualizando ${to} de ${count !== -1 ? count + " Registros" : `more than ${to}`}`; }

    return (
        <>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Folio</TableCell>
                            <TableCell>Dias de credito</TableCell>
                            <TableCell>Departamento Emisor</TableCell>
                            <TableCell align="right">Proveedor</TableCell>
                            <TableCell align="right">Fecha de solicitud</TableCell>
                            <TableCell align="right">Fecha de entrega</TableCell>
                            <TableCell align="right">Productos en la compra</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listCompras.map((compra, index) => (
                            <>
                                <Row row={compra} />
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                id="paginacion"
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={noTotalComprasOV}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage="Filas por página"
                labelDisplayedRows={labelDisplayRows}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}

export default ListComprasOv;
