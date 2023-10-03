<template>
    <div class="mt-5">
        <v-col class="col-12">
            <v-row>
                <v-col class="col-md-6 col-lg-3">
                    <v-card class="pa-2 elevation-1" max-width="374">
                        <v-card-title>
                            <v-row>
                                <div>
                                    <v-icon size="50"> mdi-truck-check </v-icon>
                                    <h5 class=" d-inline px-5">SEVKİYAT PROJESİ</h5>
                                </div>
                            </v-row>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-title>
                            <v-row>
                                <div>
                                    <h1 class="py-3">{{ getSevkiyatlar }}</h1>
                                </div>
                            </v-row>
                        </v-card-title>

                    </v-card>
                </v-col>
                <v-col class="col-12 col-md-6 col-lg-3">
                    <v-card class=" pa-2 elevation-1" max-width="374"> 
                        <v-card-title>
                            <v-row>
                                <div>
                                    <v-icon size="50">mdi-file-document</v-icon>
                                    <h5 class=" d-inline px-5">İRSALİYE</h5>
                                </div>
                            </v-row>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-title>
                            <v-row>
                                <div>
                                    <h1 class="py-3">{{ getIrsaliyeler }}</h1>
                                </div>
                            </v-row>
                        </v-card-title>
                    </v-card>
                </v-col>

                <v-col class="col-12 col-md-6 col-lg-3">
                    <v-card class="pa-2 elevation-1" max-width="374" > 
                        <v-card-title>
                            <v-row>
                                <div>
                                    <v-icon size="50"> mdi-package-up</v-icon>
                                    <h5 class=" d-inline px-5">STOK</h5>
                                </div>
                            </v-row>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-title>
                            <v-row>
                                <div>
                                    <h1 class="py-3">{{ getStoklar }}</h1>
                                </div>
                            </v-row>
                        </v-card-title>
                    </v-card>
                </v-col>

                <v-col class="col-12 col-md-6 col-lg-3">
                    <v-card class="pa-2 elevation-1" max-width="374"> 
                        <v-card-title>
                            <v-row>
                                <div>
                                    <v-icon size="50">mdi-account-group</v-icon>
                                    <h5 class=" d-inline px-5">MÜŞTERİ</h5>
                                </div>
                            </v-row>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-title>
                            <v-row>
                                <div>
                                    <h1 class="py-3">{{ getCariler }}</h1>
                                </div>
                            </v-row>
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="col-12">
            <v-row>
                <v-col class="col-md-6 col-lg-12">
                    <v-card class=" pa-2 elevation-1">
                        <client-only>
                            <h4 class="text-center ">AYLIK SEVKİYAT PROJE SAYISI</h4>
                            <line-chart :chart-options="options" :chart-data="getLineChartData"></line-chart>
                        </client-only>

                    </v-card>

                </v-col>
                <v-col class="col-md-6 col-lg-12">
                    <v-card class="pa-2 elevation-1">
                        <v-card-title>
                            <h4 class="text-center">NOTLAR</h4>
                            <v-spacer></v-spacer>
                            <v-btn class=" justify-end white-text" @click="btnEkle" small color="primary">NOT EKLE</v-btn>
                        </v-card-title>

                        <v-data-table :headers="headers.sevkiyatNot" :items="getSevkiyatNotlar" :loading="loading"
                            loading-text="Yükleniyor" item-class="my-10" hide-default-footer
                            :page.sync="pagination.currentPage" :items-per-page="-1">

                            <template v-slot:item.eylemler="{ item }">

                                <v-btn x-small color="warning" icon fab @click="btnNotuGuncelle(item)">
                                    <v-icon> mdi-pencil </v-icon>
                                </v-btn>
                                <v-btn x-small color="warning" icon fab @click="btnDeleteClick(item)">
                                    <v-icon> mdi-delete </v-icon>
                                </v-btn>

                            </template>
                        </v-data-table>

                        <div class="text-center">
                            <v-pagination v-model="pagination.currentPage" :length="getTotalPage"
                                total-visible="7"></v-pagination>
                        </div>

                    </v-card>
                </v-col>
                <v-overlay :value="loading">
                    <v-progress-circular indeterminate size="64">

                    </v-progress-circular>
                </v-overlay>

            </v-row>
        </v-col>

        <v-dialog v-model="formDialog" max-width="500">
            <v-card>
                <v-card-title>
                    <h4 class="text-center">Notunuzu Ekleyin.</h4>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field label="Not" v-model="not.metin" maxlength="50" counter="50" outlined></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>

                    <v-btn color="error" @click="formDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="insertUpdateHandler">Tamam</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
                <v-card-title class="text-h6">Not Sil</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-2">
                    Bu notu silmek istediğinize emin misiniz ?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deleteDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="deleteHandler">Tamam</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
