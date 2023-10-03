<template>
    <div class="py-10 px-10">
        <v-row cols="12">
            <v-col class="col-12 col-md-6 col-lg-4">
                <v-card width="100%">
                    <v-card-title class="justify-center">
                        BAĞLI PROJE NO : {{ fatura?.projeNo }}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h4>Fatura No:</h4>
                                    </td>
                                    <td class="ps-4">{{ fatura?.faturaNo }}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4>Firma:</h4>
                                    </td>
                                    <td class="ps-4">{{ fatura?.cari?.ticariUnvan }}</td>
                                </tr>
                                <tr>
                                    <td >
                                        <h4>Tarih:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ new Date(fatura?.tarih)?.toLocaleString("tr") }}</td>
                                </tr>
                                <tr>
                                    <td >
                                        <h4>Toplam Tutar:</h4>
                                    </td>
                                    <td class="ps-4 ">{{ fatura?.wolvoxDovizBirimTutar?.toFixed(2) ?? 0 }} $</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="col-12 col-md-6 col-lg-8">
                <v-card width="100%">
                    <v-card-title class="justify-space-between">
                        FATURA KALEMLERİ
                    </v-card-title>
                    <v-divider class="mx-0" />

                    <v-data-table :headers="headers.faturaDetaylar" :items="getFaturaDetaylar" :search="search"
                        :loading="loading" loading-text="Yükleniyor" item-class="my-10" hide-default-footer
                        :page.sync="pagination.currentPage" :items-per-page="-1">
                    </v-data-table>
                    <div class="text-center pt-2">
                        <v-pagination v-model="pagination.currentPage" :length="getTotalPage"
                            total-visible="7"></v-pagination>
                    </div>
                </v-card>
            </v-col>
            <v-overlay :value="loading">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
        </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            search: '',
            model: { id: 0 },
            headers: {
                faturaDetaylar: [
                    { text: 'BARKOD', align: 'start', value: 'model.stok.Barkod' },
                    { text: 'STOK KODU', align: 'start', value: 'model.stok.stokKod' },
                    { text: 'STOK ADI', align: 'start', value: 'stok.stokAdi' },
                    { text: 'HİZMET ADI', align: 'start', value: 'hizmet.hizmetAdi' },
                    { text: 'MİKTAR', value: 'miktar' }
                ]
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
                faturaId: this.$route.params.id
            }
        }
    },
    created() {
        this.$store.dispatch("faturaDetay/fetchItems", this.pagination);
    },
    computed: {
        getFaturaDetaylar() {
            return this.$store.state.faturaDetay.items
        },
        getTotalPage() {
            return this.$store.state.faturaDetay.pageCount
        },
        loading() {
            return this.$store.state.faturaDetay.loading
        }
    },
    methods: {
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('faturaDetay/fetchItems', this.pagination);
        }
    },
    async asyncData({ $axios, route }) {
        const fatura = await $axios.$get('Fatura/Get/' + route.params.id)
        return { fatura: fatura.value }
    },

    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('faturaDetay/fetchItems', this.pagination);
            }
        }
    },
    mounted() {
        this.$store.dispatch(`faturaDetay/fetchItems`, this.pagination);
    }
}
</script>