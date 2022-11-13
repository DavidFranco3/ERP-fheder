import { useState } from 'react';
import { Wizard, useWizard } from 'react-use-wizard';
import {Col, Nav, NavItem, NavLink, Row} from "reactstrap";
//import "./encabezado.scss";
import "./RegistroTiquets.scss";

function Encabezado(props) {
    const {
        nextStep,
        previousStep,
        isLoading,
        activeStep,
        stepCount,
        isLastStep,
        isFirstStep,
    } = useWizard();

    //console.log("paso activo " , activeStep)

    const [steps, setSteps] = useState([
        { key: 0, label: 'Ventas' },
        { key: 1, label: 'Compras' },
        { key: 2, label: 'Planeación' },
        { key: 3, label: 'Producción' },
        { key: 4, label: 'Almacen' },
        { key: 5, label: 'Logistica' }
    ]);

    return (
       <>
           <div className="box">
               <div className="steps">
                   <ul className="nav">
                       {steps.map((step, i) => {
                           return <li key={i} className={`${activeStep === step.key ? 'active' : ''} ${step.isDone ? 'done' : ''}`}>
                               <div><span>{step.label}</span></div>

                           </li>
                       })}
                   </ul>
               </div>
           </div>
       </>
    );
}

export default Encabezado;
