<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="layout-header" elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title
          ><img
            src="~assets/logo-thermas-white.svg"
            class="responsive"
            alt="logo-image"
          />
        </q-toolbar-title>

        <div>
          <GoBack icon="arrow_back_ios" />
          <q-btn
            stretch
            flat
            :icon="'account_circle'"
            :to="{ name: 'profile' }"
          />
          <q-btn stretch flat :icon="'logout'" @click="toLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="250"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit side-menu">
        <q-list padding>
          <template v-for="link in mainSections" :key="link.key">
            <q-item
              v-if="!link.children"
              v-ripple
              clickable
              :to="link.route"
              style="align-items: center"
            >
              <q-item-section avatar>
                <q-icon
                  class="side-menu-icon"
                  size="lg"
                  :name="link.icon"
                ></q-icon>
              </q-item-section>
              <q-item-section>{{ link.title }}</q-item-section>
            </q-item>

            <q-expansion-item
              v-if="link.children"
              :content-inset-level="0.5"
              expand-icon-class="icon-lg"
              :icon="link.icon"
              :label="link.title"
            >
              <q-item
                v-for="child in link.children"
                :key="child.key"
                v-ripple
                clickable
                :to="child.route"
              >
                <q-item-section avatar>
                  <q-icon
                    class="side-menu-icon"
                    :name="child.icon"
                    size="lg"
                  ></q-icon>
                </q-item-section>
                <q-item-section>{{ child.title }}</q-item-section>
              </q-item>
            </q-expansion-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page class="q-px-lg q-py-md">
        <!-- Aquí se van a poner los componentes que devuelve router -->
        <router-view :key="route.path" />
        <div class="right-side-bar">
          <router-view :key="route.path" name="RightSideBar" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth';
import { useRoute, useRouter } from 'vue-router';
import GoBack from '../components/Buttons/GoBack.vue';
import { useAppStore } from 'stores/app';
import { storeToRefs } from 'pinia';

const { logout } = useAuthStore();
const route = useRoute();
const router = useRouter();

const { drawer } = storeToRefs(useAppStore());
const { toggleLeftDrawer } = useAppStore();

const mainSections = [
  {
    key: 'client',
    title: 'Clientes',
    icon: 'group',
    route: { name: 'clients.list' },
  },
  {
    key: 'member',
    title: 'Socios',
    icon: 'card_membership',
    route: { name: 'clients.list' },
  },
  {
    key: 'order',
    title: 'Ventas',
    icon: 'assignment',
    children: [
      {
        key: 'order-list',
        title: 'Listado',
        icon: 'list',
        route: { name: 'orders.list' },
      },
      {
        key: 'order-dashboard',
        title: 'Panel',
        icon: 'calendar_month',
        route: { name: 'orders.dashboard' },
      },
      {
        key: 'close-sale-session',
        title: 'Cierre de caja',
        icon: 'account_balance_wallet',
        route: { name: 'sale-sessions.close' },
      },
      {
        key: 'sessions-history',
        title: 'Historial de cajas',
        icon: 'history',
        route: { name: 'sale-sessions.list' },
      },
      {
        key: 'orders-approval',
        title: 'Ventas web',
        icon: 'language',
        route: { name: 'orders-approval.list' },
      },
    ],
  },
  {
    key: 'circuit-reservation',
    title: 'Circuito Termal',
    caption: 'agenda',
    icon: 'waves',
    children: [
      {
        key: 'circuit-reservation-list',
        title: 'Listado',
        caption: 'agenda',
        icon: 'list',
        route: { name: 'circuit-reservation.list' },
      },
      {
        key: 'circuit-reservation-schedule',
        title: 'Agenda de Agua',
        caption: 'agenda',
        icon: 'calendar_month',
        route: { name: 'circuit-reservation.schedule' },
      },
    ],
  },
  {
    key: 'treatment-reservation',
    title: 'Masajes y tratamientos',
    caption: 'agenda',
    icon: 'airline_seat_recline_extra',
    children: [
      {
        key: 'treatment-reservation-list',
        title: 'Listado',
        caption: 'agenda',
        icon: 'list',
        route: { name: 'treatment-reservations.list' },
      },
      {
        key: 'treatment-reservation.schedule',
        title: 'Agenda',
        caption: 'agenda',
        icon: 'calendar_month',
        route: { name: 'treatment-reservations.schedule' },
      },
      {
        key: 'treatment-reservation.employee-calendar',
        title: 'Calendario individual',
        icon: 'calendar_view_week',
        route: { name: 'treatment-reservations.by-employee' },
      },
    ],
  },
  {
    key: 'employee',
    title: 'Equipo',
    caption: 'empleados',
    icon: 'assignment_ind',
    route: { name: 'employees.list' },
  },
  {
    key: 'reports',
    title: 'Informes',
    caption: 'informes',
    icon: 'summarize',
    route: { name: 'reports.show' },
  },
  {
    key: 'params',
    title: 'Parámetros',
    caption: 'parámetros',
    icon: 'settings',
    children: [
      {
        key: 'categories',
        title: 'Categorías',
        icon: 'category',
        route: { name: 'categories.list' },
      },
      {
        key: 'products',
        title: 'Productos',
        icon: 'auto_awesome_mosaic',
        route: { name: 'products.list' },
      },
      {
        key: 'product_types',
        title: 'Tipos de productos',
        icon: 'tune',
        route: { name: 'product-types.list' },
      },
      {
        key: 'discount',
        title: 'Tipos de descuento',
        icon: 'discount',
        route: { name: 'discounts.list' },
      },
      {
        key: 'closed-hours',
        title: 'Horarios cerrados',
        icon: 'event_busy',
        route: { name: 'closed-hours.list' },
      },
      {
        key: 'gym-fee-types',
        title: 'Tipos de Cuotas',
        icon: 'request_quote',
        route: { name: 'gym-fee-types.list' },
      },
    ],
  },
  {
    key: 'user',
    title: 'Usuarios',
    icon: 'supervised_user_circle',
    route: { name: 'users.list' },
  },
];

const toLogout = async () => {
  await logout().then(() => {
    router.push('/login');
  });
};
</script>

<style lang="scss" scoped>
.layout-header {
  background-color: $dark-blue-customized;
}

header {
  padding-top: 16px;
  padding-bottom: 12px;
  border-bottom: 3px solid #e4b959;
}
.side-menu {
  padding: 28px 12px 0 16px;
}

.right-side-bar {
  background-color: rgb(137, 137, 183);
  width: 120px;
  position: absolute;
  right: 60px;
  top: 80px;
}

a.q-item {
  padding: 6px 20px;
}
</style>

<!-- TODO: este estilo global no sé si sea conveniente. Revisarlo -->
<style lang="scss"></style>
