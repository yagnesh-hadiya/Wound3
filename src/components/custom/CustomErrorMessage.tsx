import { CustomErrorMessageProps } from "../../types/CustomElementTypes";

const CustomErrorMessage = ({
  error,
  className,
  style = {},
  ...props
}: CustomErrorMessageProps) => {
  if (!error) return null;

  const message = error.message || error.label?.message || error.value?.message;

  return (
    <p className={`drp-down-msg mb-0 ${className}`} style={style} {...props}>
      {message}
    </p>
  );
};

export default CustomErrorMessage;
