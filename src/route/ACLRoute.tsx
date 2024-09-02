import { checkAclPermission } from "../helpers";
import PageNotFound from "../pages/pageNotFound/PageNotFound";
import { ACLRouteProps } from "../types/AuthTypes";

const ACLRoute: React.FC<ACLRouteProps> = ({
  children,
  module,
  submodule,
  action,
}) => {
  const allow = checkAclPermission(module, submodule, action);
  if (allow) {
    return <>{children}</>;
  }

  return <PageNotFound />;
};

export default ACLRoute;
