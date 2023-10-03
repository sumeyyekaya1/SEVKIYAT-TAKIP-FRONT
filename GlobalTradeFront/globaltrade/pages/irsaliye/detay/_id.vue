<template>
    <div class="py-10 px-10">
        <v-row cols="12">
            <v-col class="col-12 col-md-6 col-lg-4">
                <v-card width="100%">
                    <v-card-title class="justify-center">
                        BAĞLI PROJE NO : {{ irsaliye?.projeNo }}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h4>İrsaliye No:</h4>
                                    </td>
                                    <td class="ps-4">{{ irsaliye?.irsaliyeNo }}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4>Firma:</h4>
                                    </td>
                                    <td class="ps-4">{{ irsaliye?.cari?.ticariUnvan }}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4>İrsaliye Tarih:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ irsaliye?.irsaliyeTarih }}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4>Sevkiyat Tarih:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ irsaliye?.sevkTarih }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="col-12 col-md-6 col-lg-8">
                <v-card width="100%">
                    <v-card-title class="justify-space-between">
                        İRSALİYE KALEMLERİ
                        <v-btn color="primary" @click.stop="callbackFunction({ action: 'add' })">İRSALİYE KALEM EKLE</v-btn>
                    </v-card-title>
                    <v-divider class="mx-0" />

                    <v-data-table :headers="headers.irsaliyeDetaylar" :items="getIrsaliyeDetaylar" :search="search"
                        :loading="loading" loading-text="Yükleniyor" item-class="my-10" hide-default-footer
                        :page.sync="pagination.currentPage" :items-per-page="-1">
                        <template v-slot:item.eylemler="{ item }">
                            <v-btn x-small color="warning" icon fab @click="callbackFunction({ action: 'edit', item })">
                                <v-icon> mdi-pencil </v-icon>
                            </v-btn>
                            <v-btn x-small color="warning" icon fab @click="callbackFunction({ action: 'remove', item })">
                                <v-icon> mdi-delete </v-icon>
                            </v-btn>
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

            <v-dialog v-model="dialogs.insertOrUpdate" max-width="480">
                <v-card>
                    <v-card-title class="justify-space-between">
                        <span class="text-h5">{{ model.id === 0 ? 'İrsaliye Kalem Ekle' : 'İrsaliye Kalem Güncelle'
                        }}</span>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogs.insertOrUpdate = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pt-4">

                        <v-form ref="irsaliyeDetayEkleGuncelle" v-model="validations.irsaliyeDetayEkleGuncelle"
                            lazy-validation>

                            <v-autocomplete v-model="model.stokId" :items="getStoklar"
                                :item-text="x => `${x.stokAdi} ( ${x.stokKod} )`" item-value="id" label="Stok" outlined
                                required></v-autocomplete>

                            <v-autocomplete v-model="model.hizmetId" :items="getHizmetler"
                                :item-text="x => `${x.hizmetAdi}`" item-value="id" label="Hizmet"
                                outlined required></v-autocomplete>

                            <v-text-field v-model="model.miktar" type="number" min="0" label="Miktar" outlined required />

                            <h5 class="text-h5 mb-6">Stok Alt Bilgileri Girin</h5>

                            <v-checkbox label="Takım" v-model="model.takimDurum"></v-checkbox>
                            <v-text-field label="İçindekiler" v-model="model.icindekiler"></v-text-field>
                            <v-text-field label="Ölçüler" v-model="model.olculer"></v-text-field>
                            <v-text-field label="Paket Şekli" v-model="model.paketSekil"></v-text-field>
                            <v-text-field label="Paket İçi Adet" v-model="model.paketIciAdet"></v-text-field>
                            <v-text-field label="Toplam Paket İçi Adet" v-model="model.toplamPaketIciAdet"></v-text-field>
                            <v-text-field label="Kap Adet" v-model="model.kapAdet"></v-text-field>
                            <v-text-field label="Toplam Kap Adet" v-model="model.toplamKapAdet"></v-text-field>
                            <v-text-field label="Tedarikçi Firma" v-model="model.tedarikFirma"></v-text-field>
                            <v-text-field label="Ürün İçerik" v-model="model.urunIcerik"></v-text-field>
                            <v-text-field label="Ürün Bürüt Ağırlık" v-model="model.urunBurutAgirlik"></v-text-field>
                            <v-text-field label="Ürün Net Ağırlık" v-model="model.urunNetAgirlik"></v-text-field>

                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogs.insertOrUpdate = false" text>İPTAL</v-btn>
                        <v-btn :color="model.id == 0 ? 'success' : 'warning'" @click="insertOrUpdateHandler">{{ model.id ==
                            0 ?
                            'EKLE' : 'GÜNCELLE' }}</v-btn>
                    </v-card-actions>

                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogs.deleteDialog" max-width="480">
                <v-card>
                    <v-card-title class="text-h6">İrsaliye Kalemi Sil</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pt-2">
                        <b>{{ model?.stok?.stokAdi }}</b> stoklu irsaliye kalemini silmek istiyor musunuz?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogs.deleteDialog = false" text>İPTAL</v-btn>
                        <v-btn color="error" @click="deleteHandler">SİL</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


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
                irsaliyeDetaylar: [
                    { text: 'BARKOD', align: 'start', value: 'stok.barkod' },
                    { text: 'STOK KODU', align: 'start', value: 'stok.stokKod' },
                    { text: 'STOK ADI', align: 'start', value: 'stok.stokAdi' },
                    { text: 'HİZMET ADI', align: 'start', value: 'hizmet.hizmetAdi' },
                    { text: 'MİKTAR', value: 'miktar' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '120' },
                ]
            },
            dialogs: {
                insertOrUpdate: false,
                deleteDialog: false
            },
            validations: {
                irsaliyeDetayEkleGuncelle: false
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
                irsaliyeId: this.$route.params.id
            },
            rules: {

            }
        }
    },
    created() {
        this.$store.dispatch("stok/fetchItems");
        this.$store.dispatch("hizmet/fetchItems");
        this.$store.dispatch("irsaliyeDetay/fetchItems", this.pagination);
    },
    computed: {
        getIrsaliyeDetaylar() {
            return this.$store.state.irsaliyeDetay.items
        },
        getStoklar() {
            return this.$store.state.stok.items;
        },
        getHizmetler() {
            return this.$store.state.hizmet.items;
        },
        getTotalPage() {
            return this.$store.state.irsaliyeDetay.pageCount
        },
        loading() {
            return this.$store.state.irsaliyeDetay.loading
        }
    },
    methods: {
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('irsaliyeDetay/fetchItems', this.pagination);
        },
        async insertOrUpdateHandler() {
            await this.$refs.irsaliyeDetayEkleGuncelle.validate()
            if (this.validations.irsaliyeDetayEkleGuncelle) {
                await this.$store.dispatch('irsaliyeDetay/insertOrUpdateItem', this.model)
                this.model = { id: 0 }
                this.dialogs.insertOrUpdate = false
            }
        },
        deleteHandler() {
            this.$store.dispatch('irsaliyeDetay/deleteItem', this.model)
            this.dialogs.deleteDialog = false
        },
        callbackFunction(data) {
            if (data.action == "add") {
                this.model = { id: 0, irsaliyeId: this.$route.params.id }
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
        const irsaliye = await $axios.$get('irsaliye/Get/' + route.params.id)
        return { irsaliye: irsaliye.value }
    },

    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('irsaliyeDetay/fetchItems', this.pagination);
            }
        }
    },
    mounted() {
        this.$store.dispatch(`irsaliyeDetay/fetchItems`, this.pagination);
    }
}
</script>