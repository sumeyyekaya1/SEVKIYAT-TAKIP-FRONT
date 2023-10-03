<template>
    <div class="col-12 d-flex justify-center align-center mt-5">
        <v-card class="col-12">
            <v-card-title>
                FATURALAR
                <v-spacer></v-spacer>
                <v-flex class="d-flex flex justify-end px-4">
                    <v-text-field v-model="search" append-icon="mdi-magnify" @keydown.enter="searchDatabase()" label="Ara"
                        placeholder="Ara" class="d-flex flex sm5" dense outlined single-line hide-details></v-text-field>
                </v-flex>
            </v-card-title>
            <v-divider class="mx-0" />

            <v-data-table :headers="headers.fatura" :items="getFaturalar" :search="search" :loading="loading"
                loading-text="Yükleniyor" item-class="my-10" hide-default-footer :page.sync="pagination.currentPage"
                :items-per-page="-1">

                <template v-slot:item.faturaTur="{ item }">
                    <v-chip :color="getFaturaTurDurum(item?.faturaTur)?.color">
                        {{ getFaturaTurDurum(item?.faturaTur)?.text }}
                    </v-chip>
                </template>

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

    </div>
</template>

<script>
export default {
    layout: "default",
    data() {
        return {
            model:  { id: 0 },
            search: '',
            headers:
            {
                fatura: [
                    { text: 'FATURA NO', align: 'start', value: 'faturaNo' },
                    { text: 'TİCARİ UNVAN', align: 'start', value: 'cari.ticariUnvan' },
                    { text: 'PROJE NO', value: 'projeNo' },
                    { text: 'FATURA TÜR', value: 'faturaTur' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '180' },
                ]

            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
            },
        }

    },
    created() {
        this.$store.dispatch("fatura/fetchItems", this.pagination);
    },
    computed: {
        getFaturalar() {
            return this.$store.state.fatura.items;
        },
      
        getTotalPage() {
            return this.$store.state.fatura.pageCount
        },
        loading() {
            return this.$store.state.fatura.loading;
        }
    },
    methods: {
        searchDatabase() {
            this.pagination.currentPage = 1
            this.pagination.searchText = this.search
            this.$store.dispatch('fatura/fetchItems', this.pagination);
        },
        getFaturaTurDurum(durum) {
            console.log(durum)
            return this.$store.state.enums.faturaTurDurum.items.find(x => x.id == durum)
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
                this.$router.push('/fatura/detay/' + data.item.id)
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
                this.$store.dispatch('fatura/fetchItems', this.pagination);
            }
        }
    }

}
</script>

<style scoped></style>