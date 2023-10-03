<template>
    <v-app>
        <Snackbar />
        <Nuxt/>
    </v-app>
</template>

<script>
    export default {
        components: {
            Snackbar: () => import('~/components/static/Snackbar.vue')
        },
    }
</script>

<style>
html{
    overflow-y: auto !important;
}
</style>