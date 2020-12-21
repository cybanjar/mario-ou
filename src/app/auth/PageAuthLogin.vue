<template>
  <q-layout>
    <q-page-container>
      <q-page
        class="window-height window-width row justify-center items-center"
      >
        <div class="column">
          <div class="row">
            <q-card>
              <q-card-section>
                <div style="text-align: center;">
                  <q-img
                    class="logovhp mt-5 mb-5 mx-auto"
                    style="height: 100px; max-width: 100px;"
                    src="../../assets/logo_e1VHP.svg"
                  />
                  <h6 class="font-weight-bold">Visual Hotel Program</h6>
                </div>
                <q-form class="q-gutter-md" @submit="doLogin">
                  <q-input
                    dense
                    square
                    filled
                    clearable
                    v-model="userName"
                    type="email"
                    placeholder="Username"
                    required
                  />
                  <q-input
                    dense
                    square
                    filled
                    clearable
                    v-model="userPswd"
                    type="password"
                    placeholder="Password"
                    required
                  />
                  <label class="inline-block q-mb-xs">
                    Language
                  </label>
                  <q-select
                    :options="locales"
                    v-model="countryId"
                    :loading="isFetchingLocales"
                    dense
                    outlined
                    class="q-mt-none"
                  />
                  <q-card-actions class="q-px-md">
                    <q-btn
                      unelevated
                      color="light-blue-7"
                      size="md"
                      class="full-width"
                      label="Login"
                      type="submit"
                      :disable="isFetchingLocales || isLoggingIn"
                      :loading="isLoggingIn"
                    />
                  </q-card-actions>
                </q-form>
              </q-card-section>
              <q-card-section class="text-center q-pa-none" />
            </q-card>
          </div>
          <p class="text-black-6 text-center q-mt-md">
            Copyright by PT. Supranusa Sindata
          </p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { store } from '~/store';

interface State {
  userName: string | null;
  userPswd: string | null;
  countryId: any;
  locales: any[];
  isFetchingLocales: boolean;
  isLoggingIn: boolean;
}

export default defineComponent({
  setup(_, { root: { $api } }) {
    const state = reactive<State>({
      userName: null,
      userPswd: null,
      countryId: null,
      locales: [],
      isFetchingLocales: true,
      isLoggingIn: false,
    });

    // fetch locales
    (async () => {
      const resLangs = await $api.auth.getLanguages();
      state.locales = resLangs.map((item) => ({
        label: item['country-name'],
        value: item['country-id'],
      }));
      state.countryId = state.locales[0];
      state.isFetchingLocales = false;
    })();

    async function doLogin() {
      state.isLoggingIn = true;

      await store.dispatch.auth.doLogin({
        countryId: state.countryId.value,
        userName: state.userName,
        userPswd: state.userPswd,
      });

      state.isLoggingIn = false;
    }

    return {
      ...toRefs(state),
      doLogin,
    };
  },
});
</script>

<style scoped>
.q-card {
  width: 360px;
  background-color: rgba(255, 255, 255, 0.4);
}

.q-page {
  background: lightblue url('../../assets/sign-in-bg.jpg') no-repeat fixed;
}
</style>
