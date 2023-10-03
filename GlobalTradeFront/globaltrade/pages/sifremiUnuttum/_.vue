<template>
    <v-row class="justify-center align-center my-0 my-sm-6">
        <v-col class="elevation-1 white bg-blured col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 px-8 py-16 rounded">
            <div v-if="tokenGecerli">
                <v-img src="/resimler/globalTradeMenuLogo.png" height="10rem" eager contain></v-img>
                <h1 class="mt-16 grey--text text--darken-3">Şifrenizi Sıfırlayın</h1>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field :rules="rules.yeniParola" v-model="user.yeniParola" label="Yeni Şifreniz" class="mt-0"
                        :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordShow ? 'text' : 'password'"
                        @click:append="passwordShow = !passwordShow" outlined></v-text-field>
                    <v-text-field :rules="rules.yeniParolaTekrar" v-model="user.yeniParolaTekrar" label="Yeni Şifrenizin Tekrarı" class="mt-0"
                        :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordShow ? 'text' : 'password'"
                        @click:append="passwordShow = !passwordShow" outlined></v-text-field>
                    <div class="d-flex">
                        <v-btn @click="sifremiSifirla()" width="100%" color="primary" class="ma-0 px-0">Şifremi Sıfırla</v-btn>
                    </div>
                </v-form>
            </div>
            <div v-else>
                <v-img src="/resimler/globalTradeMenuLogo.png" height="10rem" eager contain></v-img>
                <div class="mt-16 mx-auto text-center">
                    <h1>Geçersiz yada süresi geçmiş bağlantı isteği !</h1>
                    <v-btn class="mt-10" to="/login" color="primary" text large>Giriş Sayfasına Dön</v-btn>
                </div>
            </div>
        </v-col>
    </v-row>
</template>
<script>
export default {
    layout: 'login',
    name:'SifremiSifirlaPage',
    auth:false,
    data() {
        return {
            user:{yeniParola:'',yeniParolaTekrar:''},
            tokenGecerli:false,
            passwordShow:false,
            valid:false,
            result: {
                isActive: false,
                type: 'error',
                icon: 'mdi-alert',
                text: 'Hata oluştu'
            },
            rules:{
                yeniParola: [
                    v => !!v || "Yeni şifreniz boş olamaz",
                    v => (v && v.length >= 8) || "Yeni şifreniz 8 karakterden kısa olamaz.",
                ],
                yeniParolaTekrar: [
                    v => !!v || "Şifre tekrarı boş olamaz.",
                    v => (v && v.length >= 8) || "Şifre tekrarı 8 karakterden kısa olamaz.",
                    v => (v && v == this.user.yeniParola) || "Şifre tekrarı yeni şifre ile uyuşmuyor."
                ],
            }
        }
    },
    methods: {
        async sifremiSifirla(){
            await this.$refs.form.validate()
            if (this.valid) {
                try {
                    
                    await this.$axios.post(`/SifremiUnuttum/SifreGuncelle/?token=Token ${this.token}`,{
                        yeniParola:this.user.yeniParola,
                        yeniParolaTekrar:this.user.yeniParolaTekrar
                    })
                    this.$nuxt.$emit('show-alert', { text: 'Şifreniz başarıyla sıfırlandı', color: 'success' })
                    this.$router.push('/login')
                } catch (err) {
                    this.$nuxt.$emit('show-alert', { text: err.response.data.message, color: 'error' })
                }
            }
        }
    },
    async asyncData({ $axios, route }) {
        const token = encodeURIComponent(route.params?.pathMatch)
        try{
            const response = await $axios.post(`SifremiUnuttum/SifreGuncelleTokenKontrol?token=${token}`)
            return {tokenGecerli:true,token:token}
        }catch(err){
            return { tokenGecerli:false}
        }
    },
}
</script>
<style scoped>
.bg-blured {
    background: rgba(255, 255, 255, 0.438) !important;
    backdrop-filter: blur(75px);
}

@media screen and (max-width: 30rem) {
    .bg-blured {
        height: 100%;
    }
}
</style>