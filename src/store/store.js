// store.js
import { create } from "zustand";

const useFormulaStore = create((set) => ({
  //
  isCollapseOpen: false,
  totalValue: 0,
  //
  selectedOptions: [],
  filteredOptions: [],
  isDropdownOpen: false,
  editedTagValue: "x",
  selectedIndex: -1,
  options: [],

  toggleCollapse: () =>
    set((state) => ({ isCollapseOpen: !state.isCollapseOpen })),
  setTotalValue: (value) => set({ totalValue: value }),

  //
  setOptions: (options) => set(() => ({ options })),
  setSelectedOptions: (options) => set(() => ({ selectedOptions: options })),
  setFilteredOptions: (options) => set(() => ({ filteredOptions: options })),
  setIsDropdownOpen: (isOpen) => set(() => ({ isDropdownOpen: isOpen })),
  setEditedTagValue: (value) => set(() => ({ editedTagValue: value })),
  setSelectedIndex: (index) => set(() => ({ selectedIndex: index })),

  //
  addSelectedOption: (option) =>
    set((state) => ({
      selectedOptions: [...state.selectedOptions, option],
    })),

  removeSelectedOption: (optionId) =>
    set((state) => ({
      selectedOptions: state.selectedOptions.filter(
        (option) => option.id !== optionId
      ),
    })),
  updateSelectedOption: (optionId, newValue) =>
    set((state) => ({
      selectedOptions: state.selectedOptions.map((option) =>
        option.id === optionId ? { ...option, value: newValue } : option
      ),
    })),
}));

export default useFormulaStore;
