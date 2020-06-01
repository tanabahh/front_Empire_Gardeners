import Vue from 'vue'
import Router from 'vue-router'
// import App from "./App";
import LogRegField from "./components/LogRegField";
import HomePage from "./components/HomePage";

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes:[
        {
            path: '/logReg',
            component: LogRegField
        },

        {
            path: '/',
            beforeEnter: (to, from, next) => {
                next({path: "/logReg"})
            }
        },
        {
            path: '/home',
            component: HomePage,
            beforeEnter: (to, from, next) => {
                if (sessionStorage.getItem("jwt")) next();
                else {
                    alert("Доступ неавторизованным пользователям запрещён");
                    next({path: "/logReg"});
                }
            }
        }
    ]

})