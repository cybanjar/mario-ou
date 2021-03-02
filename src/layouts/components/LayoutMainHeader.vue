<template>
  <q-header elevated>
    <q-toolbar class="bg-secondary justify-between">
      <svg
        v-if="!currentModule"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        viewBox="0 0 50 50"
        width="44"
        height="44"
        class="q-ml-md"
      >
        <path fill="none" d="M0 0h50v50H0z" />
        <g fill="#fefefe">
          <path
            d="M35 15v4h7c3 0 3 4 0 4h-7v12h5v-8h5c6-1 6-12-1-12h-9zM6 15l4 14 4-14h6l-7 20H7L0 15zM21 15h5v8h7v5h-7v7h-5z"
          />
        </g>
      </svg>

      <router-link
        class="link-back flex items-center cursor-pointer"
        v-else
        :to="$route.meta.pathParent"
      >
        <q-icon name="mdi-arrow-left" size="26px" />
        <span class="text-weight-bold q-ml-md">
          {{ $route.meta.name }}
        </span>
      </router-link>

      <div class="text-weight-bold">
        {{ user.htlName }} - {{ user.htlCity }}
      </div>

      <div>
        <q-btn
          flat
          :label="user.userName"
          icon="mdi-account"
          style="text-transform: none"
        >
          <q-menu>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>Change Password</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="doLogout">Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <template v-if="currentModule">
          <q-btn
            v-if="
              currentModule.reports[0].keyword !== 'Income Audit' &&
              currentModule.reports[0].keyword !== 'Night Audit'
            "
            flat
            round
            icon="mdi-apps"
          >
            <q-menu
              v-if="currentModule.reports[0].keyword !== 'Inventory'"
              content-class="menu-submodule"
              :offset="[0, 5]"
              auto-close
            >
              <ul class="q-pa-md">
                <li
                  v-for="menuItem in currentModule.subModules"
                  :key="menuItem.name"
                >
                  <router-link
                    :to="menuItem.path"
                    class="column items-center justify-center text-center"
                  >
                    <img
                      :src="require(`~/app/icons/${menuItem.icon}.svg`)"
                      width="50"
                      height="50"
                    />

                    {{ menuItem.name }}
                  </router-link>
                </li>
              </ul>
            </q-menu>
            <q-menu v-else content-class="menu-submodule" :offset="[0, 5]">
              <q-list style="min-width: 150px">
                <q-item
                  v-for="menu in item(currentModule)"
                  clickable
                  :key="menu.name"
                >
                  <div
                    style="marginLeft: 10px; fontSize: 15px; fontWeight: 'bold"
                  >
                    {{ menu.name }}
                  </div>
                  <q-menu
                    auto-close
                    anchor="top right"
                    self="top left"
                    content-class="menu-submodule"
                    :offset="[0, 5]"
                    fit
                  >
                    <ul class="q-pa-md">
                      <li v-for="xi in menu.item" :key="xi.name">
                        <router-link
                          :to="xi.path"
                          class="column items-center justify-center text-center full-height"
                        >
                          <img
                            :src="require(`~/app/icons/${xi.icon}.svg`)"
                            width="50"
                            height="50"
                          />
                          {{ xi.name }}
                        </router-link>
                      </li>
                    </ul>
                  </q-menu>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { store } from '~/store';
import { item } from '~/app/modules/INV/LayoutMainHeader';

export default defineComponent({
  setup() {
    const user: any = store.state.auth.user || {};
    const currentModule = computed(() => store.state.layout.currentModule);
    return {
      user,
      doLogout: store.dispatch.auth.doLogout,
      currentModule,
      item,
    };
  },
});
</script>

<style lang="scss" scoped>
.link-back {
  text-decoration: none;
  color: #fff;
}

.menu-submodule {
  margin-top: 10px;
  li {
    list-style: none;
    cursor: pointer;
    width: 88px;
    height: 90px;
    margin: 5px;

    &:hover {
      box-shadow: 0px 0px 1px #848282;
      border-radius: 2px;
    }

    a {
      text-decoration: none;
      font-size: 11px;
      line-height: normal;
      color: rgba(0, 0, 0, 0.65);

      img {
        margin-bottom: 4px;
      }
    }
  }

  ul {
    max-width: 320px;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
  }
}
</style>
