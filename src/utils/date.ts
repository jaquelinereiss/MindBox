export function formatDateInput (value: string) {
    const numberOnly = value.replace(/\D/g, "").substring(0, 8);

    if (numberOnly.length <= 2) return numberOnly;
    if (numberOnly.length <= 4) return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}`;

    return `${numberOnly.substring(0, 2)}/${numberOnly.substring(2, 4)}/${numberOnly.substring(4, 8)}`;
  };

  export function formatDeadlineToTimestamptz (input: string) {
    if (!input) return null;
    const [day, month, year] = input.split("/");
    return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
  };

  export function isValidDate (dateStr: string) {
    const [dayStr, monthStr, yearStr] = dateStr.split("/");
    if (!dayStr || !monthStr || !yearStr) return false;
    const date = new Date(+yearStr, +monthStr - 1, +dayStr);
    return (
      date.getFullYear() === +yearStr &&
      date.getMonth() === +monthStr - 1 &&
      date.getDate() === +dayStr
    );
  };