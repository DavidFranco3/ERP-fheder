import { useState } from 'react';
import { useWizard } from "react-use-wizard";
import "./EncabezadoOV.scss";

function EncabezadoOv(props) {
    const {
        nextStep,
        previousStep,
        isLoading,
        activeStep,
        stepCount,
        isLastStep,
        isFirstStep,
    } = useWizard();

    const [steps, setSteps] = useState([
        { key: 0, label: 'Nueva Orden' },
        { key: 1, label: 'Detalles Materia Prima' },
        { key: 2, label: 'Tiempos de Espera' },
        { key: 3, label: 'Vista Previa' }
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

export default EncabezadoOv;
