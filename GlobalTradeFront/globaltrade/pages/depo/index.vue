<template>
    <div class="col-12 d-flex justify-center align-center mt-5">
        <v-card class="col-12">
            <v-card-title>
                DEPOLAR
                <v-spacer></v-spacer>
            </v-card-title>

            <v-data-table :headers="headers.depo" :items="getDepolar" :search="search" :loading="loading"
                loading-text="Yükleniyor" item-class="my-10" hide-default-footer
                :page.sync="pagination.currentPage"
                :items-per-page="-1">
                <template v-slot:item.eylemler="{ item }">
                    <v-btn x-small color="warning" icon fab @click="callbackFunction({ action: 'show', item })">
                                <v-icon> mdi-clipboard-list</v-icon>
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
                <v-card-title class="text-h6">{{ formTitle }}</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-form>
                        <v-text-field label="Depo Adı" v-model="depo.depoAd"></v-text-field>
                        <v-text-field label="Depo Adresi" v-model="depo.depoAdres"></v-text-field>
                        <v-text-field label="Depo İletişim" v-model="depo.depoIletisim"></v-text-field>
                        <v-text-field label="Depo Yetkili" v-model="depo.depoYetkili"></v-text-field>
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
                <v-card-title class="text-h6">Depo Sil</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-2">
                    <b>{{ depo.depoAd }}</b> adlı depoyu silmek istiyor musunuz?
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
            depo: { id: 0 },
            formTitle: "Depo Ekle",
            formDialog: false,
            deleteDialog: false,
            search: '',
            headers: 
            {
                depo: [
                { text: 'DEPO ADI',align: 'start',value: 'depoAd'},
                { text: 'DEPO ADRES', value: 'depoAdres' },
                { text: 'DEPO İLETİŞİM',value: 'depoIletisim'},
                { text: 'DEPO YETKİLİ',value: 'depoYetkili'},
                { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '120' },
                ],
            },
            pagination:{
                    currentPage: 1,
                    perPageItemCount: 10,
                    orderType: 1,
                    searchText: '',
                },
            e1: 1
        }

    },
    created() {
        this.$store.dispatch("depo/fetchItems",this.pagination);
    },
    computed: {
        getDepolar() {
            return this.$store.state.depo.items;
        },
        getTotalPage(){
            return this.$store.state.depo.pageCount
        },
        loading() {
            return this.$store.state.depo.loading;
        }
    },
    methods: {
        btnEkle() {
            this.depo = { id: 0 };
            this.formTitle = "Depo Ekle";
            this.formDialog = true;
        },
        btnDeleteClick(item) {
            this.depo = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnUpdateClick(item) {
            this.depo = JSON.parse(JSON.stringify(item));
            this.formTitle = 'Depo Güncelle';
            this.formDialog = true;
        },
        insertUpdateHandler() {
            this.$store.dispatch('depo/insertOrUpdateItem', this.depo);
            this.depo = {id:0}
            this.formDialog=false;
        },
        deleteHandler() {
            this.$store.dispatch('depo/deleteItem', this.depo);
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
                this.$router.push('/depo/detay/' + data.item.id)
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
                this.$store.dispatch('depo/fetchItems', this.pagination);
            }
        }
    },
    components:{
            DepoRaporGoruntule:()=>import('~/components/rapor/DepoRaporGoruntule.vue')
        }
        
}
</script>

<style scoped></style>