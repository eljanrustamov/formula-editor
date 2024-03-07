import { useState } from "react";
import "./formula.styles.scss";
import PropTypes from "prop-types";
import { TbCaretRightFilled, TbInfoCircleFilled, TbDots } from "react-icons/tb";
import { BiSolidPencil } from "react-icons/bi";
import { Collapse } from "react-collapse";
import Popup from "reactjs-popup";
import FormulaContent from "../FormulaContent/FormulaContent";
import useFormulaStore from "../../store/store"; // Store yolu güncellenebilir

const Formula = ({ name, date }) => {
  // const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  // const [totalValue, setTotalValue] = useState(0);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const { isCollapseOpen, toggleCollapse, totalValue } = useFormulaStore(
    (state) => state
  );

  return (
    <div className="formula-item">
      <div className="formula-header">
        <button onClick={toggleCollapse}>
          <TbCaretRightFilled
            size={25}
            className={`caret ${isCollapseOpen ? "rotate-90" : ""}`}
          />
        </button>
        <div className="formula-title">{name}</div>

        <Popup
          trigger={
            <button onClick={() => setIsTooltipOpen(!isTooltipOpen)}>
              <TbInfoCircleFilled size={25} />
            </button>
          }
          position="top right"
          arrow={false}
          closeOnDocumentClick
        >
          <div className="tooltip-info">
            <p>Some tooltip text here</p>
            <button onClick={() => setIsTooltipOpen(false)}>
              <BiSolidPencil />
            </button>
          </div>
        </Popup>

        <button>
          <TbDots size={25} />
        </button>
      </div>

      <div
        className={`formula-value-container ${
          isCollapseOpen ? "rounded-none" : "rounded"
        }`}
      >
        <p className="value">{totalValue}</p>
        <p className="date">{date}</p>
      </div>

      <Collapse isOpened={isCollapseOpen}>
        <FormulaContent />
      </Collapse>
    </div>
  );
};

Formula.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  category: PropTypes.string,
  id: PropTypes.number,
  date: PropTypes.string,
};

export default Formula;
