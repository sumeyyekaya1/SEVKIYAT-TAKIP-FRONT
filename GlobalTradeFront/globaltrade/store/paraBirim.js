
export const state = () => ({
    loading: false,
    items: [],
    succedItem:{},
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
    }
}

export const actions = {
    async fetchItems({ commit }) {
        commit('setLoading', true)
        try {
            const items = await this.$axios.$get('ParaBirim/List')
            commit('setItems', items.value)
            commit('setLoading', false)
        } catch (error) {
            commit('setItems', [])
        }
    }
}