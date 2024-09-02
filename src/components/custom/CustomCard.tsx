import { Card } from "reactstrap";

const CustomMainCard = ({ children, style, ...props }: any) => {
  return (
    <Card className="main-card-wrapper" style={style} {...props}>
      {children}
    </Card>
  );
};

export default CustomMainCard;
