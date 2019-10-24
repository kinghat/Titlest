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
                    :color="host.hostState && 'green accent-4' || ''"
                    text-color="white"
                  >{{ host.hostState && "enabled" || "disabled" }}</v-chip>
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
                    @input="value => setHostProperty({index: index, mutation: 'SET_USER_TITLE', value})"
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
                    @change="value => setHostProperty({index: index, mutation: 'SET_IS_APPENDED', value})"
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
                  @change="setHostProperty({index: index, mutation: 'SET_HOST_STATE', value: $event})"
                  :label="`${host.hostState && 'enabled' || 'disabled' }`"
                  color="green accent-4"
                ></v-switch>
              </v-flex>
            </v-layout>
          </ValidationObserver>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
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
      setHostProperty: "hosts/setHostProperty"
    })
    // sendHostProperty(index, mutation, value) {
    //   const payload = { index, mutation, value };
    //   this.setHostProperty(...payload);
    // },
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

<style>
</style>
