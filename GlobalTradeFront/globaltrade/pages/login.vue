<template>
    <div class="d-flex h-100">
        <v-col class="d-none d-md-flex flex-column col-md-6 pa-16">
            <h1 class="white--text text-h4">Tüm Teknoloji Fasoncu Takip Sistemi</h1>
            <v-img class="mx-auto" src="/resimler/transparan-logo.png" width="100%" max-width="800" :aspect-ratio="16/9" contain />
        </v-col>
        <v-col class="d-flex justify-center align-center col-12 col-md-6 px-4 px-sm-16">
            <div class="col-12 col-xl-8 mx-auto">
                <div class="mx-auto">
                    <h2 class="primary--text text-h5 font-weight-bold d-none d-sm-block">Hoşgeldiniz</h2>
                    <v-form ref="login" v-model="isValid" class="mt-4">
                        <label for="email" class="font-weight-bold">E-Posta</label>
                        <v-text-field
                            id="email"
                            v-model="login.email"
                            placeholder="E-posta"
                            type="email"
                            :rules="rules.eposta"
                            outlined
                            required
                        />
                        <label for="password" class="font-weight-bold">Şifre</label>
                        <v-text-field
                            id="password"
                            v-model="login.parola"
                            placeholder="Şifre"
                            type="password"
                            :rules="rules.sifre"
                            @keydown.enter="loginHandler"
                            outlined
                            required
                            hide-details
                        ></v-text-field>
                        <div class="d-flex">
                            <v-spacer />
                            <nuxt-link class="text-decoration-none mt-4" to="/sifremiUnuttum">Şifrenizi mi unuttunuz ?</nuxt-link>
                        </div>
                        <v-btn
                            @click="loginHandler"
                            :loading="loading"
                            class="mt-8"
                            color="primary"
                            large
                            block
                            dark
                        >Giriş Yap</v-btn>
                    </v-form>
                    <div class="text-center pt-10">
                        <a class="text-decoration-none text-center " href="https://tumteknoloji.com.tr/" target="_blank">©TÜM Teknoloji Üretim Merkezi - {{new Date().getFullYear()  }}</a>
                    </div>
                    
                </div>
                <div>

                </div>

            </div>
        </v-col>
    </div>
</template>

<script>
    export default {
        name:'LoginPage',
        layout:'login',
        data(){
            return {
                login:{
                    email:'',
                    parola:'',
                    beniHatirla:false,
                },
                rules: {
                    eposta: [
                        v => !!v || "E-posta adresi boş kalamaz.",
                        v => /.+@.+\..+/.test(v) || "E-posta adresi geçersiz.",
                        v => (v && v.length >= 5) || "E-posta adresi en az 5 karakter uzunluğunda olmalıdır.",
                    ],
                    sifre: [
                        v => !!v || "Şifre boş kalamaz",
                    ],
                },
                isValid:false,
                loading:false
            }
        },
        methods:{
            async loginHandler(){
                await this.$refs.login.validate()
                if (this.isValid) {
                    try {
                        this.loading = true
                        await this.$auth.loginWith('kullanici', {
                            data: this.login
                        })
                        this.$nuxt.$emit('show-alert', { text: 'Başarıyla giriş yapıldı', color: 'success' })
                        this.$router.push('/')
                    }catch (err) {
                        this.$nuxt.$emit('show-alert', { text: 'Kullanıcı adı veya şifre yanlış !', color: 'error' })
                    }
                    this.loading = false
                }
            },
        }
    }
</script>

<style scoped>
.h-100{
    height: 100svh;
    max-height: 100svh;
}

@media screen and (min-width: 420px) {
    .mt-6rem{
        margin-top: 6rem !important;
    }
}
</style>