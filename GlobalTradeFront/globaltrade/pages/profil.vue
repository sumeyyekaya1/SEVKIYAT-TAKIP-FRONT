<template>
    <div class="py-10 px-10">
        <v-row cols="12">
            <v-col class="col-12 col-md-6 ">
                <v-card width="100%" class="elevation-1">
                    <v-card-title>
                        KULLANICI BİLGİLERİNİZ
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h4>Ad Soyad : </h4>
                                    </td>
                                    <td><h4 class="ms-4">{{ $auth.user.adSoyad }}</h4></td>
                                </tr>
                                <tr>
                                    <td>
                                        <h4>E-Posta : </h4>
                                    </td>
                                    <td><h4 class="ms-4">{{ $auth.user.email }}</h4></td>
                                </tr>
                            </tbody>
                        </table>
                    </v-card-text>
                </v-card>
                <v-card width="100%" class="mt-2 elevation-1">
                    <v-card-title class="justify-space-between">
                        SİSTEM KULLANICILARI
                        <v-btn class="primary justify-end" @click.stop="btnEkle">KULLANICI
                            EKLE</v-btn>
                    </v-card-title>

                    <v-data-table :headers="headers.kullanici" :items="getKullanicilar" :search="search" :loading="loading"
                        loading-text="Yükleniyor" item-class="my-10" hide-default-footer :page.sync="pagination.currentPage"
                        :items-per-page="-1">

                        <template v-slot:item.eylemler="{ item }">
                            <v-btn x-small color="warning" icon fab @click="btnUpdateClick(item)">
                                <v-icon> mdi-pencil </v-icon>
                            </v-btn>
                            <v-btn x-small color="warning" icon fab @click="btnDeleteClick(item)">
                                <v-icon> mdi-delete </v-icon>
                            </v-btn>
                        </template>

                        <template v-slot:item.rol="{ item }">
                            <v-chip :color="getKullaniciRol(item.rol)?.color" outlined>
                                {{ getKullaniciRol(item.rol)?.text }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>

            <v-col class="col-12 col-md-6 ">
                <v-card width="100%" class="elavation-1">
                    <v-card-title >
                       PROFİLİ DÜZENLE
                    </v-card-title>
                    <v-card-text>
                        <v-form class="d-flex row">
                            <v-col class="col-12 col-md-6">
                                <v-text-field  label="Ad" v-model="kullanici.ad" outlined background-color="grey lighten-4"></v-text-field>
                            </v-col>
                            <v-col class="col-12 col-md-6">
                                <v-text-field label="Soyad" v-model="kullanici.soyad" outlined background-color="grey lighten-4"></v-text-field>
                            </v-col>
                            <v-col class="col-12">
                                <v-text-field label="Email" v-model="kullanici.email" outlined background-color="grey lighten-4"></v-text-field>
                            </v-col>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" class="justify-center col-4 mx-auto"
                            @click="hesapBilgileriniGuncelle">GÜNCELLE</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card width="100%" class="mt-2 elavation-1">
                    <v-card-title>
                        Şifre Bilgilerini Güncelle
                    </v-card-title>
                    <v-card-text>
                            <v-form>
                                <v-text-field label="Eski Parola" v-model="sifre.eskiParola" :rules="rules.kontrol"  outlined background-color="grey lighten-4"></v-text-field>
                                <v-text-field label="Yeni Parola" v-model="sifre.yeniParola" :rules="rules.kontrol"  outlined background-color="grey lighten-4"></v-text-field>
                                <v-text-field label="Yeni Parola Tekrar" v-model="sifre.yeniParolaTekrar" :rules="rules.kontrol"  outlined background-color="grey lighten-4"></v-text-field>
                            </v-form>

                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary"  class="justify-center col-4 mx-auto"
                                @click="parolaGuncelle">GÜNCELLE</v-btn>
                        </v-card-actions>
                </v-card>
                
            </v-col>

        </v-row>

        <v-row cols="8">

        </v-row>
        <v-dialog v-model="deleteDialog" max-width="290">
            <v-card>
                <v-card-title class="text-h6">Personel Sil</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-2">
                    <b>{{ personel.adSoyad }}</b> adlı personeli silmek istiyor musunuz?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="deleteDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="deleteHandler">Tamam</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="formDialog" max-width="500">
                <v-card>
                    <v-card-title>
                        <span>Personel Ekle</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form>
                            <v-text-field label="Ad" v-model="personel.ad" :rules="rules.kontrol" ></v-text-field>
                            <v-text-field label="Soyad" v-model="personel.soyad" :rules="rules.kontrol" ></v-text-field>
                            <v-text-field label="Email" v-model="personel.email" :rules="rules.kontrol" ></v-text-field>
                            <v-text-field label="Parola" v-model="personel.parola" :rules="rules.kontrol" ></v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="error" @click="formDialog = false">İptal</v-btn>
                        <v-btn color="primary" @click="insertUpdateHandler">Tamam</v-btn>
                    </v-card-actions>

                </v-card>
            </v-dialog>

            <v-dialog v-model="updateDialog" max-width="500">
                <v-card>
                    <v-card-title>
                        <span>Personel Güncelle</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form>
                            <v-text-field label="Ad" v-model="personel.ad" :rules="rules.kontrol" ></v-text-field>
                            <v-text-field label="Soyad" v-model="personel.soyad" :rules="rules.kontrol" ></v-text-field>
                            <v-text-field label="Email" v-model="personel.email" :rules="rules.kontrol" ></v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="error" @click="updateDialog = false">İptal</v-btn>
                        <v-btn color="primary" @click="insertUpdateHandler">Tamam</v-btn>
                    </v-card-actions>

                </v-card>
            </v-dialog>
    </div>
</template>


<script>
export default {
    layout: "default",
    data() {
        return {
            kullanici: { id: 0 },
            personel:{id:0},
            formTitle: "Personel Ekle",
            formDialog: false,
            deleteDialog: false,
            updateDialog: false,
            sifre:{id:0},
            search: '',
            headers:
            {
                kullanici: [
                    { text: 'AD', align: 'start', value: 'ad' },
                    { text: 'SOYAD', align: 'start', value: 'soyad' },
                    { text: 'EMAİL', value: 'email' },
                    { text: 'EYLEMLER', value: 'eylemler', sortable: false, align: 'right', width: '120' },
                ]
            },
            pagination: {
                currentPage: 1,
                perPageItemCount: 10,
                orderType: 1,
                searchText: '',
            },
            rules: {
                kontrol: [
                    v => !!v || 'Boş bırakılamaz!'
                ]

            }
        }

    },
    mounted() {
        this.$store.dispatch("kullanici/fetchItems", this.pagination);
        this.kullanici =JSON.parse(JSON.stringify(this.$auth.user))
    },
    computed: {
        getKullanicilar() {
            return this.$store.state.kullanici.items;
        },
        async getKullaniciBilgi() {
            this.model = await this.$auth.userWith('kullanici', {
                data: this.kullanici
            })
            return model
        },
        getTotalPage() {
            return this.$store.state.kullanici.pageCount
        },
        loading() {
            return this.$store.state.kullanici.loading;
        },
        getRoller() {
            return this.$store.state.enums.kullaniciRol.items
        },
    },
    methods: {
        btnEkle() {
            this.personel = { id: 0 };
            this.formTitle = "Personel Ekle";
            this.formDialog = true;
        },
        getPersonelRol(durum) {
            return this.$store.state.enums.kullaniciRol.items.find(x => x.id == durum)
        },
        btnDeleteClick(item) {
            this.personel = JSON.parse(JSON.stringify(item));
            this.deleteDialog = true;
        },
        btnUpdateClick(item) {
            this.personel = JSON.parse(JSON.stringify(item));
            this.formTitle = 'Personel Güncelle';
            this.updateDialog = true;
        },
        async insertUpdateHandler() {
            this.$store.dispatch('kullanici/insertOrUpdateItem', this.personel);
            this.updateDialog = false;
        },
        async hesapBilgileriniGuncelle(){
            this.kullanici.id = this.$auth.user.id;
            this.kullanici.rol = this.$auth.user.rol;
            this.$store.dispatch('kullanici/insertOrUpdateItem', this.kullanici);
        },
        async parolaGuncelle() {
            try{
                await this.$store.dispatch('kullanici/updateParolaItem', this.sifre);
                await this.$auth.logout()
            }catch(error)
            {

            }
        },
        
        deleteHandler() {
            this.$store.dispatch('kullanici/deleteItem', this.personel);
            this.deleteDialog = false;
        },
        getKullaniciRol(durum) {
            return this.$store.state.enums.kullaniciRol.items.find(x => x.id == durum)
        },
    },
    watch: {
        'pagination.currentPage': {
            handler() {
                this.$store.dispatch('kullanici/fetchItems', this.pagination);
            }
        }
    }

} 
</script>

<style scoped></style>