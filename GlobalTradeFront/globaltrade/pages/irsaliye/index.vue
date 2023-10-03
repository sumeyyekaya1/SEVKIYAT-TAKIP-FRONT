<template>
    <div class="col-12 d-flex justify-center align-center mt-5">
        <v-card class="col-12">
            <v-card-title>
                İRSALİYELER
                <v-spacer></v-spacer>
                <v-flex class="d-flex flex justify-end px-4">
                    <v-text-field v-model="search" append-icon="mdi-magnify" @keydown.enter="searchDatabase()" label="Ara"
                        placeholder="Ara" class="d-flex flex sm5" dense outlined single-line hide-details></v-text-field>
                </v-flex>
                <v-btn class="justify-end" @click="btnEkle" color="primary">İRSALİYE EKLE</v-btn>

            </v-card-title>
            <v-divider class="mx-0" />

            <v-data-table :headers="headers.irsaliye" :items="getIrsaliyeler" :search="search" :loading="loading"
                loading-text="Yükleniyor" item-class="my-10" hide-default-footer :page.sync="pagination.currentPage"
                :items-per-page="-1">

                <template v-slot:item.eylemler="{ item }">
                    <v-btn x-small color="warning" icon fab @click="callbackFunction({ action: 'show', item })">
                        <v-icon> mdi-clipboard-list</v-icon>
                    </v-btn>
                    <v-btn x-small color="warning" icon fab @click="callbackFunction({ action: 'edit', item })">
                        <v-icon> mdi-pencil </v-icon>
                    </v-btn>
                    <v-btn x-small color="warning" icon fab @click="callbackFunction({ action: 'remove', item })">
                        <v-icon> mdi-delete </v-icon>
                    </v-btn>
                </template>

                <template v-slot:item.irsaliye.faturaDurum="{ item }">
                    <v-chip :color="getIrsaliyeFaturaDurum(item?.irsaliye?.faturaDurum)?.color">
                        {{ getIrsaliyeFaturaDurum(item?.irsaliye?.faturaDurum)?.text }}
                    </v-chip>
                </template>

                <template v-slot:item.irsaliye.irsaliyeTur="{ item }">
                    <v-chip :color="getIrsaliyeTurDurum(item?.irsaliye?.irsaliyeTur)?.color">
                        {{ getIrsaliyeTurDurum(item?.irsaliye?.irsaliyeTur)?.text }}
                    </v-chip>
                </template>

                <template v-slot:item.irsaliye.sevkDurum="{ item }">
                    <v-chip :color="getIrsaliyeSevkDurum(item?.irsaliye?.sevkDurum)?.color">
                        {{ getIrsaliyeSevkDurum(item?.irsaliye?.sevkDurum)?.text }}
                    </v-chip>
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
        <v-dialog v-model="formDialog" max-width="1300">

            <v-stepper v-model="stepper">

                <v-stepper-header>
                    <v-stepper-step :complete="stepper > 1" step="1">İrsaliye Ekle</v-stepper-step>
                    <v-divider v-if="model.irsaliye.id === 0"></v-divider>
                    <v-stepper-step :complete="stepper > 2" step="2" v-if="model.irsaliye.id === 0">İrsaliye Kalem
                        Ekle</v-stepper-step>
                    <v-divider v-if="model.irsaliye.id === 0"></v-divider>
                </v-stepper-header>
                <v-stepper-items>

                    <v-stepper-content step="1">
                        <v-card>
                            <v-card-title class="text-h6">{{ formTitle }}</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>

                                <v-form ref="step1Insert" v-model="validations.step1Insert" lazy-validation>
                                    <v-text-field label="İrsaliye No" :rules="rules.irsaliyeNo"
                                        v-model="model.irsaliye.irsaliyeNo"></v-text-field>
                                    <v-text-field label="Proje No" :rules="rules.projeNo"
                                        v-model="model.irsaliye.projeNo"></v-text-field>
                                    <v-text-field type="datetime-local" label="İrsaliye Tarih"
                                        v-model="model.irsaliye.irsaliyeTarih"></v-text-field>
                                    <v-text-field type="datetime-local" label="Sevk Tarih"
                                        v-model="model.irsaliye.sevkTarih"></v-text-field>

                                    <v-autocomplete v-model="model.irsaliye.cariId" :items="getCariler"
                                        :item-text="x => `${x.ticariUnvan} ( ${x.ad} )`" item-value="id"
                                        label="Cari *" outlined required></v-autocomplete>

                                </v-form>

                            </v-card-text>
                            <v-card-actions>

                                <v-btn color="error" @click="formDialog = false">İptal</v-btn>
                                <v-btn color="primary" @click="step1Kontrol" v-if="model.irsaliye.id === 0">Tamam</v-btn>
                                <v-btn color="warning" @click="insertUpdateHandler" v-else>GÜNCELLE</v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="2" v-if="model.irsaliye.id === 0">
                        <div class="pa-8">
                            <h1 class="text-h4 mb-6">İrsaliye Kalem Ekle</h1>
                            <v-form ref="step2Insert" v-model="validations.step2Insert" lazy-validation>

                                <v-autocomplete v-model="irsaliyeKalem.stokId" :items="getStoklar"
                                    :item-text="x => `${x.stokAdi} ( ${x.stokKod} )`" item-value="id" label="Stok *"
                                    outlined required></v-autocomplete>

                                <v-autocomplete v-model="irsaliyeKalem.hizmetId" :items="getHizmetler"
                                    :item-text="x => `${x.hizmetAdi} ( ${x.hizmetAdi} )`" item-value="id" label="Hizmet *"
                                    outlined required></v-autocomplete>

                                <v-text-field :rules="rules.stokMiktar" label="Miktar"
                                    v-model="irsaliyeKalem.miktar"></v-text-field>

                                <h4 class="text-h5 mb-2">Stok Alt Bilgileri Girin</h4>
                                <label>*Sevkiyat projesi toplu çeki listesi alabilmeniz için aşağıdaki formu doldurmanız
                                    gerekmektedir.</label>

                                <v-text-field label="İçindekiler" v-model="irsaliyeKalem.icindekiler"></v-text-field>
                                <v-text-field label="Ölçüler" v-model="irsaliyeKalem.olculer"></v-text-field>
                                <v-text-field label="Kap Numarası" v-model="irsaliyeKalem.kapNo"></v-text-field>
                                <v-text-field label="Paket Şekli" v-model="irsaliyeKalem.paketSekil"></v-text-field>
                                <v-text-field label="Paket İçi Adet" v-model="irsaliyeKalem.paketIciAdet"></v-text-field>
                                <v-text-field label="Toplam Paket İçi Adet"
                                    v-model="irsaliyeKalem.toplamPaketIciAdet"></v-text-field>
                                <v-text-field label="Kap Adet" v-model="irsaliyeKalem.kapAdet"></v-text-field>
                                <v-text-field label="Toplam Kap Adet" v-model="irsaliyeKalem.toplamKapAdet"></v-text-field>
                                <v-text-field label="Tedarikçi Firma" v-model="irsaliyeKalem.tedarikFirma"></v-text-field>
                                <v-text-field label="Ürün İçerik" v-model="irsaliyeKalem.urunIcerik"></v-text-field>
                                <v-text-field label="Ürün Bürüt Ağırlık"
                                    v-model="irsaliyeKalem.urunBurutAgirlik"></v-text-field>
                                <v-text-field label="Ürün Net Ağırlık"
                                    v-model="irsaliyeKalem.urunNetAgirlik"></v-text-field>
                                <v-checkbox label="Takım" v-model="irsaliyeKalem.takimDurum"></v-checkbox>

                            </v-form>

                            <div class="d-flex">
                                <v-btn color="error" @click="stepper = 1" text>GERİ DÖN</v-btn>
                                <v-spacer />
                                <v-btn color="primary" class="me-2" @click="insertUpdateHandler"
                                    v-if="irsaliyeKalem.id === 0" text>EKLEMEYİ BİTİR & DEVAM ET</v-btn>
                                <v-btn color="error" class="me-2" @click="irsaliyeKalem = { id: 0 }" v-else
                                    text>GÜNCELLEMEYİ
                                    İPTAL
                                    ET</v-btn>
                                <v-btn :color="irsaliyeKalem.id === 0 ? 'success' : 'warning'" @click="irsaliyeKalemEkle">{{
                                    irsaliyeKalem.id
                                    === 0 ? 'KALEM OLARAK EKLE' : 'GÜNCELLE' }}</v-btn>
                            </div>
                        </div>
                        <v-divider />
                        <v-card class="ma-1 mt-4" width="98%">
                            <v-card-title>
                                <span> Eklenmiş Kalemler </span>
                            </v-card-title>
                            <v-divider class="mx-0" />

                            <v-data-table :headers="headers.irsaliyeDetay" :items="model.irsaliyeDetay" item-class="my-10">
                                <template v-slot:item.barkod="{ item }">
                                    {{ getStok(item?.stokId)?.barkod }}
                                </template>
                                <template v-slot:item.stokKod="{ item }">
                                    {{ getStok(item?.stokId)?.stokKod }}
                                </template>
                                <template v-slot:item.stokAdi="{ item }">
                                    {{ getStok(item?.stokId)?.stokAdi }}
                                </template>
                                <template v-slot:item.hizmetAdi="{ item }">
                                    {{ getHizmet(item?.hizmetId)?.hizmetAdi }}
                                </template>
                                <template v-slot:item.eylemler="{ item }">
                                    <v-icon class="mr-2" small v-if="item.id !== 0"
                                        @click="callbackIrsaliyeDetayFunctions({ action: 'edit', item })">
                                        mdi-pencil
                                    </v-icon>

                                    <v-icon small @click="callbackIrsaliyeDetayFunctions({ action: 'remove', item })">
                                        mdi-delete
                                    </v-icon>
                                </template>

                            </v-data-table>

                        </v-card>
                    </v-stepper-content>

                </v-stepper-items>
            </v-stepper>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
                <v-card-title class="text-h6">İrsaliye Sil</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-2">
                    <b>{{ model?.irsaliye?.irsaliyeNo }}</b> nolu irsaliyeyi silmek istiyor musunuz?
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
            model: { irsaliye: { id: 0 }, irsaliyeDetay: [] },
            irsaliyeKalem: { id: 0 },
            formTitle: "İrsaliye Ekle",
            formDialog: false,
            raporDialog: false,
            deleteDialog: false,
            sevkiyatDetayDeleteDialog: false,
            irsaliyeDetayDeleteDialog: false,
            search: '',
            headers:
            {

                irsaliye: [
                    { text: 'İRSALİYE NO', align: 'start', value: 'irsaliye.irsaliyeNo' },
                    { text: 'PROJE NO', align: 'start', value: 'irsaliye.projeNo' },
                    { text: 'FİRMA', value: 'irsaliye.cari.ticariUnvan' },
                    { text: 'İRSALİYE TARİH', value: 'irsaliye.irsaliyeTarih' },
                    { text: 'SEVKİYAT TARİH', value: 'irsaliye.sevkTarih' },
                    { text: 'İRSALİYE TÜR', value: 'irsaliye.irsaliyeTur' },
                    { text: 'FATURA DURUM', align: 'center', value: 'irsaliye.faturaDurum' },
                    { text: 'SEVKİYAT DURUM', align: 'center', value: 'irsaliye.sevkDurum' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '180' },
                ],
                irsaliyeDetay: [
                    { text: 'BARKOD', align: 'start', value: 'barkod' },
                    { text: 'STOK KODU', align: 'start', value: 'stokKod' },
                    { text: 'STOK ADI', align: 'start', value: 'stokAdi' },
                    { text: 'HİZMET ADI', align: 'start', value: 'hizmetAdi' },
                    { text: 'MİKTAR', value: 'miktar' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right' },
                ]

            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
            },
            validations: {
                step1Insert: false,
                step2Insert: false
            },
            stepper: 1,
            rules: {
                irsaliyeNo: [
                    v => !!v || 'İrsaliye no boş bırakılamaz!'
                ],
                projeNo: [
                    v => !!v || 'Proje no boş bırakılamaz!'
                ],
                cari: [
                    v => !!v || 'Cari seçimi boş bırakılamaz!'
                ],
                stokMiktar: [
                    v => !!v || 'Miktar alanı boş bırakılamaz!'
                ]

            }
        }
    },
    created() {
        this.$store.dispatch("irsaliye/fetchItems", this.pagination);
        this.$store.dispatch("irsaliyeDetay/fetchItems");
        this.$store.dispatch("cari/fetchItems");
        this.$store.dispatch("stok/fetchItems");
        this.$store.dispatch("hizmet/fetchItems");
    },
    computed: {
        getIrsaliyeler() {
            return this.$store.state.irsaliye.items;
        },
        getIrsaliyeDetaylar() {
            return this.$store.state.irsaliyeDetay.items;
        },
        getHizmetler() {
            return this.$store.state.hizmet.items;
        },
        getCariler() {
            return this.$store.state.cari.items;
        },
        getStoklar() {
            return this.$store.state.stok.items;
        },
        getHizmetler() {
            return this.$store.state.hizmet.items;
        },
        getTotalPage() {
            return this.$store.state.irsaliye.pageCount
        },
        loading() {
            return this.$store.state.irsaliye.loading;
        }
    },
    methods: {
        btnEkle() {
            this.model = { irsaliye: { id: 0 }, irsaliyeDetay: [] };
            this.formTitle = "İrsaliye Ekle";
            this.formDialog = true;
        },
        getStok(stokId) {
            return this.getStoklar.find(x => x.id == stokId)
        },
        getHizmet(hizmetId) {
            return this.getHizmetler.find(x => x.id == hizmetId)
        },
        async step1Kontrol() {
            await this.$refs.step1Insert.validate()
            if (this.validations.step1Insert) {
                this.stepper = 2
            }
        },
        getIrsaliyeFaturaDurum(durum) {
            console.log(durum)
            return this.$store.state.enums.irsaliyeFaturaDurum.items.find(x => x.id == durum)
        },
        getIrsaliyeTurDurum(durum) {
            console.log(durum)
            return this.$store.state.enums.irsaliyeTurDurum.items.find(x => x.id == durum)
        },
        getIrsaliyeSevkDurum(durum) {
            return this.$store.state.enums.irsaliyeSevkDurum.items.find(x => x.id == durum)
        },
        async irsaliyeKalemEkle() {
            await this.$refs.step2Insert.validate()
            if (this.validations.step2Insert) {
                this.model.irsaliyeDetay.push(JSON.parse(JSON.stringify(this.irsaliyeKalem)))
                this.irsaliyeKalem = { id: 0 }
                this.$nuxt.$emit('show-alert', { text: 'İrsaliye kalemi eklendi !', color: 'success' })
            } else {
                this.$nuxt.$emit('show-alert', { text: 'Gerekli alanlar boş olduğu için eklenemedi !', color: 'error' })
            }
        },
        btnDeleteClick(item) {
            this.model = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnUpdateClick(item) {
            this.model = JSON.parse(JSON.stringify(item));
            this.insertAndUpdateDialog = true;
        },
        async insertUpdateHandler() {
            try {
                if (this.model.irsaliyeDetay.length > 0 && this.validations.step1Insert) {
                    await this.$store.dispatch('irsaliye/insertOrUpdateItem', this.model);
                    this.stepper = 2
                    this.model = { irsaliye: { id: 0 }, irsaliyeDetay: [] };
                    this.formDialog = false
                }
                this.$nuxt.$emit('show-alert', { text: 'İşlem Başarılı !', color: 'success' })
            } catch (error) {
                this.$nuxt.$emit('show-alert', { text: 'İşlem Başarısız !', color: 'error' })
            }
        },
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('irsaliye/fetchItems', this.pagination);
        },
        deleteHandler() {
            this.$store.dispatch('irsaliye/deleteItem', this.model.irsaliye);
            this.deleteDialog = false;
        },
        irsaliyeDetayDeleteHandler() {
            if (this.irsaliyeKalem.id == 0)
                this.model.irsaliyeDetay = this.model.irsaliyeDetay.filter(x => x.id != this.irsaliyeKalem.id)
            else {
                this.$store.dispatch('irsaliyeDetay/deleteItem', this.irsaliyeKalem);
                this.irsaliyeDetayDeleteDialog = false;
            }
        },
        callbackFunction(data) {
            if (data.action == 'add') {
                this.model = { id: 0 }
                this.dialogs.formDialog = true
            }
            else if (data.action == "edit") {
                this.model = JSON.parse(JSON.stringify(data.item))
                this.formDialog = true
            }
            else if (data.action == "show") {
                this.$router.push('/irsaliye/detay/' + data.item.irsaliye.id)
            }
            else {
                this.model = JSON.parse(JSON.stringify(data.item))
                this.deleteDialog = true
            }
        },
    },
    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('irsaliye/fetchItems', this.pagination);
            }
        }
    }

}
</script>

<style scoped></style>