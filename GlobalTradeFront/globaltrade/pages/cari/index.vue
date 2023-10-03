<template>
    <div class="col-12 d-flex justify-center align-center mt-5">
        <v-card class="col-12">
            <v-card-title>
             CARİLER
                <v-spacer></v-spacer>
                <v-flex class="d-flex flex justify-end px-4">
                <v-text-field v-model="search" append-icon="mdi-magnify" @keydown.enter="searchDatabase()" label="Ara" placeholder="Ara"
                    class="d-flex flex sm5" dense outlined single-line hide-details></v-text-field>
            </v-flex>
            </v-card-title>
            <v-divider class="mx-0" />
        
            <v-data-table :headers="headers.cari" :items="getCariler" :search="search" :loading="loading"
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
                        <v-text-field label="Cari Kodu" v-model="cari.cariKodu"></v-text-field>
                        <v-text-field label="Ad" v-model="cari.ad"></v-text-field>
                        <v-text-field label="Soyad" v-model="cari.soyad"></v-text-field>
                        <v-text-field label="Ticari Unvan" v-model="cari.ticariUnvan"></v-text-field>
                        <v-text-field label="Email" v-model="cari.email"></v-text-field>
                        <v-text-field label="Vergi Dairesi" v-model="cari.vergiDairesi"></v-text-field>
                        <v-text-field label="Vergi No" v-model="cari.vergiNo"></v-text-field>
                        <v-text-field label="Tc No" v-model="cari.tcNo"></v-text-field>
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
                    <b>{{ cari.ticariUnvan }}</b> adlı cariyi silmek istiyor musunuz?
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
            cari: { id: 0 },
            formTitle: "Cari Ekle",
            formDialog: false,
            deleteDialog: false,
            search: '',
            headers: 
            {
                cari: [
                { text: 'Cari Kodu',align: 'start',value: 'cariKodu'},
                { text: 'Ad Soyad', value: 'adSoyad' },
                { text: 'Ticari Unvan',value: 'ticariUnvan'},
                { text: 'Vergi Dairesi',value: 'vergiDairesi'},
                { text: 'Vergi No',value: 'vergiNo'},
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
        this.$store.dispatch("cari/fetchItems",this.pagination);
    },
    computed: {
        getCariler() {
            return this.$store.state.cari.items;
        },
        getTotalPage(){
            return this.$store.state.cari.pageCount
        },
        loading() {
            return this.$store.state.cari.loading;
        }
    },
    methods: {
        btnEkle() {
            this.cari = { id: 0 };
            this.formTitle = "Cari Ekle";
            this.formDialog = true;
        },
        btnDeleteClick(item) {
            this.cari = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnUpdateClick(item) {
            this.cari = JSON.parse(JSON.stringify(item));
            this.formTitle = 'Cari Güncelle';
            this.formDialog = true;
        },
        insertUpdateHandler() {
            this.$store.dispatch('cari/insertOrUpdateItem', this.cari);
            this.cari = {id:0}
            this.formDialog=false;
        },
        deleteHandler() {
            this.$store.dispatch('cari/deleteItem', this.cari);
            this.deleteDialog = false;
        },
        searchDatabase(){
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('cari/fetchItems', this.pagination);
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
                this.$router.push('/cari/detay/'+data.item.id)
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
                this.$store.dispatch('cari/fetchItems', this.pagination);
            }
        }
    }
        
}
</script>

<style scoped></style>