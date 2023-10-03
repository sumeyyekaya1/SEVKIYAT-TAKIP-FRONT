<template>
    <div class="col-12 d-flex justify-center align-center mt-5">

        <v-card class="col-12">
            <v-card-title>
                SEVKİYAT PROJELERİ
                <v-spacer></v-spacer>
                <v-flex class="d-flex flex justify-end px-4">
                    <v-text-field v-model="search" append-icon="mdi-magnify" @keydown.enter="searchDatabase()" label="Ara"
                        placeholder="Ara" class="d-flex flex sm5" dense outlined single-line hide-details></v-text-field>
                </v-flex>
                <v-btn class=" justify-end" @click="btnEkle" color="primary">SEVKİYAT OLUŞTUR</v-btn>
            </v-card-title>
            <v-divider class="mx-0" />

            <v-data-table :headers="headers.sevkiyat" :items="getSevkiyatlar" :search="search" :loading="loading"
                loading-text="Yükleniyor" item-class="my-10" hide-default-footer :page.sync="pagination.currentPage"
                :items-per-page="-1">

                <template v-slot:item.eylemler="{ item }">

                    <v-btn x-small color="warning" icon fab @click="btnShow(item)">
                        <v-icon> mdi-clipboard-list</v-icon>
                    </v-btn>
                    <v-btn x-small color="warning" icon fab @click="btnUpdateClick(item)">
                        <v-icon> mdi-pencil </v-icon>
                    </v-btn>
                    <v-btn x-small color="warning" icon fab @click="btnDeleteClick(item)">
                        <v-icon> mdi-delete </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
            <div class="text-center pt-2">
                <v-pagination v-model="pagination.currentPage" :length="getTotalPage" total-visible="7"></v-pagination>
            </div>

        </v-card>
        <v-overlay :value="loading">
            <v-progress-circular indeterminate size="64">

            </v-progress-circular>
        </v-overlay>

        <v-dialog v-model="formDialog" max-width="1000">
            <v-card>
                <v-card-title>{{ formTitle }}</v-card-title>
                <v-divider />
                <v-card-text>
                    <v-form>
                        <v-text-field label="Proje No (İrsaliye Proje No İle Aynı Olmalıdır.)" v-model="sevkiyat.projeNo"
                            :rules="rules.projeNo"></v-text-field>
                        <v-text-field label="Sevkiyat Adres" v-model="sevkiyat.sevkiyatAdres"></v-text-field>
                        <v-text-field label="Araç Bilgisi" v-model="sevkiyat.aracPlaka"></v-text-field>
                        <v-text-field label="Şoför Bilgisi" v-model="sevkiyat.soforAdSoyad"></v-text-field>
                        <v-text-field type="datetime-local" label="Sevkiyat Tarih"
                            v-model="sevkiyat.sevkiyatTarih"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>

                    <v-btn color="error" @click="formDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="insertUpdateHandler">Tamam</v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>
      
        <v-dialog v-model="raporDialog" max-width="800">
            <v-card>
                <v-card-title class="justify-center">Dönemsel Maliyet Raporu</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field type="date" label="RAPOR BAŞLANGIÇ TARİHİ SEÇİN" v-model="raporTarih.baslangicTarih"
                            :rules="rules.baslangic" outlined></v-text-field>

                        <v-text-field type="date" label="RAPOR BİTİŞ TARİHİ SEÇİN" v-model="raporTarih.bitisTarih"
                            :rules="rules.bitis" outlined></v-text-field>
                    </v-form>
                </v-card-text>

                <v-card-actions class="justify-start">
                    <DonemSevkiyatRaporGoruntule :baslangicTarih="raporTarih.baslangicTarih"
                        :bitisTarih="raporTarih.bitisTarih" />
                    <v-btn color="error" @click="raporDialog = false">İptal</v-btn>
                </v-card-actions>
                <v-card-title class="justify-center">Proje Bazlı Maliyet Raporu</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-autocomplete :items="getSevkiyatlar" v-model="raporId.sevkiyatId"
                            :item-text="x => `${x.projeNo} ( ${x.projeNo} )`" item-value="id" label="Sevkiyat Projesi Seçin"
                            outlined required></v-autocomplete>

                    </v-form>
                </v-card-text>

                <v-card-actions class="justify-start">
                    <SevkiyatMaliyetGoruntule :sevkiyatId="raporId.sevkiyatId" />
                    <v-btn color="error" @click="raporDialog = false">İptal</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
                <v-card-title class="text-h6">Sevkiyatı Sil</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-2">
                    <b>{{ sevkiyat.projeNo }}</b> proje nolu sevkiyatı silmek istiyor musunuz?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deleteDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="deleteHandler">Tamam</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-overlay :value="loading">
            <v-progress-circular indeterminate size="64">

            </v-progress-circular>
        </v-overlay>

    </div>
