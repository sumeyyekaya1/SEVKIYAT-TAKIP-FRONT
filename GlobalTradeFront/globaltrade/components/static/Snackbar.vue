<template>
    <v-snackbar
        timeout="2000"
        v-model="value"
        :color="color"
        multi-line
        top
    >
      <h4>{{ text }}</h4>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="value = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>
<script>
export default {
    data() {
        return {
            value: false,
            text: '',
            color: 'success',
        }
    },
    created() {
        this.$nuxt.$on('show-alert', (item) => {
                this.value = true,
                this.text = item.text,
                this.color = item.color
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('show-alert')
    },
}
</script>