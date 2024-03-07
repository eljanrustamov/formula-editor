import "./formulaEditor.styles.scss";
import { TbSquareRoot2, TbSquareRoundedPlusFilled } from "react-icons/tb";
//
import FormulaList from "../FormulaList/FormulaList";

const FormulaEditor = () => {
  return (
    <div className="formula-editor">
      <div className="formula-header">
        <div className="container flex justify-between items-center">
          <p className="title">
            <TbSquareRoot2 size={24} />
            Formulas <span>(1)</span>
          </p>
          <button className="btn-add color-success">
            <TbSquareRoundedPlusFilled size={34} />
          </button>
        </div>
      </div>

      <FormulaList />
    </div>
  );
};

export default FormulaEditor;
