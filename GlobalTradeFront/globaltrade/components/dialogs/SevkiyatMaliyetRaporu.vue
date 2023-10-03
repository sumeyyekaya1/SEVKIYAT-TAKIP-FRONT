<template>
    <v-dialog max-width="480" :value="value" @click:outside="$emit('update:value',false)">
        <v-card width="100%">
            <v-card-title>Proje Maliyet Raporu</v-card-title>
            <v-divider />
            <v-card-text class="pt-4">
                <v-form ref="sevkiyatMaliyetRaporu" v-model="isValid">
                    <v-autocomplete
                        :items="getSevkiyatlar"
                        v-model="model.sevkiyatId"
                        :item-text="x => `${x.projeNo} ( ${x.projeNo} )`"
                        :rules="rules.projeNo"
                        item-value="id"
                        label="Sevkiyat Projesi Seçin"
                        outlined
                        required
                    />
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="error" @click="$emit('update:value',false)">İptal</v-btn>
                <SevkiyatMaliyetGoruntule :disabled="!isValid" :sevkiyatId="model.sevkiyatId" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name:'SevkiyatMaliyetRaporu',
    created() {
        this.$store.dispatch("sevkiyat/fetchItems", this.pagination)
    },
    data(){
        return{
            isValid:false,
            model:{id:0},
            rules:{
                projeNo:[
                    v => !!v || 'Proje no boş bırakılamaz!'
                ]
            }
        }
    },
    computed:{
        getSevkiyatlar() {
            return this.$store.state.sevkiyat.items;
        },
    },
    props:{
        value:{
            type:Boolean,
            default:false
        }
    },
    components: {
        SevkiyatMaliyetGoruntule: () => import('~/components/rapor/SevkiyatMaliyetGoruntule.vue'),
    },
}
</script>