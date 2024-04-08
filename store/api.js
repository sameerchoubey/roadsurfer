
// Defining the States
const state = () => ({
    apiResponse: null,
    individualResponse: null
});

const initialState = () => ({
    apiResponse: null,
    individualResponse: null
});

// Defining Mutations
const mutations = {
    SET_API_RESPONSE(state, payload) {
        state.apiResponse = payload
    },
    SET_INDIVIDUAL_RESPONSE(state, payload) {
        state.individualResponse = payload
    },
}

// Defining Actions
const actions = {
    async GET_ACCOUNT_INFO (context) {
        // fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations').then((data) => {
        //     data.json().then(body => console.log(body))
        // })
        try {
            let res = await fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations')
            let newRes = await res.json()
            context.commit("SET_API_RESPONSE", newRes);
        } catch(err){
            context.commit("SET_API_RESPONSE", err);
        }
    },
    async GET_INDIVIDUAL_ACCOUNT_INFO (context, payload) {
        try {
            let res = await fetch(`https://605c94c36d85de00170da8b4.mockapi.io/stations/${payload.stationId}/bookings/${payload.bookingId}`)
            let newRes = await res.json()
            context.commit("SET_INDIVIDUAL_RESPONSE", newRes);
        } catch(err){
            context.commit("SET_INDIVIDUAL_RESPONSE", err);
        }
    }
}

// Exporting Methods
export default {
    namespaced: true,
    actions,
    mutations,
    state
  }