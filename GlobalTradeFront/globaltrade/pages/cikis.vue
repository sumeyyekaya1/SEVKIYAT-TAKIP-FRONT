<template>
    <div class="d-flex flex-column align-center justify-center h-90">
        <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
        ></v-progress-circular>
        <h1 class="mt-2">Çıkış yapılıyor</h1>
    </div>
</template>

<script>
    export default {
        name:'LogoutPage',
        async created() {
            await this.$auth.logout()
        },
        mounted(){
            this.$router.push("/login")
        }
    }
</script>

<style scoped>
.h-90{
    height: 90vh;
}
</style>