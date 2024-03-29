const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'profile',
        path: '/perfil',
        component: () => import('pages/ProfileShow.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'clients.list',
        path: '/clientes',
        component: () => import('pages/Client/ClientList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'clients.show',
        path: '/clientes/:id(\\d+)',
        component: () => import('pages/Client/ShowClient.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'clients.create',
        path: '/clientes/crear',
        component: () => import('pages/Client/CreateClient.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'clients.edit',
        path: '/clientes/:id(\\d+)/editar',
        component: () => import('pages/Client/EditClient.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'orders.list',
        path: '/ventas',
        component: () => import('pages/Order/OrderList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'gym-subscriptions.create',
        path: '/asociaciones/crear',
        component: () => import('pages/GymSubscription/CreateGymSubscription.vue'),
        props: (route) => ({ clientId: route.query.clientId }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'gym-subscription-members.create',
        path: '/miembros/crear',
        component: () => import('pages/GymSubscriptionMember/CreateGymSubscriptionMember.vue'),
        props: (route) => ({ gymSubscriptionId: route.query.gymSubscriptionId }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'gym-subscription-quotes.create',
        path: '/quotas/crear',
        component: () => import('pages/GymSubscriptionQuote/CreateGymSubscriptionQuote.vue'),
        props: (route) => ({ gymSubscriptionId: route.query.gymSubscriptionId }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'orders.dashboard',
        path: '/ventas/panel',
        component: () => import('pages/Order/OrderDashboard.vue'),
        props: (route) => ({ clientId: route.query.clientId }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'sale-sessions.close',
        path: '/cerrar-caja',
        component: () => import('pages/SaleSession/CloseSession.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'sale-sessions.list',
        path: '/historico-cajas',
        component: () => import('pages/SaleSession/SaleSessionList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'sale-sessions.show',
        path: '/historico-cajas/:id(\\d+)',
        component: () => import('pages/SaleSession/ShowSaleSession.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'orders.show',
        path: '/ventas/:id(\\d+)',
        component: () => import('pages/Order/OrderSummary.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'circuit-reservation.list',
        path: '/reservas-circuito',
        component: () =>
          import('pages/CircuitReservation/CircuitReservationList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'circuit-reservation.schedule',
        path: '/reservas-circuito/agenda',
        component: () =>
          import('pages/CircuitReservation/CircuitReservationSchedule.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'circuit-reservations.edit',
        path: '/reservas-circuitos/:id(\\d+)/editar',
        component: () =>
          import('pages/CircuitReservation/EditCircuitReservation.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'treatment-reservations.list',
        path: '/reservas-tratamientos',
        component: () =>
          import('pages/TreatmentReservation/TreatmentReservationList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'treatment-reservations.schedule',
        path: '/reservas-tratamientos/agenda',
        component: () =>
          import('pages/TreatmentReservation/TreatmentReservationSchedule.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'treatment-reservations.edit',
        path: '/reservas-tratamientos/:id(\\d+)/editar',
        component: () =>
          import('pages/TreatmentReservation/EditTreatmentReservation.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'treatment-reservations.show',
        path: '/reservas-tratamientos/:id(\\d+)',
        component: () =>
          import('pages/TreatmentReservation/TreatmentReservationShow.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'treatment-reservations.by-employee',
        path: '/reservas-tratamientos/especialista/:id(\\d+)?',
        component: () =>
          import('pages/TreatmentReservation/EmployeeSchedule.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'treatment-reservations.edit',
        path: '/reservas-tratamientos/:id(\\d+)/editar',
        component: () =>
          import('pages/TreatmentReservation/EditTreatmentReservation.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'products.list',
        path: '/productos',
        component: () => import('pages/Product/ProductList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'products.create',
        path: '/productos/crear',
        component: () => import('pages/Product/CreateProduct.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'products.edit',
        path: '/productos/:id(\\d+)/editar',
        component: () => import('pages/Product/EditProduct.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'orders-approval.list',
        path: '/ventas-por-aprobar',
        component: () => import('pages/OrdersApproval/OrdersApprovalList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employees.list',
        path: '/empleados',
        component: () => import('pages/Employee/EmployeesList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employees.create',
        path: '/empleados/crear',
        component: () => import('pages/Employee/CreateEmployee.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employees.edit',
        path: '/empleados/:id(\\d+)/editar',
        component: () => import('pages/Employee/EditEmployee.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employees.show',
        path: '/empleados/:id(\\d+)',
        component: () => import('pages/Employee/EmployeeShow.vue'),
        // components: {
        // default: () => import("pages/Employee/EmployeeShow.vue"),
        // RightSideBar: () => import("pages/Employee/EmployeeShow.vue"),
        // },
        props: (route) => ({ id: parseInt(route.params.id) }),
        // beforeEnter(to, from) {
        //     const availableEmployeeIds = [1, 2];
        //     if (!availableEmployeeIds.includes(parseInt(to.params.id))) return {
        //         name: 'NotFound',
        //         //para mantener la url que no existe en el navegador
        //         //catchAll es lo que se define dentro del route NotFound
        //         params: { catchAll: to.path.split('/').slice(1) },
        //         query: to.query,
        //         hash: to.hash
        //     }
        // },
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employeesTimeOff.create',
        path: '/empleados/:employee(\\d+)/empleados-disponibilidad/crear',
        component: () => import('pages/EmployeeTimeOff/CreateEmployeeTimeOff.vue'),
        props: (route) => ({
          employee: parseInt(route.params.employee),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employeesTimeOff.edit',
        path: '/empleados-disponibilidad/:id(\\d+)/editar',
        component: () => import('pages/EmployeeTimeOff/EditEmployeeTimeOff.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'employeesOrder.create',
        path: '/order-empleados/:date(\\d+)/orden',
        component: () => import('pages/EmployeeOrder/CreateEmployeeOrder.vue'),
        props: (route) => ({
          date: route.params.date,
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'reports.show',
        path: '/reportes',
        component: () => import('pages/Report/ShowReportPanel.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'calendar.view',
        path: '/agenda',
        component: () => import('pages/CalendarView.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'product-types.list',
        path: '/parametros/tipos-de-productos',
        component: () => import('pages/ProductType/ProductTypeList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'product-types.edit',
        path: '/parametros/tipos-de-productos/:id(\\d+)/editar',
        component: () => import('pages/ProductType/EditProductType.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'product-types.create',
        path: '/parametros/tipos-de-productos/crear',
        component: () => import('pages/ProductType/CreateProductType.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'discounts.list',
        path: '/parametros/descuentos',
        component: () => import('pages/Discount/DiscountList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'discounts.edit',
        path: '/parametros/descuentos/:id(\\d+)/editar',
        component: () => import('pages/Discount/EditDiscount.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'discount.create',
        path: '/parametros/descuentos/crear',
        component: () => import('pages/Discount/CreateDiscount.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'closed-hours.list',
        path: '/parametros/horarios-cerrados',
        component: () => import('pages/ClosedHour/ClosedHourList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'closed-hours.manage',
        path: '/parametros/horarios-cerrados/gestionar',
        component: () => import('pages/ClosedHour/ManageClosedHours.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'users.list',
        path: '/usuarios',
        component: () => import('pages/User/UserList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'users.create',
        path: '/usuarios/crear',
        component: () => import('pages/User/CreateUser.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'users.edit',
        path: '/usuarios/:id(\\d+)/editar',
        component: () => import('pages/User/EditUser.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'gym-fee-types.list',
        path: '/parametros/tipos-de-cuotas',
        component: () => import('pages/GymFeeType/GymFeeTypeList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'gym-fee-types.edit',
        path: '/parametros/tipos-de-cuotas/:id(\\d+)/editar',
        component: () => import('pages/GymFeeType/EditGymFeeType.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'gym-fee-types.create',
        path: '/parametros/tipos-de-cuotas/crear',
        component: () => import('pages/GymFeeType/CreateGymFeeType.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'categories.list',
        path: '/parametros/categorias',
        component: () => import('pages/Category/CategoryList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'categories.edit',
        path: '/parametros/categorias/:id(\\d+)/editar',
        component: () => import('pages/Category/EditCategory.vue'),
        props: (route) => ({
          id: parseInt(route.params.id),
        }),
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'categories.create',
        path: '/parametros/categorias/crear',
        component: () => import('pages/Category/CreateCategory.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
