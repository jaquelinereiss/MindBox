import { useState } from "react";
import { formatDeadlineToTimestamptz, isValidDate } from "../../utils/date";

export function useBox() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [error, setError] = useState("");
  
  const validate = () => {
    setError("");

    if (!title.trim() || !description.trim() || !area) {
      setError("Preencha corretamente todos os campos essenciais.");

      return false;
    }

    if (deadline &&!isValidDate(deadline)) {
      setError("A data informada não parece válida.");

      return false;
    }

    return true;
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setArea(null);
    setError("");
  };

  const getFormattedDeadline = (): | string | undefined => {
    if (!deadline) { return undefined; }

    return (
      formatDeadlineToTimestamptz(deadline,) ?? undefined
    );
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    deadline,
    setDeadline,
    area,
    setArea,
    error,
    setError,
    validate,
    reset,
    getFormattedDeadline,
  };
}