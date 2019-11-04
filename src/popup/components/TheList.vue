<template>
  <div>
    <v-expansion-panels v-model="panel" focusable multiple>
      <v-expansion-panel v-for="(host, index) in hosts" :key="index">
        <v-expansion-panel-header v-slot="{ open }">
          <v-layout>
            <v-fade-transition leave-absolute>
              <span v-if="open">{{ host.hostName }}{{ host.userTitle }}</span>
              <v-layout v-else>
                <v-flex sx9 ma-0 pa-0>{{ host.hostName }}</v-flex>
                <v-flex sx3 text-xs-right class="text--secondary">
                  <v-chip
                    small
                    label
                    :color="
											(host.hostState && 'green accent-4') || ''
										"
                    text-color="white"
                  >
                    {{
                    (host.hostState && "enabled") || "disabled"
                    }}
                  </v-chip>
                </v-flex>
              </v-layout>
            </v-fade-transition>
          </v-layout>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ValidationObserver>
            <v-layout justify-center row wrap>
              <v-flex xs12 mt-2>
                <ValidationProvider
                  ref="userTitleInput"
                  :rules="{ required: true }"
                  v-slot="{ errors, flags }"
                  mode="aggressive"
                >
                  <!-- <ValidationProvider
									ref="userTitleInput"
									:rules="{ required: false, regex: [ /^\S+(?: \S+)*$/, 'append' ] }"
									v-slot="{ errors, flags }"
                  >-->
                  <v-text-field
                    :value="host.userTitle"
                    @input="
											hostPropertyHandler({
												mutation: 'SET_USER_TITLE',
												value: $event,
												host
											})
										"
                    placeholder="NO TITLE SET!"
                    single-line
                    outlined
                    clearable
                    :error-messages="errors"
                  ></v-text-field>
                </ValidationProvider>
              </v-flex>
              <v-flex xs8>
                <ValidationProvider name="append">
                  <v-radio-group
                    :value="host.isAppended"
                    @change="
											hostPropertyHandler({
												mutation: 'SET_IS_APPENDED',
												value: $event,
												host
											})
										"
                    row
                  >
                    <v-radio :value="true" label="append"></v-radio>
                    <v-radio :value="false" label="overwrite"></v-radio>
                  </v-radio-group>
                </ValidationProvider>
              </v-flex>
              <v-flex xs4>
                <v-switch
                  v-model="host.hostState"
                  @change="
										hostPropertyHandler({
											mutation: 'SET_HOST_STATE',
											value: $event,
											host
										})
									"
                  :label="
										`${(host.hostState && 'enabled') || 'disabled'}`
									"
                  color="green accent-4"
                ></v-switch>
              </v-flex>
              <v-flex>{{ host.originalTabTitles }}</v-flex>
            </v-layout>
          </ValidationObserver>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import browser from "webextension-polyfill";
import { mapState, mapMutations, mapActions } from "vuex";
import { ValidationProvider, ValidationObserver, validate } from "vee-validate";

export default {
  data() {
    return {
      panel: [],
      appendState: "",
      key: 0
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  computed: {
    ...mapState({
      globals: state => state.globals.options,
      hosts: state => state.hosts.hosts
    })
  },
  methods: {
    ...mapActions({
      // setHostProperty: "hosts/setHostProperty2"
    }),
    async hostPropertyHandler(payload) {
      console.log(`LOG: hostPropertyHandler -> payload`, payload);
      // this.setHostProperty(payload);
      await this.$store.dispatch("hosts/setHostProperty", payload);
      // this.updateTabs(payload);
      browser.runtime.sendMessage({
        type: "updateTabs",
        ...payload
      });
    }
    // showEvent(event) {
    //   console.log(`LOG: showEvent -> event`, event);
    // }
    // userTitleValidationProxy(index, objectProperty, value) {
    //   if (!this.$refs.userTitleInput[index]) return;
    //   this.$refs.userTitleInput[index].validate(value).then(result => {
    //     if (result.valid) {
    //       console.log(`LOG: userTitleValidationProxy -> result`, result);
    //       this.setHostProperty(index, objectProperty, value);
    //     }
    //   });
    // }
  }
};
</script>

<style></style>
