<template>
    <div class="col-12 d-flex justify-center align-center mt-5">
        <v-card class="col-12">
            <v-card-title>
                STOKLAR
                <v-spacer></v-spacer>
                <v-flex class="d-flex flex justify-end px-4">
                    <v-text-field v-model="search" append-icon="mdi-magnify" @keydown.enter="searchDatabase()" label="Ara"
                        placeholder="Ara" class="d-flex flex sm5" dense outlined single-line hide-details></v-text-field>
                </v-flex>
            </v-card-title>

            <v-data-table :headers="headers.stok" :items="getStoklar" :search="search" :loading="loading"
                loading-text="Yükleniyor" item-class="my-10" hide-default-footer
                :page.sync="pagination.currentPage"
                :items-per-page="-1">

              
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
                <v-card-title class="text-h6">{{ formTitle }}</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-text-field label="Stok Kodu" v-model="stok.stokKod"></v-text-field>
                        <v-text-field label="Barkod" v-model="stok.barkod"></v-text-field>
                        <v-text-field label="Stok Adı" v-model="stok.stokAdi"></v-text-field>
                        <v-text-field type="number" label="Kdv Oran" v-model="stok.kdvOran"></v-text-field>
                        <v-text-field label="İskonto Oran" v-model="stok.iskontoOran"></v-text-field>
                        <v-text-field label="Döviz Birimi" v-model="stok.dovizBirim"></v-text-field>
                        <v-text-field label="İçindekiler" v-model="stok.icindekiler"></v-text-field>
                        <v-text-field label="Ölçüler" v-model="stok.olculer"></v-text-field>
                        <v-text-field label="Paket Şekil" v-model="stok.paketSekil"></v-text-field>
                        <v-text-field label="Paket İçi Adet" v-model="stok.dovizBirim"></v-text-field>
                        <v-text-field label="Toplam Paket İçi Adet" v-model="stok.toplamPaketIciAdet"></v-text-field>
                        <v-text-field label="Kap Adet" v-model="stok.kapAdet"></v-text-field>
                        <v-text-field label="Toplam Kap Adet" v-model="stok.toplamKapAdet"></v-text-field>
                        <v-text-field label="Marka" v-model="stok.marka"></v-text-field>
                        <v-text-field label="Ürün İçerik" v-model="stok.urunİçerik"></v-text-field>
                        <v-text-field label="Ürün Büt Ağırlık" v-model="stok.urunButAgirlik"></v-text-field>
                        <v-text-field label="Ürün Net Ağırlık" v-model="stok.urunNetAgirlik"></v-text-field>
                        <v-checkbox v-model="stok.takimDurum" :label="`Takım`"></v-checkbox>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="formDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="insertUpdateHandler">Tamam</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
                <v-card-title class="text-h6">Cari Sil</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-2">
                    <b>{{ stok.stokAdi }}</b> adlı stoğu silmek istiyor musunuz?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deleteDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="deleteHandler">Tamam</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-overlay :value="loading">
            <v-progress-circular
            indeterminate
            size="64">
            </v-progress-circular>
        </v-overlay>

    </div>
</template>

<script>
export default {
    layout:"default",
    data() {
        return {
            stok: { id: 0 },
            formTitle: "Stok Ekle",
            formDialog: false,
            deleteDialog: false,
            search: '',
            headers: 
            {
                stok: [
                { text: 'STOK KODU',align: 'start',value: 'stokKod'},
                { text: 'BARKOD', value: 'barkod' },
                { text: 'STOK ADI',value: 'stokAdi'},
                { text: 'KDV ORAN',value: 'kdvOran'},
                { text: 'DEPO ADI',align: 'start',value: 'depo.depoAd'},
                { text: 'İSKONTO ORAN',value: 'iskontoOran'},
                { text: 'DÖVİZ BİRİM',value: 'dovizBirim'},
                ],
            },
            pagination:{
                    currentPage: 1,
                    perPageItemCount: 10,
                    orderType: 1,
                    searchText: '',
                },
            
        }

    },
    created() {
        this.$store.dispatch("stok/fetchItems",this.pagination);
    },
    computed: {
        getStoklar() {
            return this.$store.state.stok.items;
        },
        getTotalPage(){
            return this.$store.state.stok.pageCount
        },
        loading() {
            return this.$store.state.stok.loading;
        }
    },
    methods: {
        btnEkle() {
            this.stok = { id: 0 };
            this.formTitle = "Stok Ekle";
            this.formDialog = true;
        },
        btnDeleteClick(item) {
            this.stok = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnUpdateClick(item) {
            this.stok = JSON.parse(JSON.stringify(item));
            this.formTitle = 'Stok Güncelle';
            this.formDialog = true;
        },
          searchDatabase(){
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('stok/fetchItems', this.pagination);
        },
        insertUpdateHandler() {
            this.$store.dispatch('stok/insertOrUpdateItem', this.stok);
            this.stok = {id:0}
            this.formDialog=false;
        },
        deleteHandler() {
            this.$store.dispatch('stok/deleteItem', this.stok);
            this.deleteDialog = false;
        },
        callbackFunction(data) {
            if (data.action == 'add') {
                this.model = { id: 0 }
                this.dialogs.insertAndUpdateDialog = true
            }
            else if (data.action == "edit") {
                this.model = JSON.parse(JSON.stringify(data.item))
                this.dialogs.insertAndUpdateDialog = true
            }
            else if (data.action == "show") {
                this.$router.push('/stok/detay/'+data.item.id)
            }
            else {
                this.model = JSON.parse(JSON.stringify(data.item))
                this.dialogs.deleteDialog = true
            }
        },
    },
    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('stok/fetchItems', this.pagination);
            }
        }
    }
        
}
</script>

<style scoped></style>