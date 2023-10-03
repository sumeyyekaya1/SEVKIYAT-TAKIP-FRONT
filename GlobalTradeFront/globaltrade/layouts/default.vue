<template>
    <v-app dark>
      <template>
        <v-card rounded="0">
          <v-navigation-drawer app color="#FFFFFF" v-model="drawer" :mini-variant.sync="mini" permanent>

            <v-list-item class="px-2 pa-5">
              <v-list-item-title class="font-weight-bold p-2 text-center" size="500px">
                <v-img max-height="100" max-width="100" src="/resimler/globalTradeMenuLogo.png" class="align-center"></v-img>
              </v-list-item-title>

              <v-list-item-title class="font-weight-bold text-center">{{ $auth.user.ad }} <br/> {{ $auth.user.soyad }}</v-list-item-title>

              <v-btn icon @click.stop="mini = !mini">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item>
  
            <v-list dense>
              <v-list-item v-for="item in items" :key="item.title" :to="item.to" color="#212121" @click="mini = true" link>
  
                <v-list-item-icon class="d-flex align-center pt-2">
                  <v-icon size="30">{{ item.icon }}</v-icon>
                </v-list-item-icon>
  
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold py-2">{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-group
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-icon class="d-flex align-center">
                  <v-icon size="30">mdi-file</v-icon>
                </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold py-2">RAPORLAR</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item color="#212121" @click="mini = true;dialogs.donemselMaliyetRaporu = true" link>
                  <v-list-item-content>
                    <v-list-item-title>DÖNEMSEL MALİYET RAPOR</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item color="#212121" @click="mini = true;dialogs.sevkiyatMaliyetRaporu = true" link>
                  <v-list-item-content>
                    <v-list-item-title>PROJE MALİYET RAPORU</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              <v-list-item to="/cikis" color="#212121" @click="mini = true" link>
                <v-list-item-icon class="d-flex align-center pt-2">
                  <v-icon size="30">mdi-logout</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold py-2">ÇIKIŞ YAP</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </template>
      <Snackbar />
        <v-main class="bgColor">
          <v-col class="col-12 headerColor">
            <v-row>
              <div id="headerDiv" class="col-12 d-flex justify-center align-center">
                <v-img max-height="300" max-width="400" src="/resimler/globalremovebg.svg" class="align-center"></v-img>
            </div>
            </v-row>
          
        </v-col>
        <Nuxt />
        <DonemselMaliyetRaporu :value.sync="dialogs.donemselMaliyetRaporu" />
        <SevkiyatMaliyetRaporu :value.sync="dialogs.sevkiyatMaliyetRaporu" />
      </v-main>
    </v-app>
  </template>
    
  <script>
  export default {
    name: 'DefaultLayout',
    data() {
      return {
        drawer: true,
        dialogs:{
          donemselMaliyetRaporu:false,
          sevkiyatMaliyetRaporu:false,
        },
        items: [
                { title: 'ANASAYFA', icon: 'mdi-home', to: "/" },
                { title: 'İRSALİYE İŞLEMLERİ', icon: 'mdi-file-document',to: "/irsaliye" },
                { title: 'FATURA İŞLEMLERİ', icon: 'mdi-finance',to: "/fatura" },
                { title: 'SEVKİYAT PROJELERİ', icon: 'mdi-truck-check', to: "/sevkiyat" },
                { title: 'STOK HAREKET İŞLEMLERİ', icon: 'mdi-forklift', to: "/depo" },
                { title: 'CARİ TANIM LİSTELERİ', icon: 'mdi-account-group', to: "/cari" },
                { title: 'STOK TANIM LİSTELERİ', icon: 'mdi-package-up', to: "/stok" },
                { title: 'HESAP AYARLARI', icon: 'mdi-cog-sync', to: "/profil" },
        ],
        mini: true,
      }
    },
    components: {
      Snackbar: () => import('~/components/static/Snackbar.vue'),
      DonemselMaliyetRaporu: () => import('~/components/dialogs/DonemselMaliyetRaporu.vue'),
      SevkiyatMaliyetRaporu: () => import('~/components/dialogs/SevkiyatMaliyetRaporu.vue'),
    },
  }
  </script>
  
  <style scoped>
  .letter-spacing-5 {
    letter-spacing: 5px;
    font-family: 'Josefin Sans', sans-serif;
}
#headerDiv{
    height: 160px;
    background-color: #242F9B;
}
  </style>
    