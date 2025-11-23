export const breadcrumbsItems = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Server",
    path: "/server",
    children: [
      {
        label: "Server Overview",
        path: "/server/overview/:id",
      },
      {
        label: "Add Server",
        path: "/server/add",
      },
      {
        label: "Edit Server",
        path: "/server/edit/:id",
      }
    ]
  },
  {
    label: "Logs",
    path: "/logs",
    children: [
      {
        label: "Logs Overview",
        path: "/logs/overview/:id",
      },
      {
        label: "Add Logs",
        path: "/logs/add",
      },
      {
        label: "Edit Logs",
        path: "/logs/edit/:id",
      }
    ]
  },
  {
    label: "Network",
    path: "/network",
  },
  {
    label: "Master",
    children: [
      {
        label: "Users",
        path: "/users",
        children: [
          {
            label: "Add Users",
            path: "/users/add",
          },
          {
            label: "Edit Users",
            path: "/users/edit/:id",
          }
        ]
      },
      {
        label: "Roles",
        path: "/roles",
        children: [
          {
            label: "Add Roles",
            path: "/roles/add",
          },
          {
            label: "Edit Roles",
            path: "/roles/edit/:id",
          },
          {
            label: "Edit Permission",
            path: "/roles/permission/:id",
          }
        ]
      },
      {
        label: "Division",
        path: "/division",
        children: [
          {
            label: "Add Division",
            path: "/division/add",
          },
          {
            label: "Edit Division",
            path: "/division/edit/:id",
          }
        ]
      },
    ],
  },
];
