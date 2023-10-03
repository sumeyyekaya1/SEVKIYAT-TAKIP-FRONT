<template>
    <v-btn v-bind="$attrs" :href="depoDetayURL" target="_blank" color="primary">DEPO RAPOR OLUŞTUR</v-btn>
</template>

<script>
    export default {
        computed:{
            depoDetayURL(){
                return `${this.$axios.defaults.baseURL}StokDetay/CreateReport/${this.depo.id}`
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
            depo:{
                type:Object,
                default:{},
                required:true
            }
        }
    }
</script>