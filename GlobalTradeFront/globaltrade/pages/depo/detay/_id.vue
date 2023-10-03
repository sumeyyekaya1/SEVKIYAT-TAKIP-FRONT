<template>
    <div class="py-10 px-10">
        <v-row cols="12">
            <v-col class="col-12 col-md-6 col-lg-3">
                <v-card width="100%">
                    <v-card-title class="justify-center">
                        {{ depo?.depoAd }}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h4>Depo Adres :</h4>
                                    </td>
                                    <td class="ps-4">{{ depo?.depoAdres }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Depo İletişim :</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ depo?.depoIletisim }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Depo Yetkili :</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ depo?.depoYetkili }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <DepoRaporGoruntule :depo="depo" class="d-flex justify-center" />
                    </v-card-text>

                </v-card>
            </v-col>
            <v-col class="col-12 col-md-6 col-lg-9">
                <v-card width="100%">
                    <v-card-title class="justify-center">
                        Depoda Bulunan Stoklar
                        <v-spacer></v-spacer>
                <v-flex class="d-flex flex justify-end px-4">
                    <v-text-field v-model="search" append-icon="mdi-magnify" @keydown.enter="searchDatabase()" label="Ara"
                        placeholder="Ara" class="d-flex flex sm5" dense outlined single-line hide-details></v-text-field>
                </v-flex>
                    </v-card-title>
                    <v-divider class="mx-0" />
                    
                    <v-data-table :headers="headers.depoDetaylar" :items="getStokDetaylar" :search="search"
                        :loading="loading" loading-text="Yükleniyor" item-class="my-10" hide-default-footer
                        :page.sync="pagination.currentPage" :items-per-page="-1">
                        <template v-slot:item.eylemler="{ item }">
                            <v-icon class="mr-2" small @click="callbackFunction({ action: 'edit', item })">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click="callbackFunction({ action: 'remove', item })">
                                mdi-delete
                            </v-icon>
                        </template>
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
                depoDetaylar: [
                    { text: 'BARKOD', align: 'start', value: 'stok.barkod' },
                    { text: 'STOK KODU', align: 'start', value: 'stok.stokKod' },
                    { text: 'STOK', align: 'start', value: 'stok.stokAdi' },
                    { text: 'CARİ', value: 'cari.ticariUnvan' },
                    { text: 'CARİ KODU', value: 'cari.cariKodu' },
                    { text: 'MİKTAR', value: 'netMiktar' }
                ],
            },
            dialogs: {
                insertOrUpdate: false,
                deleteDialog: false
            },
            validations: {
                depoDetaykEkleGuncelle: false
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
                depoId: this.$route.params.id
            },
            rules: {

            }
        }
    },
    created() {
        this.$store.dispatch("stokDetay/fetchItems", this.pagination)
    },
    computed: {
        getStokDetaylar() {
            return this.$store.state.stokDetay.items
        },
        getTotalPage() {
            return this.$store.state.stokDetay.pageCount
        },
        loading() {
            return this.$store.state.stokDetay.loading
        }
    },
    methods: {
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('stokDetay/fetchItems', this.pagination);
        },
        async insertOrUpdateHandler() {
            await this.$refs.depoDetayEkleGuncelle.validate()
            if (this.validations.depoDetayEkleGuncelle) {
                await this.$store.dispatch('stokDetay/insertOrUpdateItem', this.model)
                this.model = { id: 0 }
            }
        },
        deleteHandler() {
            this.$store.dispatch('stokDetay/deleteItem', this.model)
            this.dialogs.deleteDialog = false
        },
        callbackFunction(data) {
            if (data.action == "add") {
                this.model = { id: 0, depoId: this.$route.params.id }
                this.dialogs.insertOrUpdate = true
            }
            else if (data.action == "edit") {
                this.model = JSON.parse(JSON.stringify(data.item))
                this.dialogs.insertOrUpdate = true
            }
            else {
                this.model = JSON.parse(JSON.stringify(data.item))
                this.dialogs.deleteDialog = true
            }
        },
    },
    async asyncData({ $axios, route }) {
        const depo = await $axios.$get('depo/Get/' + route.params.id)
        return { depo: depo.value }
    },

    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('stokDetay/fetchItems', this.pagination);
            }
        }
    },
        components: {
        DepoRaporGoruntule: () => import('~/components/rapor/DepoRaporGoruntule.vue')
    }

}
</script>