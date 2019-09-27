<template>
  <div>
    <!-- <div class="text-xs-center d-flex pb-3">
      <v-btn @click="expandAll">expand all</v-btn>
      <v-btn @click="expandNone">none</v-btn>
    </div>-->
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
                    @input="value => userTitleProxy(index, value)"
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
                  <v-radio-group v-model="host.append" row>
                    <v-radio :value="true" label="append"></v-radio>
                    <v-radio :value="false" label="overwrite"></v-radio>
                  </v-radio-group>
                </ValidationProvider>
              </v-flex>
              <v-flex xs4>
                <v-switch
                  v-model="host.hostState"
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
import { mapState, mapMutations } from "vuex";
// import { mapMultiRowFields, mapFields } from "vuex-map-fields";
import { ValidationProvider, ValidationObserver, validate } from "vee-validate";
import { get, sync } from "vuex-pathify";

export default {
  data() {
    return {
      panel: [],
      // userTitleToValidate: "",
      appendState: "",
      key: 0
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    ...mapMutations(["UPDATE_NAME", "UPDATE_HOST"]),
    expandAll() {
      this.panel = this.hosts.map((k, i) => i);
    },
    expandNone() {
      this.panel = [];
    },
    updateName(e) {
      // this.commit("UPDATE_NAME", e.target.value);
      this.UPDATE_NAME(e.target.value);
      console.log("comit updated name value");
    },
    updateUserTitle(index, value) {
      this.$store.commit("UPDATE_USER_TITLE", { index, value });
    },
    userTitleProxy(index, value) {
      // console.log(`LOG: userTitleProxy -> value`, value);
      // console.log(
      //   `LOG: userTitleProxy -> this.$refs.userTitleInput[index]`,
      //   this.$refs.userTitleInput[index]
      // );
      // this.userTitleToValidate = value;
      if (!this.$refs.userTitleInput[index]) return;
      // console.log(
      //   `LOG: userTitleProxy -> this.userTitleToValidate`,
      //   this.userTitleToValidate
      // );
      this.$refs.userTitleInput[index].validate(value).then(result => {
        if (result.valid) {
          console.log(`LOG: userTitleProxy -> result`, result);
          this.updateUserTitle(index, value);
        }
      });
    }
  },
  computed: {
    ...mapState(["options", "hosts"]),
    // ...mapMultiRowFields(["hosts"]),
    // hosts: sync("hosts"),
    // dynamicProp :sync('dynamic/:name@items[:index].value'),
    dynamicUserTitle: sync("hosts[:key].userTitle")
    // hosts: {
    //   get() {
    //     // return this.$store.getters.hosts;
    //     console.log("GETTER LOG: ", this.$store.state.hosts);
    //     return this.$store.state.hosts;
    //   },
    //   set(value) {
    //     // console.log(value);
    //     this.$store.commit("UPDATE_HOST", value);
    //   }
    // },
    // userTitleProxy: {
    //   get() {
    //     return this.userTitleToValidate;
    //   },
    //   set(value) {
    //     (this.userTitleToValidate = value),
    //       this.$refs.userTitleInput,
    //       validate(value).then(result => {
    //         if (result) this.host.userTitle = value;
    //       });
    //   }
    // }
  }
};
</script>

<style>
</style>
