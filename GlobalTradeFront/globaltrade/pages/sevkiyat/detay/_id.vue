<template>
    <div class="py-10 px-10">
        <v-row cols="12">
            <v-col class="col-12 col-md-6 col-lg-4">
                <v-card width="100%">
                    <v-card-title class="justify-center">
                        PROJE NO : {{ sevkiyat?.projeNo }}
                    </v-card-title>
                    <v-card-text>
                        <v-form class="d-flex row">
                            <v-col class="col-12">
                                <v-select label="Dönüşüm Para Birim Seçin" v-model="paraBirim" :items="getParaBirimler"
                                    item-value="id" item-text="birimSimge" required outlined></v-select>
                            </v-col>
                        </v-form>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text>
                        <table>
                            <tbody>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Sevkiyat Adres:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ sevkiyat?.sevkiyatAdres }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Sevkiyat Tarih:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ sevkiyat?.sevkiyatTarih }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Araç Bilgisi:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ sevkiyat?.aracPlaka }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Şoför Bilgisi:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ sevkiyat?.soforAdSoyad }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Satış İrsaliye Toplam:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ tutarlar?.kar?.toFixed(2) }} {{ tutarlar?.birimSimge }}</td>
                                </tr>
                                <tr>
                                    <td class="pt-2">
                                        <h4>Alış İrsaliye Toplam:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ tutarlar?.zarar?.toFixed(2) }} {{ tutarlar?.birimSimge }} </td>
                                </tr>
                                <tr>
                                    <td class="pt-2 dark">
                                        <h4>Sevkiyat Net Kalan:</h4>
                                    </td>
                                    <td class="ps-4 pt-2">{{ tutarlar?.netMaliyet?.toFixed(2) }} {{ tutarlar?.birimSimge }}
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                        <CekiListeGoruntule class="d-flex justify-center my-5" :sevkiyat="sevkiyat" />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="col-12 col-md-6 col-lg-8">
                <v-card width="100%">
                    <v-card-title class="justify-space-between">
                        SEVKİYAT KALEMLERİ
                        <v-btn-toggle v-model="panel" class="d-flex">
                            <v-btn class="col-6">

                                FATURALAR
                            </v-btn>
                            <v-btn class="col-6">
                                İRSALİYELER
                            </v-btn>
                        </v-btn-toggle>
                    </v-card-title>
                    <v-divider class="mx-0" />

                    <v-data-table :headers="panel ? headers.irsaliyeler : headers.faturalar"
                        :items="panel ? getIrsaliyeler : getFaturalar" :search="search" :loading="loading"
                        loading-text="Yükleniyor" item-class="my-10" hide-default-footer :page.sync="pagination.currentPage"
                        :items-per-page="-1">
                        <template v-slot:item.eylemler="{ item }">

                            <v-btn x-small color="warning" icon fab @click="btnDeleteClick(item)">
                                <v-icon> mdi-delete </v-icon>
                            </v-btn>
                            
                        </template>
                    </v-data-table>
                    <div class="text-center pt-2">
                        <v-pagination v-model="pagination.currentPage"
                            :length="panel ? getIrsaliyeTotalPage : getFaturaTotalPage" total-visible="7"></v-pagination>
                    </div>
                </v-card>

            </v-col>

            <v-overlay :value="loading">
                <v-progress-circular indeterminate size="64"></v-progress-circular>
            </v-overlay>
            <v-dialog v-model="dialogs.insertOrUpdate" max-width="480">
                <v-card>
                    <v-card-title class="justify-space-between">
                        <span class="text-h5">{{ model.id === 0 ? 'Sevkiyat Kalem Ekle' : 'Sevkiyat Kalem Güncelle'
                        }}</span>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="dialogs.insertOrUpdate = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pt-4">

                        <v-form>
                            <v-row class="my-2">
                                <v-select label="İrsaliye Seçin" :items="getIrsaliyeler" item-value="id"
                                    item-text="irsaliyeNo" v-model="model.irsaliyeId" required outlined></v-select>
                            </v-row>
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
                        <b>{{ irsaliye?.stokAdi }}</b> adlı irsaliye kalemini silmek istiyor musunuz?
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
            paraBirim: 0,
            panel: 0,
            tutarlar: { kar: 0, zarar: 0, netMaliyet: 0, birimSimge: '' },
            irsaliye: { id: 0 },
            headers: {
                irsaliyeler: [
                    { text: 'İRSALİYE NO', align: 'start', value: 'irsaliye.irsaliyeNo' },
                    { text: 'PROJE NO', align: 'start', value: 'irsaliye.projeNo' },
                    { text: 'MİKTAR', align: 'start', value: 'irsaliye.miktar' },
                    { text: 'FİRMA', value: 'irsaliye.cari.ticariUnvan' },
                    { text: 'EYLEMLER', align: 'end', value: 'eylemler' },
                ],
                faturalar: [
                    { text: 'FATURA NO', align: 'start', value: 'fatura.faturaNo' },
                    { text: 'PROJE NO', align: 'start', value: 'fatura.projeNo' },
                    { text: 'MİKTAR', align: 'start', value: 'fatura.miktar' },
                    { text: 'FİRMA', value: 'fatura.cari.ticariUnvan' },
                    { text: 'EYLEMLER', align: 'end', value: 'eylemler' },
                ],
            },
            dialogs: {
                insertOrUpdate: false,
                deleteDialog: false
            },
            validations: {
                sevkiyatDetaykEkleGuncelle: false
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
                sevkiyatId: this.$route.params.id
            },
        }
    },

    created() {
        this.$store.dispatch("sevkiyatDetay/fetchItemsForFatura", this.pagination);
        this.$store.dispatch("sevkiyatDetay/fetchItemsForIrsaliye", this.pagination);
        this.$store.dispatch("irsaliye/fetchAllItems");
        this.$store.dispatch("paraBirim/fetchItems");
    },
    computed: {
        getSevkiyatDetaylar() {
            return this.$store.state.sevkiyatDetay.items
        },
        getParaBirimler() {
            return this.$store.state.paraBirim.items
        },
        getIrsaliyeler() {
            return this.$store.state.sevkiyatDetay.irsaliyeler
        },
        getFaturalar() {
            return this.$store.state.sevkiyatDetay.faturalar
        },
        getTotalPage() {
            return this.$store.state.sevkiyatDetay.pageCount
        },
        getIrsaliyeTotalPage() {
            return this.$store.state.sevkiyatDetay.irsaliyePageCount
        },
        getFaturaTotalPage() {
            return this.$store.state.sevkiyatDetay.faturaPageCount
        },
        loading() {
            return this.$store.state.sevkiyatDetay.loading
        }
    },
    methods: {
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('sevkiyatDetay/fetchItems', this.pagination);
        },
        async insertOrUpdateHandler() {
            this.model.sevkiyatId = this.$route.params.id
            this.$store.dispatch('sevkiyatDetay/insertOrUpdateItem', this.model)
            this.dialogs.insertOrUpdate = false
        },
        deleteHandler() {
            this.$store.dispatch('sevkiyatDetay/deleteItem', this.model)
            this.dialogs.deleteDialog = false
        },
        callbackFunction(data) {
            if (data.action == "add") {
                this.model = { id: 0, sevkiyatId: this.$route.params.id }
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
        const sevkiyat = await $axios.$get('sevkiyat/Get/' + route.params.id)
        return { sevkiyat: sevkiyat.value, tutarlar: { kar: sevkiyat.value?.kar, zarar: sevkiyat.value?.zarar, netMaliyet: sevkiyat.value?.netMaliyet } }
    },
    components: {
        CekiListeGoruntule: () => import('~/components/rapor/CekiListeGoruntule.vue'),
        SevkiyatMaliyetGoruntule: () => import('~/components/rapor/SevkiyatMaliyetGoruntule.vue')
    },
    watch: {
        'pagination.currentPage': {
            handler() {
                if (this.panel === 1) {
                    this.$store.dispatch('sevkiyatDetay/fetchItemsForIrsaliye', this.pagination);
                }
                else {
                    this.$store.dispatch('sevkiyatDetay/fetchItemsForFatura', this.pagination);
                }

            }
        },
        'paraBirim': {
            async handler() {
                const response = await this.$axios.$get(`Sevkiyat/DovizKurDonusum?sevkiyatId=${this.sevkiyat.id}&paraBirimId=${this.paraBirim}`)
                this.tutarlar = response.value
            },
            deep: true
        },
    }
}
</script>