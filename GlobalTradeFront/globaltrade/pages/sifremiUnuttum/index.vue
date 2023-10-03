<template>
    <v-row cols="12">
    <v-col class="col-12 mt-20 px-16" v-if="!isSended">
            <div class="col-12 col-xl-8 mx-auto">
                <div class="mt-6rem">
                    <v-img class="mx-auto" src="\resimler\globalTradeMenuLogo.png" width="200" aspect-ratio="1" contain eager/>
                </div>
                <div class="mt-16 mx-auto">
                    <v-form ref="sifreSifirlaForm" v-model="isValid" class="mt-4">
                        <label for="email" class="font-weight-bold">E-Posta</label>
                        <v-text-field
                            id="email"
                            placeholder="E-posta"
                            v-model="email"
                            type="email"
                            :rules="rules.eposta"
                            outlined
                            required
                        />
                        <v-btn
                            @click="sifremiUnuttumHandler"
                            class="mt-8"
                            color="primary"
                            large
                            block
                            dark
                        >Şifremi Sıfırla</v-btn>
                        <div class="text-center">
                            <v-btn to="/login" class="mx-4 my-8" color="primary" text>
                                <v-icon class="me-2">mdi-arrow-left</v-icon>
                                Giriş Ekranına Geri Dön
                            </v-btn>
                        </div>
                    </v-form>
                </div>
            </div>
        </v-col>
        <v-col class="col-12 mt-20 px-16" v-if="isSended">
            <div class="col-12 mx-auto">
                <div class="mx-auto d-flex align-center justify-center green rounded-circle icon-container">
                    <v-icon size="70" color="white">mdi-check</v-icon>
                </div>
                <div class="mt-16 mx-auto text-center">
                    <h1>E-mail adresinizin gelen kutusunu kontrol ederek şifre sıfırlama işlemine devam edebilirsiniz.</h1>
                    <v-btn class="mt-10" to="/login" color="primary" text large>Giriş Sayfasına Dön</v-btn>
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: 'SifremiUnuttumPage',
        layout: 'login',
        auth:false,
        data() {
            return {
                email:'',
                isValid: false,
                isSended:false,
                rules: {
                    eposta: [
                        v => !!v || "E-posta adresi boş kalamaz.",
                        v => /.+@.+\..+/.test(v) || "E-posta adresi geçersiz.",
                        v => (v && v.length >= 5) || "E-posta adresi en az 5 karakter uzunluğunda olmalıdır.",
                    ],
                }
            }
        },
        methods: {
            async sifremiUnuttumHandler() {
                await this.$refs.sifreSifirlaForm.validate()
                if (this.isValid) {
                    try{
                        await this.$axios.$post(`SifremiUnuttum/SifremiUnuttum?eposta=${this.email}`)
                        this.isSended = true
                    }catch(err){
                        this.isSended = false
                    }
                }
            }
        }
    }
</script>

<style scoped>
.mt-20{
    margin-top: 8rem;
}

.icon-container{
    width: 200px;
    height:200px;
}
</style>