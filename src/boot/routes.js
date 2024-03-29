import { boot } from "quasar/wrappers";
import { api } from "./axios";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, store, urlPath, redirect }) => {
//   router.beforeEach((to, from, next) => {
    // const token = localStorage.getItem("token");
    // if (!token && !urlPath.startsWith('/login')) {
    //   redirect("/login");
    // }

    // api.defaults.headers.common.Authorization = "Bearer " + token.access_token;

//     next();
//   });
});
