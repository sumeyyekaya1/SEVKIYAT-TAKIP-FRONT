<template>
    <v-dialog max-width="480" :value="value" @click:outside="$emit('update:value',false)">
        <v-card width="100%">
            <v-card-title>Dönemsel Maliyet Raporu</v-card-title>
            <v-divider />
            <v-card-text class="pt-4">
                <v-form ref="donemselMaliyetRaporu" v-model="isValid">
                    <v-text-field type="date" label="RAPOR BAŞLANGIÇ TARİHİ SEÇİN" v-model="model.baslangicTarih" :rules="rules.baslangic" outlined />
                    <v-text-field type="date" label="RAPOR BİTİŞ TARİHİ SEÇİN" v-model="model.bitisTarih" :rules="rules.bitis" outlined />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="error" @click="$emit('update:value',false)">İptal</v-btn>
                <DonemSevkiyatRaporGoruntule :disabled="!isValid" :baslangicTarih="model.baslangicTarih" :bitisTarih="model.bitisTarih" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name:'DonemselMaliyetRaporu',
    data(){
        return{
            isValid:false,
            model:{id:0},
            rules: {
                baslangic: [
                    v => !!v || 'Başlangıç tarihi boş bırakılamaz!'
                ],
                bitis: [
                    v => !!v || 'Bitiş tarihi boş bırakılamaz!'
                ]

            }
        }
    },
    props:{
        value:{
            type:Boolean,
            default:false
        }
    },
    components: {
        DonemSevkiyatRaporGoruntule: () => import('~/components/rapor/DonemSevkiyatRaporGoruntule.vue'),
    },
}
</script>