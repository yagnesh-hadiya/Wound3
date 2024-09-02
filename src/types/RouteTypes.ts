import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";

export interface PrivateRouteProps {
  children: ReactNode;
}

export interface RouteType {
  element:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | null
    | undefined;
  needsAuth: boolean;
}
export interface Permission {
  moduleId: string;
  moduleName: string;
  moduleIdStatus: boolean;
  isAdd: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
}

export interface ACLContextType {
  permissions: Permission[];
  checkPermission: (moduleName: string) => boolean;
}
