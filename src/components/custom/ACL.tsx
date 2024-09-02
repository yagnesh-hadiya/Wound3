import { cloneElement } from "react";
import { checkAclPermission } from "../../helpers";
import { ACLProps } from "../../types/AuthTypes";

const ACL: React.FC<ACLProps> = ({ children, module, submodule, action }) => {
  const allow = checkAclPermission(module, submodule, action);
  if (allow) {
    return cloneElement(children, { allow: true });
  }

  return cloneElement(children, { allow: false });
};

export default ACL;
