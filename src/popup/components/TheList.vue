<template>
  <v-expansion-panels v-model="panel" focusable multiple>
    <v-expansion-panel v-for="(host, index) in hosts" :key="index">
      <v-expansion-panel-header v-slot="{ open }">
        <v-row no-gutters>
          <v-col cols="4"></v-col>
          <v-col cols="8"></v-col>
          <v-fade-transition leave-absolute>
            <span v-if="open">{{ host.hostName }}{{ host.userTitle }}</span>
            <v-row v-else no-gutters>
              <v-col cols="9">{{ host.hostName }}</v-col>
              <v-col cols="3">
                <v-chip
                  small
                  label
                  :color="(host.hostState && 'green accent-4') || ''"
                >{{ (host.hostState && "enabled") || "disabled" }}</v-chip>
              </v-col>
            </v-row>
          </v-fade-transition>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="pt-6">
        <ValidationObserver>
          <v-row no-gutters justify="center" align="center">
            <v-col cols="12">
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
												host,
											})
										"
                  placeholder="NO TITLE SET!"
                  dense
                  hide-details
                  single-line
                  outlined
                  clearable
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" align="space-around">
            <ValidationProvider name="append">
              <v-radio-group
                :value="host.isAppended"
                @change="
											hostPropertyHandler({
												mutation: 'SET_IS_APPENDED',
												value: $event,
												host,
											})
										"
                row
                dense
                hide-details
              >
                <v-radio :value="true" label="append"></v-radio>
                <v-radio :value="false" label="overwrite"></v-radio>
              </v-radio-group>
            </ValidationProvider>
            <v-switch
              v-model="host.hostState"
              @change="
										hostPropertyHandler({
											mutation: 'SET_HOST_STATE',
											value: $event,
											host,
										})
									"
              :label="`${(host.hostState && 'enabled') || 'disabled'}`"
              color="green accent-4"
              hide-details
              dense
            ></v-switch>
          </v-row>
        </ValidationObserver>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import browser from "webextension-polyfill";
import { mapState, mapMutations, mapActions } from "vuex";
import { ValidationProvider, ValidationObserver, validate } from "vee-validate";

export default {
  name: "TheList",
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