</template>

<script>
export default {
    layout: "default",
    data() {
        return {
            sevkiyat: { id: 0 },
            raporTarih: { id: 0 },
            raporId: { id: 0 },
            formTitle: "sevkiyat Ekle",
            formDialog: false,
            deleteDialog: false,
            raporDialog: false,
            sevkiyatDetayDeleteDialog: false,
            search: '',
            headers:
            {
                sevkiyat: [
                    { text: 'PROJE NO', align: 'start', value: 'projeNo' },
                    { text: 'SEVKİYAT ADRES', value: 'sevkiyatAdres' },
                    { text: 'ARAÇ PLAKA', align: 'start', value: 'aracPlaka' },
                    { text: 'ŞOFÖR', align: 'start', value: 'soforAdSoyad' },
                    { text: 'SEVK TARİH', value: 'sevkiyatTarih' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '180' },
                ]
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
            },
            e1: 1,
            rules: {
                projeNo: [
                    v => !!v || 'Proje no boş bırakılamaz!'
                ],
                baslangic: [
                    v => !!v || 'Başlangıç tarihi boş bırakılamaz!'
                ],
                bitis: [
                    v => !!v || 'Bitiş tarihi boş bırakılamaz!'
                ]

            }
        }

    },
    created() {
        this.$store.dispatch("sevkiyat/fetchItems", this.pagination)
    },
    computed: {
        getSevkiyatlar() {
            return this.$store.state.sevkiyat.items;
        },
        getTotalPage() {
            return this.$store.state.sevkiyat.pageCount
        },
        loading() {
            return this.$store.state.sevkiyat.loading;
        }
    },
    methods: {
        btnEkle() {
            this.sevkiyat = { id: 0 };
            this.formTitle = "Sevkiyat Ekle";
            this.formDialog = true;
        },
        btnRaporHazirla() {
            this.model = { sevkiyat: { id: 0 } };
            this.raporDialog = true;
        },
        btnDeleteClick(item) {
            this.sevkiyat = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnUpdateClick(item) {
            this.sevkiyat = JSON.parse(JSON.stringify(item));
            this.formTitle = 'Sevkiyat Güncelle';
            this.formDialog = true;
        },
        insertUpdateHandler() {
            this.$store.dispatch('sevkiyat/insertOrUpdateItem', this.sevkiyat);
            this.sevkiyat = { id: 0 }
            this.formDialog = false;
        },
        deleteHandler() {
            this.$store.dispatch('sevkiyat/deleteItem', this.sevkiyat);
            this.deleteDialog = false;
        },
        btnShow(item) {
            this.$router.push(`/sevkiyat/detay/${item.id}`)
        },
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('sevkiyat/fetchItems', this.pagination);
        }
    },
    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('sevkiyat/fetchItems', this.pagination);
            }
        }
    },
    components: {
        DonemSevkiyatRaporGoruntule: () => import('~/components/rapor/DonemSevkiyatRaporGoruntule.vue'),
        SevkiyatMaliyetGoruntule: () => import('~/components/rapor/SevkiyatMaliyetGoruntule.vue')
    },

}
</script>

<style scoped></style>