import { useState } from "react";
import { isValidDate } from "../../utils/date";

export function useItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [box, setBox] = useState<string | null>(null);
  const [subarea, setSubarea] = useState<string | null>(null);
  const [subareaOptions, setSubareaOptions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const validate = (deadline?: string,) => {setError("");

    if (!title.trim() ||!box ||!subarea ||!deadline) {
      setError("Preencha corretamente todos os campos essenciais.");

      return false;
    }

    if (!isValidDate(deadline)) {
      setError("A data informada não parece válida.");

      return false;
    }

    return true;
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setBox(null);
    setSubarea(null);
    setSubareaOptions([]);
    setError("");
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    box,
    setBox,
    subarea,
    setSubarea,
    subareaOptions,
    setSubareaOptions,
    error,
    setError,
    validate,
    reset,
  };
}