<template>
    <v-btn v-bind="$attrs" :href="sevkiyatURL" target="_blank" color="primary">ÇEKİ LİSTESİ OLUŞTUR</v-btn>
</template>

<script>
    export default {
        computed:{
            sevkiyatURL(){
                return `${this.$axios.defaults.baseURL}Sevkiyat/CreateReport/${this.sevkiyat.id}`
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
            sevkiyat:{
                type:Object,
                default:{},
                required:true
            }
        }
    }
</script>