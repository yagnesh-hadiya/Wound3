import { Table } from "reactstrap";
import {
  ModuleType,
  ModuleMapping,
  PermissionType,
} from "../../types/ManageStaffType";
import { capitalize } from "../../helpers";
import CustomCheckbox from "../../components/custom/CustomCheckboxBtn";

interface ModulePermissionsProps {
  lstModuleMapping: ModuleMapping[];
  setLstModuleMapping: React.Dispatch<React.SetStateAction<ModuleMapping[]>>;
  modules: ModuleType[];
}

const ModulePermissions: React.FC<ModulePermissionsProps> = ({
  lstModuleMapping,
  setLstModuleMapping,
  modules,
}) => {
  const handleCheckboxChange = (
    moduleId: number,
    permissionType: PermissionType
  ) => {
    setLstModuleMapping((prev) => {
      const moduleIndex = prev.findIndex(
        (item) => +item.moduleId === +moduleId
      );

      if (moduleIndex !== -1) {
        const updatedModule = { ...prev[moduleIndex] };

        if (permissionType === "isView") {
          const isViewSelected = !updatedModule.isView;
          if (!isViewSelected) {
            updatedModule.isAdd = false;
            updatedModule.isUpdate = false;
            updatedModule.isDelete = false;
          }
          updatedModule.isView = isViewSelected;
        } else {
          updatedModule[permissionType] = !updatedModule[permissionType];
          if (
            updatedModule.isAdd ||
            updatedModule.isUpdate ||
            updatedModule.isDelete
          ) {
            updatedModule.isView = true;
          }
        }

        const updatedList = [...prev];
        updatedList[moduleIndex] = updatedModule;
        return updatedList;
      } else {
        const newModule = {
          moduleId: +moduleId,
          moduleIdStatus: true,
          isView: permissionType === "isView" ? true : false,
          isAdd: permissionType === "isAdd" ? true : false,
          isUpdate: permissionType === "isUpdate" ? true : false,
          isDelete: permissionType === "isDelete" ? true : false,
        };

        if (newModule.isAdd || newModule.isUpdate || newModule.isDelete) {
          newModule.isView = true;
        }

        return [...prev, newModule];
      }
    });
  };

  return (
    <div className="card-body">
      <Table className="staff-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>View</th>
            <th>Add</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {modules?.map((module) => (
            <tr key={module.id}>
              <td>{capitalize(module.value)}</td>
              <td>
                <CustomCheckbox
                  onChange={() => handleCheckboxChange(module.id, "isView")}
                  checked={lstModuleMapping.some(
                    (item) => +item.moduleId === +module.id && item.isView
                  )}
                />
              </td>
              <td>
                <CustomCheckbox
                  onChange={() => handleCheckboxChange(module.id, "isAdd")}
                  checked={lstModuleMapping.some(
                    (item) => +item.moduleId === +module.id && item.isAdd
                  )}
                />
              </td>
              <td>
                <CustomCheckbox
                  onChange={() => handleCheckboxChange(module.id, "isUpdate")}
                  checked={lstModuleMapping.some(
                    (item) => +item.moduleId === +module.id && item.isUpdate
                  )}
                />
              </td>
              <td>
                <CustomCheckbox
                  onChange={() => handleCheckboxChange(module.id, "isDelete")}
                  checked={lstModuleMapping.some(
                    (item) => +item.moduleId === +module.id && item.isDelete
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ModulePermissions;
