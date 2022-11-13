import { useState, useEffect } from 'react';
import { OverlayTrigger, Button, Popover, Tooltip } from "react-bootstrap";
import {obtenerProductoCatalogo} from "../../../../api/catalogoProductos";
import {obtenerDatosAlmacenMPFolio} from "../../../../api/almacenMP";

function RevisaDiferencia(props) {
    const { folio, cantidadPedida } = props;

    // Almacena la diferencia de la materia prima solicitada
    const [diferenciaMaterial, setDiferenciaMaterial] = useState(0);

    // Valida si hay existencias
    const [hayExistencias, setHayExistencias] = useState(false);

    useEffect(() => {
        try {
            obtenerProductoCatalogo(folio).then(response => {
                const { data } = response;
                // console.log(data)
                const { materiaPrima } = data;
                obtenerDatosAlmacenMPFolio(materiaPrima).then(response => {
                    const { data } = response;
                    // console.log(data)
                    if(data) {
                        setHayExistencias(true)
                        const { existenciasStock } = data;
                        if(existenciasStock === 0){
                            setDiferenciaMaterial(0)
                        } else {

                            // Inicia calculo de la diferencia de material -- varia si no se ha autorizado
                            obtenerProductoCatalogo(folio).then(response => {
                                const { data } = response;
                                //console.log(data)
                                const { datosPieza: { pesoPiezas } } = data;
                                const totalTemp = parseFloat(pesoPiezas) * parseInt(cantidadPedida)
                                const tempDiferencia = parseFloat(existenciasStock) - totalTemp
                                // console.log(tempDiferencia)
                                setDiferenciaMaterial(tempDiferencia)
                            }).catch(e => {
                                console.log(e)
                            })
                            // Termina calculo de la diferencia de material -- varia si no se ha autorizado
                        }
                        // setTotalStockMP(existenciasStock)
                    } else {
                        setDiferenciaMaterial(0)
                        setHayExistencias(false)
                    }
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    return (
        <>
            {
                hayExistencias ?
                    (
                        <>
                            {
                                Math.sign(diferenciaMaterial) < 0  ?
                                    (
                                        <>
                                            <OverlayTrigger
                                                // trigger="click"
                                                key="top"
                                                placement="top"
                                                overlay={
                                                    <Popover id="popover-positioned-top">
                                                        <Popover.Header as="h3"><strong>Advertencia!</strong></Popover.Header>
                                                        <Popover.Body>
                                                            No hay suficiente stock para producir el producto.
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <Button variant="danger">{diferenciaMaterial}</Button>
                                            </OverlayTrigger>
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <OverlayTrigger
                                                trigger="click"
                                                key="top"
                                                placement="top"
                                                overlay={
                                                    <Popover id="popover-positioned-top">
                                                        <Popover.Header as="h3"><strong>Atención!</strong></Popover.Header>
                                                        <Popover.Body>
                                                            Esperando a autorización para mandar a producción.
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <Button variant="success">{diferenciaMaterial}</Button>
                                            </OverlayTrigger>
                                        </>
                                    )
                            }
                        </>
                    )
                    :
                    (
                        <>
                            <OverlayTrigger
                                trigger="click"
                                key="top"
                                placement="top"
                                overlay={
                                    <Popover id="popover-positioned-top">
                                        <Popover.Header as="h3"><strong>Advertencia!</strong></Popover.Header>
                                        <Popover.Body>
                                            No hay suficiente stock para producir el producto.
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <Button variant="danger">{diferenciaMaterial}</Button>
                            </OverlayTrigger>
                        </>
                    )
            }
        </>
    );
}

export default RevisaDiferencia;
