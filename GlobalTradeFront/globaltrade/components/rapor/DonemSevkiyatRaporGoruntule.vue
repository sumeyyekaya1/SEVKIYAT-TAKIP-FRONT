<template>
    <v-btn v-bind="$attrs" :href="raporTarihURL" target="_blank" color="primary" :disabled="disabled">MALİYET RAPOR OLUŞTUR</v-btn>
</template>

<script>
    export default {
        computed:{
            raporTarihURL(){
                return `${this.$axios.defaults.baseURL}Sevkiyat/CreateReportForDonem/${this.baslangicTarih}/${this.bitisTarih}`
            }
        },
        props:{
            prepIcon:{
                type:String,
                default:'mdi-eye'
            },
            text:{
                type:String,
                default:'Raporu Görüntüle'
            },
            iconOnly:{
                type:Boolean,
                default:false
            },
            baslangicTarih:{
                type:Date,

            }
            ,
            bitisTarih:{
                type:Date,
                
            },
            disabled:{
                type:Boolean,
                default:false
            }
        }
    }
</script>