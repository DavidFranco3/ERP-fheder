import { useState, useEffect } from 'react';
import { FormCheck, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {obtenerProductoCatalogo} from "../../../../api/catalogoProductos";
import {obtenerDatosAlmacenMPFolio} from "../../../../api/almacenMP";
import "./Planeacion.scss"

function VerificacionExistencias(props) {
    const { folio, cantidadPedida } = props;

    // Para definir el enrutamiento
    const enrutamiento = useHistory();

    // Define la ruta hacia compras
    const rutaHaciaCompras = () => {
        enrutamiento.push("/Compras/AlmacenMP")
    }

    // Para validar si hay existencias
    const [hayExistencias, setHayExistencias] = useState(false);

    // Verifica si se debe realizar orden de compra de materia prima
    const [validaExistenciasMP, setValidaExistenciasMP] = useState(true);

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
                            setValidaExistenciasMP(0)
                        } else {

                            // Inicia validacion si hay suficiente mp -- varia si no se ha autorizado
                            obtenerProductoCatalogo(folio).then(response => {
                                const { data } = response;
                                //console.log(data)
                                const { datosPieza: { pesoPiezas } } = data;
                                const totalTemp = parseFloat(pesoPiezas) * parseInt(cantidadPedida)
                                const tempDiferencia = parseFloat(existenciasStock) - totalTemp
                                // Calculo si la existencia es mayor a lo que se requiere para producir
                                if(existenciasStock > totalTemp) {
                                    setValidaExistenciasMP(true)
                                } else {
                                    setValidaExistenciasMP(false)
                                }
                            }).catch(e => {
                                console.log(e)
                            })
                            // Termina calculo de la diferencia de material -- varia si no se ha autorizado
                        }
                        // setTotalStockMP(existenciasStock)
                    } else {
                        setValidaExistenciasMP(0)
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
                validaExistenciasMP ?
                    (
                        <>
                            <Badge pill bg="success">
                                Correcto
                            </Badge>
                        </>
                    )
                    :
                    (
                        <>
                            <Badge
                                pill bg="danger"
                                className="sinStockSuficiente"
                                onClick={() => {
                                    rutaHaciaCompras()
                                }}
                            >
                                No hay suficiente stock, realice orden de compra
                            </Badge>
                        </>
                    )
            }
        </>
    );
}

export default VerificacionExistencias;
