import { useState } from "react";

export function useSelectModal() {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [onSelect, setOnSelect] =useState<(value: string) => void>(() => () => {});
  const closeModal = () => {setVisible(false)};

  const openModal = ( modalOptions: string[], callback: (value: string) => void ) => {
    setOptions(modalOptions);

    setOnSelect(() => (value: string) => {
      callback(value);
      closeModal();
    });

    setVisible(true);
  };

  return {
    visible,
    options,
    onSelect,
    openModal,
    closeModal,
  };
}