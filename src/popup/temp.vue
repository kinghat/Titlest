<template>
  <v-expansion-panel>
    <v-expansion-panel-header v-slot="{ open }">
      <v-row no-gutters>
        <v-col cols="4">Start and end dates</v-col>
        <v-col cols="8" class="text--secondary">
          <v-fade-transition leave-absolute>
            <span v-if="open">When do you want to travel?</span>
            <v-row v-else no-gutters style="width: 100%">
              <v-col cols="6">Start date: {{ trip.start || 'Not set' }}</v-col>
              <v-col cols="6">End date: {{ trip.end || 'Not set' }}</v-col>
            </v-row>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row justify="space-around" no-gutters>
        <v-col cols="3">
          <v-menu
            ref="startMenu"
            :close-on-content-click="false"
            :return-value.sync="trip.start"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="trip.start"
                label="Start date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="$refs.startMenu.isActive = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.startMenu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="3">
          <v-menu
            ref="endMenu"
            :close-on-content-click="false"
            :return-value.sync="trip.end"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="trip.end"
                label="End date"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="$refs.endMenu.isActive = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.endMenu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {};
</script>

<style>
</style>