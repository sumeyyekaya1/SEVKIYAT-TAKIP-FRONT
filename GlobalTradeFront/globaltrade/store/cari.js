import qs from "qs"
export const state = () => ({
    loading: false,
    items: [],
    succedItem:{},
    pageCount:1,
    count:0
})

export const getters = {
    getItems(state) {
        return state.items;
    }
}

export const mutations = {
    setLoading(state, value) {
        state.loading = value
    },
    setItems(state, value) {
        state.items = value
    },
    setCount(state, value) {
        state.count = value
    },
    setSuccedItem(state,value){
        state.succedItem = value
    },
    addItem(state, value) {
        state.items.push(value)
    },
    updateItem(state, value) {
        state.items = state.items.map(x => x.id === value.id ? value : x)
    },
    deleteItem(state, value) {
        const i = state.items.map(x => x.id).indexOf(value.id)
        state.items.splice(i, 1)
    },
    setPageCount(state,value){
        state.pageCount = value
    }
}

export const actions = {
    async fetchAllItems({ commit }) {
        commit('setLoading', true)
        try {
            const items = await this.$axios.$get('Cari/List')
            commit('setItems', items.value)
            commit('setLoading', false)
        } catch (error) {
            commit('setItems', [])
        }
    },
    async fetchItems({commit},item)
    {
        commit('setLoading',true)
        try{
            const response = await this.$axios.$get('Cari/PagedList',{ params: item, paramsSerializer: (params) => { return qs.stringify(Object.fromEntries(Object.entries(params).filter(([k, v]) => v), { arrayFormat: 'repeat', skipNulls: true }), { indices: false }) } })
            commit('setPageCount', response.pageCount)
            commit('setItems',response.value)
            commit('setLoading',false)
        }catch(error){
            commit('setLoading',false)
            throw error
        }
    },
    async toplamCariAdet({ commit }) {
        commit('setLoading', true)
        try {
            const items = await this.$axios.$get('Cari/ToplamCariAdet')
            commit('setCount', items.value)
            commit('setLoading', false)
        } catch (error) {
            commit('setCount', 0)
        }
    },
    async getItems(context){
        context.commit("setItems",[])
        context.commit("setLoading",true)
        const res = await this.$axios.$get(`Cari/Get/${item.id}`)
        context.commit("setItems",res.data.value)
        context.commit("setLoading",false)
    },
    async insertOrUpdateItem({ commit }, item) {
        commit('setLoading', true)
        try {
            if (item.id === 0) {
                const response = await this.$axios.$post('Cari/Add', item)
                commit('addItem', response.value)
                commit('setSuccedItem',response.value)
            } else {
                const response = await this.$axios.$put('Cari/Update', item)
                commit('updateItem', response.value)
                commit('setSuccedItem',response.value)
            }
            commit('setLoading', false)
            
        } catch (error) {
            commit('setSuccedItem',{uretimPlan:{id:0}})
        }
    },
    async deleteItem({ commit }, item) {
        commit('setLoading', true)
        try {
            const res = await this.$axios.$delete(`Cari/Delete/${item.id}`)
            commit('deleteItem', res.value)
            commit('setLoading', false)
        } catch (error) {

        }
    }
}