export default {
    layout: "default",
    data() {
        const adetler = this.uretimAdetler
        return {
            not: { id: 0 },
            formTitle: "Not Ekle",
            deleteDialog: false,
            formDialog: false,
            headers:
            {
                sevkiyatNot: [
                    { text: 'NOT', align: 'start', value: 'metin' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '120' },
                ],
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 3,
                orderType: 1,
                searchText: '',
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        }
                    }]
                },
                title: {
                    display: false
                },
                responsive: true, maintainAspectRatio: false
            },
        }
    },
    created() {
        this.$store.dispatch("cari/toplamCariAdet");
        this.$store.dispatch("sevkiyat/toplamSevkiyatAdet");
        this.$store.dispatch("sevkiyat/aylikSevkiyatAdet");
        this.$store.dispatch("stokDetay/toplamStokAdet");
        this.$store.dispatch("sevkiyatNot/fetchItems", this.pagination);
        this.$store.dispatch("irsaliye/toplamIrsaliyeAdet");
    },
    computed: {
        getLineChartData() {
            return {
                labels: ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'],
                datasets: [{
                    label: 'adet',
                    backgroundColor: this.$vuetify.theme.defaults.light.warning,
                    data: this.$store.state.sevkiyat.items.map(x => parseInt(x)),
                    tension: 0.1,
                    fill: false,
                    borderWidth: 1,
                    pointBorderColor: 'rgb(0, 0, 0)'
                }]
            }
        },
        getSevkiyatlar() {
            return this.$store.state.sevkiyat.count
        },
        getSevkiyatNotlar() {
            return this.$store.state.sevkiyatNot.items
        },
        getCariler() {
            return this.$store.state.cari.count
        },
        getStoklar() {
            return this.$store.state.stokDetay.count
        },
        getIrsaliyeler() {
            return this.$store.state.irsaliye.count
        },
        getTotalPage() {
            return this.$store.state.sevkiyatNot.pageCount
        },
        loading() {
            return this.$store.state.sevkiyatNot.loading;
        }
    },
    methods: {
        btnEkle() {
            this.not = { id: 0 };
            this.formTitle = "Not Ekle";
            this.formDialog = true;
        },
        btnDeleteClick(item) {
            this.not = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnNotuGuncelle(item) {
            this.not = JSON.parse(JSON.stringify(item));
            this.formTitle = "Notu Güncelle";
            this.formDialog = true;
        },
        insertUpdateHandler() {
            this.$store.dispatch('sevkiyatNot/insertOrUpdateItem', this.not);
            this.not = { id: 0 }
            this.formDialog = false;
        },
        deleteHandler() {
            this.$store.dispatch('sevkiyatNot/deleteItem', this.not);
            this.deleteDialog = false
        }

    },
    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('sevkiyatNot/fetchItems', this.pagination);
            }
        }
    }
}
</script>

<style scoped>

.card-letter-spacing-5 {
    letter-spacing: 4px;
    font-family: 'Josefin Sans', sans-serif;
}
.btn-right {
    position: absolute;
    right: 3em
}

</style>