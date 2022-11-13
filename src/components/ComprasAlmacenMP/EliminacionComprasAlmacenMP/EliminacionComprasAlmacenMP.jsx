import { useState, useEffect } from 'react';
import {eliminaOrdenesCompra} from "../../../api/compras";
import {toast} from "react-toastify";
import {LogsInformativos} from "../../Logs/LogsSistema/LogsSistema";
import queryString from "query-string";
import {Button, Form, Spinner} from "react-bootstrap";

function EliminacionComprasAlmacenMp(props) {
    const { data, setShowModal, history } = props;
    const { id, folio } = data;

    //console.log(data)

    // Para controlar la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            eliminaOrdenesCompra(id).then(response => {
                const { data } = response;
                // console.log(data)
                toast.success(data.mensaje)
                LogsInformativos(`Se ha eliminado la compra con el folio ${folio}`, data)
                setShowModal(false);
                setLoading(false);
                history.push({
                    search: queryString.stringify(""),
                });
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>

                <Form.Group className="btnEliminar">
                    <Button variant="primary" type="submit">
                        {!loading ? "¿Desea eliminar la compra?" : <Spinner animation="border" />}
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default EliminacionComprasAlmacenMp;
