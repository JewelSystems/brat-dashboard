import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/components/Layout/Layout';
import Dashboard from '@/pages/Visits/Visits';
import Admin from '@/pages/Admin/Admin';
import Login from '@/pages/Login/Login';
import UserView from '@/pages/UserView/UserView';
import UpdateUser from '@/pages/UpdateUser/UpdateUser';
import Signup from '@/pages/Signup/Signup';
import RunSubmit from '@/pages/RunSubmit/RunSubmit';
import Events from '@/pages/Events/Events';
import Games from '@/pages/Games/Games';
import Extras from '@/pages/Extras/Extras';
import ErrorPage from '@/pages/Error/Error';

import store from './store/layout'

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/app',
      name: 'Layout',
      component: Layout,
      meta:{
        requiresAuth: true,
      },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'admin',
          name: 'Admin',
          component: Admin,
          meta:{
            permission: 'Admin',
          }
        },
        {
          path: 'user/:id',
          name: 'UserView',
          component: UserView,
          meta:{
            permission: 'Admin',
          }
        },
        {
          path: 'update-user/:id',
          name: 'UpdateUser',
          component: UpdateUser,
        },
        {
          path: 'submitrun',
          name: 'Submitrun',
          component: RunSubmit,
        },
        {
          path: 'events',
          name: 'Events',
          component: Events,
          meta:{
            permission: 'Admin',
          }
        },
        {
          path: 'games',
          name: 'Games',
          component: Games,
          meta:{
            permission: 'Admin',
          }
        },
        {
          path: 'extras',
          name: 'Extras',
          component: Extras,
          meta:{
            permission: 'Admin',
          }
        },
      ],
    },
    {
      path: '*',
      name: 'ErrorPage',
      component: ErrorPage,
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authenticated =  store.state.authenticate;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredPermission = to.meta.permission;

  if(requiresAuth && !authenticated) next('Login');

  else if(!requiresAuth && authenticated) next('Dashboard');

  else if(requiredPermission){
    if(store.state.permissions.includes(requiredPermission)){
      next();
    }else{
      //console.log('você não tem a permissão necessária');
      next('dashboard');
    }
  }
  else next();
})

export default router;