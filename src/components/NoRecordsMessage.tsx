const NoRecordsMessage = ({
  msg,
  styles,
}: {
  msg?: string;
  styles?: React.CSSProperties;
}) => {
  return (
    <p style={{marginTop:"20px", textAlign: "center", ...styles }}>
      {msg?.length ?? "There are no records to display"}
    </p>
  );
};

export default NoRecordsMessage;
