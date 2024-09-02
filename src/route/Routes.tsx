import { lazy } from "react";
import PageNotFound from "../pages/pageNotFound/PageNotFound";
import ACLRoute from "./ACLRoute";
const Login = lazy(() => import("../pages/login/Login"));
const Layout = lazy(() => import("../components/layouts/Layout"));
const ForgotPassword = lazy(
  () => import("../pages/forgotPassword/ForgotPassword")
);
const OtpVerify = lazy(() => import("../pages/otpVerify/OtpVerify"));
const ResetPassword = lazy(
  () => import("../pages/resetPassword/ResetPassword")
);
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ManageStaff = lazy(() => import("../pages/manageStaff/ManageStaff"));
const AddEditStaff = lazy(() => import("../pages/manageStaff/AddEditStaff"));
const ManageFacilityNetwork = lazy(
  () => import("../pages/manageFacilityNetwork/ManageFacilityNetwork")
);
const AddEditFacilityNetwork = lazy(
  () => import("../pages/manageFacilityNetwork/AddEditFacilityNetwork")
);
const ManageFacilities = lazy(
  () => import("../pages/manageFacilities/ManageFacilities")
);
const AddEditFacility = lazy(
  () => import("../pages/manageFacilities/AddEditFacility")
);
const ManageProvider = lazy(
  () => import("../pages/manageProvider/ManageProvider")
);
const AddEditProvider = lazy(
  () => import("../pages/manageProvider/AddEditProvider")
);
const ManagePatient = lazy(
  () => import("../pages/managePatient/ManagePatient")
);
const AddEditPatient = lazy(
  () => import("../pages/managePatient/AddEditPatient")
);
const PatientProfile = lazy(
  () => import("../pages/managePatient/patientProfile/PatientProfile")
);
const PatientWoundHistory = lazy(
  () =>
    import(
      "../pages/managePatient/patientProfile/woundProfile/woundHistory/PatientWoundHistory"
    )
);
const Settings = lazy(() => import("../pages/settings/Setting"));

export const routes = [
  {
    path: "/login",
    element: <Login />,
    needsAuth: false,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    needsAuth: false,
  },
  {
    path: "/otp-verify",
    element: <OtpVerify />,
    needsAuth: false,
  },
  {
    path: "/verify-link/:email/:token",
    element: <ResetPassword />,
    needsAuth: false,
  },
  {
    path: "/create-password/:email/:token",
    element: <ResetPassword />,
    needsAuth: false,
  },
  {
    path: "/",
    element: <Layout />,
    moduleName: "",
    children: [
      {
        path: "/",
        element: (
          <ACLRoute module="Dashboard" action={["GET"]} submodule={null}>
            <Dashboard />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Dashboard",
      },
      {
        path: "/manage-staff",
        element: (
          <ACLRoute module="Manage Staff" action={["GET"]} submodule={null}>
            <ManageStaff />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Staff",
      },
      {
        path: "/staff/create",
        element: (
          <ACLRoute module="Manage Staff" action={["GET"]} submodule={null}>
            <AddEditStaff />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Staff",
      },
      {
        path: "/staff/edit/:id",
        element: (
          <ACLRoute module="Manage Staff" action={["GET"]} submodule={null}>
            <AddEditStaff />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Staff",
      },
      {
        path: "/manage-facility-network",
        element: (
          <ACLRoute
            module="Manage Facility Network"
            action={["GET"]}
            submodule={null}
          >
            <ManageFacilityNetwork />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Facility Network",
      },
      {
        path: "/facility-network/create",
        element: (
          <ACLRoute
            module="Manage Facility Network"
            action={["GET"]}
            submodule={null}
          >
            <AddEditFacilityNetwork />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Facility Network",
      },
      {
        path: "/facility-network/edit/:id",
        element: (
          <ACLRoute
            module="Manage Facility Network"
            action={["GET"]}
            submodule={null}
          >
            <AddEditFacilityNetwork />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Facility Network",
      },
      {
        path: "/manage-facilities",
        element: (
          <ACLRoute
            module="Manage Facilities"
            action={["GET"]}
            submodule={null}
          >
            <ManageFacilities />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Facilities",
      },
      {
        path: "/facility/create",
        element: (
          <ACLRoute
            module="Manage Facilities"
            action={["GET"]}
            submodule={null}
          >
            <AddEditFacility />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Facilities",
      },
      {
        path: "/facility/edit/:id",
        element: (
          <ACLRoute
            module="Manage Facilities"
            action={["GET"]}
            submodule={null}
          >
            <AddEditFacility />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Facilities",
      },
      {
        path: "/manage-providers",
        element: (
          <ACLRoute module="Manage Providers" action={["GET"]} submodule={null}>
            <ManageProvider />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Providers",
      },
      {
        path: "/provider/create",
        element: (
          <ACLRoute module="Manage Providers" action={["GET"]} submodule={null}>
            <AddEditProvider />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Providers",
      },
      {
        path: "/provider/edit/:id",
        element: (
          <ACLRoute module="Manage Providers" action={["GET"]} submodule={null}>
            <AddEditProvider />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Providers",
      },
      {
        path: "/manage-patients",
        element: (
          <ACLRoute module="Manage Patients" action={["GET"]} submodule={null}>
            <ManagePatient />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Patients",
      },
      {
        path: "/patient/create",
        element: (
          <ACLRoute module="Manage Patients" action={["GET"]} submodule={null}>
            <AddEditPatient />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Patients",
      },
      {
        path: "/patient/edit/:id",
        element: (
          <ACLRoute module="Manage Patients" action={["GET"]} submodule={null}>
            <AddEditPatient />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Patients",
      },
      {
        path: "/patient/:id/profile",
        element: (
          <ACLRoute module="Manage Patients" action={["GET"]} submodule={null}>
            <PatientProfile />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Patients",
      },
      {
        path: "/patient/:id/profile/wound-history",
        element: (
          <ACLRoute module="Manage Patients" action={["GET"]} submodule={null}>
            <PatientWoundHistory />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Manage Patients",
      },
      {
        path: "/settings",
        element: (
          <ACLRoute module="Settings" action={["GET"]} submodule={null}>
            <Settings />
          </ACLRoute>
        ),
        index: false,
        needsAuth: true,
        moduleName: "Settings",
      },
    ],
    needsAuth: true,
  },
  {
    path: "*",
    element: <PageNotFound />,
    needsAuth: false,
  },
];
