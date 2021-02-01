import { FuseLoadable } from "@fuse";

export const StoreAccessConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/developer/store/access",
      component: FuseLoadable({
        loader: () => import("./StoreAccess"),
      }),
    },
  ],
};
