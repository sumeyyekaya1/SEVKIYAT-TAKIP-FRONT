<template>
    <v-btn v-bind="$attrs" :href="sevkiyatURL" target="_blank" color="primary" :disabled="disabled">MALİYET RAPOR OLUŞTUR</v-btn>
</template>

<script>
    export default {
        computed:{
            sevkiyatURL(){
                return `${this.$axios.defaults.baseURL}Sevkiyat/CreateReportForMaliyet/${this.sevkiyatId}`
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
            sevkiyatId:{
                type:Int32Array,
                required:true
            },
            disabled:{
                type:Boolean,
                default:false
            }
        }
    }
</script>