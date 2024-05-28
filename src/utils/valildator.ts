export const validate = (name: string, value: string): string => {
  switch (name) {
    case "text":
      if (!value) return "Required";
      if (value.length > 100) return "limit exeeded";
      break;
    case "language":
      if (!value) return "required";
      break;
    default:
      return "";
  }
  return "";
};
