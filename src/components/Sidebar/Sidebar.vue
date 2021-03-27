<template>
  <b-collapse class="sidebar-collapse" id="sidebar-collapse" :visible="sidebarOpened">
  <nav
    :class="{sidebar: true}"
  >
    <header class="logo">
      <router-link to="">BrAT <span class="fw-semi-bold">Speedruns</span></router-link>
    </header>
    <ul class="nav">
      <NavLink
        :activeItem="activeItem"
        header="Dashboard"
        link="/app/dashboard"
        iconName="flaticon-home"
        index="dashboard"
        isHeader
      />
      <NavLink v-if="this.permissions.includes('Admin')"
        :activeItem="activeItem"
        header="Usuários"
        link="/app/admin"
        iconName="flaticon-home"
        index="admin"
        isHeader
      />
      <NavLink v-if="this.permissions.includes('Admin')"
        :activeItem="activeItem"
        header="Eventos"
        link="/app/events"
        iconName="flaticon-home"
        index="events"
        isHeader
      />
      <NavLink v-if="this.permissions.includes('Admin')"
        :activeItem="activeItem"
        header="Jogos"
        link="/app/games"
        iconName="flaticon-home"
        index="games"
        isHeader
      />
      <NavLink v-if="this.permissions.includes('Admin')"
        :activeItem="activeItem"
        header="Extras"
        link="/app/extras"
        iconName="flaticon-home"
        index="extras"
        isHeader
      />
      <NavLink
        :activeItem="activeItem"
        header="Enviar uma run"
        link="/app/submitrun"
        iconName="flaticon-home"
        index="submitrun"
        isHeader
      />
    </ul>
  </nav>
  </b-collapse>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NavLink from './NavLink/NavLink';

export default {
  name: 'Sidebar',
  components: { NavLink },
  data() {
    return {
      alerts: [
        {
          id: 0,
          title: 'Sales Report',
          value: 15,
          footer: 'Calculating x-axis bias... 65%',
          color: 'primary',
        },
        {
          id: 1,
          title: 'Personal Responsibility',
          value: 20,
          footer: 'Provide required notes',
          color: 'danger',
        },
      ],
    };
  },
  methods: {
    ...mapActions('layout', ['changeSidebarActive', 'switchSidebar']),
    setActiveByRoute() {
      const paths = this.$route.fullPath.split('/');
      paths.pop();
      this.changeSidebarActive(paths.join('/'));
    },
  },
  created() {
    this.setActiveByRoute();
  },
  computed: {
    ...mapState('layout', {
      sidebarOpened: state => !state.sidebarClose,
      activeItem: state => state.sidebarActiveElement,
      permissions: state => state.permissions,
    }),
  },
};
</script>

<!-- Sidebar styles should be scoped -->
<style src="./Sidebar.scss" lang="scss" scoped/>
