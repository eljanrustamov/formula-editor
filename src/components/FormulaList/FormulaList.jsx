import "./formulaList.styles.scss";
//
import Formula from "../Formula/Formula";

const FormulaList = () => {
  const formulas = [
    {
      name: "Revenue",
      value: 0,
      date: "Mar 2024",
    },
  ];

  return (
    <div className="formula-list">
      {formulas.map((formula, index) => (
        <Formula key={index} {...formula} />
      ))}
    </div>
  );
};

export default FormulaList;
