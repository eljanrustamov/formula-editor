import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
//
import { AutoComplete } from "primereact/autocomplete";
import "primereact/resources/primereact.min.css";
import { evaluate } from "mathjs";
//
import useFormulaStore from "../../store/store"; // Store'unuzun yolu
import { useQuery } from "react-query";

const fetchOptions = async () => {
  const response = await fetch(
    "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const operators = ["+", "-", "*", "(", ")", "/"];

export default function FormulaContent() {
  const {
    options,
    setOptions,
    selectedOptions,
    setSelectedOptions,
    filteredOptions,
    setFilteredOptions,
    isDropdownOpen,
    setIsDropdownOpen,
    editedTagValue,
    setEditedTagValue,
    selectedIndex,
    addSelectedOption,
    removeSelectedOption,
    setTotalValue,
  } = useFormulaStore((state) => state);
  const { data } = useQuery("datas", fetchOptions);
  const autoCompleteRef = useRef(null);

  const trimStartOnly = (str) => str.replace(/^\s+/, "");

  const onClickDropdown = (option) => {
    const customOption = { ...option, editMode: false, id: Math.random() };
    addSelectedOption(customOption);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const updateSelectedOptions = (e) => {
    let restSelectedOptions = e.value;
    setSelectedOptions(restSelectedOptions);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (data) {
      setOptions(data);
    }
  }, [data, setOptions]);

  const search = (event) => {
    let _filteredOptions;

    // close dropdown tab
    if (event.query.length < 2 && !operators.includes(event.query)) {
      setIsDropdownOpen(false);
      return;
    }

    // for +,-,/ , * (operators)
    if (operators.includes(event.query)) {
      addSelectedOption({
        name: `${event.query}`,
        category: "operator",
        value: `${event.query}`,
      });
      event.originalEvent.target.value = "";
      return;
    } else {
      // open dropdown tab
      setIsDropdownOpen(true);
      //
      _filteredOptions = options.filter((option) => {
        return option.name
          .toLowerCase()
          .startsWith(trimStartOnly(event.query).toLowerCase());
      });
      // close dropdown tab
      if (_filteredOptions.length === 0) setIsDropdownOpen(false);
      setFilteredOptions(_filteredOptions);
      listenInput(event.originalEvent);
    }
  };

  const onFocus = (e) => {
    // close dropdown tab
    if (e.target.value === "") setIsDropdownOpen(false);
  };

  const changeTagMode = (option) => {
    selectedOptions.forEach((selectedOption) => {
      if (selectedOption.id === option.id) {
        selectedOption.editMode = true;
        setEditedTagValue(option.value);
      }
    });
  };

  const changeTagValue = (editedTagValue, option) => {
    setEditedTagValue(option.value);
    selectedOptions.forEach((selectedOption) => {
      if (selectedOption.id === option.id) {
        selectedOption.value = editedTagValue;
        setEditedTagValue(editedTagValue);
      }
    });
  };

  const checkTagValue = (editedTagValue, option) => {
    let editedSelectedOptions = selectedOptions.map((selectedOption) => {
      if (selectedOption.id === option.id) {
        if (editedTagValue === "") editedTagValue = "x";
        selectedOption.value = editedTagValue;
        selectedOption.editMode = false;
      }
      return selectedOption;
    });
    setSelectedOptions(editedSelectedOptions);
  };

  const createCustomTemplate = (option) => {
    const isOperator = operators.includes(option.name);
    return isOperator ? (
      <span className="operator">{option.name}</span>
    ) : (
      <div className="custom-template tag">
        <p className="tag-name">{option.name}</p> |
        {option.editMode ? (
          <input
            className="tag-input"
            autoFocus
            value={editedTagValue}
            onChange={(e) => changeTagValue(e.target.value, option)}
            onBlur={(e) => checkTagValue(e.target.value, option)}
            onKeyDown={(e) =>
              e.code === "Enter" && checkTagValue(e.target.value, option)
            }
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button className="tag-value" onClick={() => changeTagMode(option)}>
            [{option.value}]
          </button>
        )}
        <div
          onClick={() => removeSelectedOption(option.id)}
          className="btn-close"
        >
          X
        </div>
      </div>
    );
  };
  //
  const isValidSequenceOfOptions = () => {
    let isValidSequence = true;

    for (let i = 0; i < selectedOptions.length - 1; i++) {
      const currentOption = selectedOptions[i];
      const nextOption = selectedOptions[i + 1];

      isValidSequence =
        (currentOption.category === "operator") !==
        (nextOption.category === "operator");

      if (!isValidSequence) {
        break;
      }
    }
    return isValidSequence;
  };

  const calculateFormula = () => {
    if (selectedOptions.length < 1) {
      setTotalValue(0);
      return;
    }
    if (isValidSequenceOfOptions()) {
      let selectedOptionsValues = selectedOptions.map((option) => option.value);
      let selectedOptionsValuesAsString = selectedOptionsValues.join("");
      try {
        const result = evaluate(selectedOptionsValuesAsString);
        setTotalValue(result);
      } catch (error) {
        setTotalValue("#ERROR");
      }
    } else {
      setTotalValue("#ERROR");
    }
  };

  return (
    <div className="formula-body card p-fluid">
      <AutoComplete
        field="name"
        multiple
        value={selectedOptions}
        completeMethod={search}
        onChange={updateSelectedOptions}
        forceSelection={true}
        onFocus={onFocus}
        selectedItemTemplate={(option) => createCustomTemplate(option)}
        onKeyPress={(e) => e.code === "Enter" && calculateFormula()}
        ref={autoCompleteRef}
        className="autocomplete-custom"
        onBlur={calculateFormula}
      />
      {isDropdownOpen && (
        <ul className="dropdown-custom">
          {filteredOptions.map((option, i) => (
            <li
              key={i}
              onClick={() => onClickDropdown(option)}
              className={selectedIndex === i ? "selected" : ""}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
      <button className="btn-calculate" onClick={calculateFormula}>
        Calculate
      </button>
    </div>
  );
}

FormulaContent.propTypes = {
  setTotalValue: PropTypes.func,
};
