<template>
	<div>
		<div
			class="flex justify-between mt-10"
		>
			<button
				@click="handleNavigation('left')"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2"
			>
				Previous Week
			</button>

			<select v-model="selected">
				<option disabled value="">Please select one</option>
				<option v-for="(item) in getDropdownList"> {{ item.name }}</option>
			</select>

			<button
				@click="handleNavigation('right')"
				class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2"
			>
				Next Week
			</button>
		</div>

		<p
			v-if="weekBefore && weekAfter"
			class="mt-5 text-center font-mono font-normal text-12 text-charcoal-gray leading-tight tracking-normal antialiased"
		>
			Showing data from {{ getWeekBefore }} to {{ getWeekAfter }}
		</p>

		<div
			v-if="getWeekDifference"
			class="w-full grid grid-cols-7 gap-4 mt-20"
		>
			<div
				class="basic-grid px-1 py-2"
				v-for="(item, key) in mapDatesWithData"
				:key="key"
			>
				<p 
					class="text-center font-mono font-normal text-12 text-charcoal-gray leading-tight tracking-normal antialiased"
				>
					{{ item.date}}
				</p>

				<div
					v-if="item.bookings && item.bookings.length > 0"
					class="mt-4"
				>
					<div
						v-for="(item, key) in item.bookings"
					>
						<p
							@click="viewDetails(item)"
							class="cursor-pointer text-center font-mono font-normal text-xs text-blue-900 leading-tight tracking-normal antialiased"
							:class="key > 0 ? 'mt-1' : ''"
						>
							{{ item.type + item.customerName }}
						</p>
					</div>
				</div>
				
			</div>
		</div>

		<transition
			name="slide-fade"
			class="relative"     
		>
			<div
				v-if="showDetailView && individualResponse"
				class="basic-grid mx-auto mt-5 px-5"
				style="width:720px; height:320px"
			>
				<div
					@click="closeDetailView()"
					class="self-center justify-end cursor-pointer pt-5 flex justify-end"
				>
					<svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13 1 1 13M1 1l12 12" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
			
				</div>
				<table class="mt-4">
					<tr>
						<th>Company</th>
						<th>Contact</th>
					</tr>
					<tr>
						<td>Booking ID</td>
						<td>{{ individualResponse.id }}</td>
					</tr>
					<tr>
						<td>Station ID</td>
						<td>{{ individualResponse.pickupReturnStationId }}</td>
					</tr>
					<tr>
						<td>Customer Name</td>
						<td>{{ individualResponse.customerName }}</td>
					</tr>
					<tr>
						<td>Start Date</td>
						<td>{{ moment(individualResponse.startDate).format('MMM DD, YYYY') }}</td>
					</tr>
					<tr>
						<td>End Date</td>
						<td>{{ moment(individualResponse.endDate).format('MMM DD, YYYY') }}</td>
					</tr>
				</table>
			</div>
		</transition>
	</div>
</template>
  
<script>
	import moment from 'moment';
	import { mapState } from 'vuex';
	
	export default {
		name: 'Week',
		data () {
			return {
				moment: moment,
				selected: 'Berlin',
				currentWeek: '',
				weekBefore: '',
				weekAfter: '',
				showDetailView: false
			}
		},
		mounted(){
			let dt = new Date();
			this.weekBefore = new moment('2021-03-13T00:00:00.402Z')
			this.weekAfter = new moment('2021-03-19T00:00:00.402Z')
		},
		computed: {
			...mapState ({
				apiResponse: state => state.api.apiResponse,
				individualResponse: state => state.api.individualResponse,
			}),
			getCurrentWeek(data){
				let dateformat = "MMM DD, YYYY";
				let date = this.weekBefore ? moment(this.weekBefore,dateformat) : moment(), weeklength=7, result=[];
				date = date.startOf("week")
				while(weeklength--)
				{
					result.push(date.format(dateformat));
					date.add(1,"day")
				}
				return result;
			},
			getDropdownList(){
				let res = []
				if(this.apiResponse && this.apiResponse.length > 0){
					this.apiResponse.forEach(item => {
						if(item.bookings && item.bookings.length > 0) res.push({id: item.id, name: item.name})
					})
				}
				return res
			},
			getDataForSelectedCity(){
				let res
				if(this.selected && this.apiResponse && this.apiResponse.length > 0){
					res = this.apiResponse.find((item) => item.name == this.selected)
				}
				return res
			},
			getWeekBefore(){
				return this.moment(this.weekBefore).format("MMM DD, YYYY")
			},
			getWeekAfter(){
				return this.moment(this.weekAfter).format("MMM DD, YYYY")
			},
			getWeekDifference(){
				let a = this.moment(this.getWeekAfter)
				let b = this.moment(this.getWeekBefore)
				return a.diff(b, 'days')
			},
			mapDatesWithData() {
				let allData = this.getDataForSelectedCity && this.getDataForSelectedCity.bookings ? this.getDataForSelectedCity.bookings : []
				let allDates = this.getCurrentWeek && this.getCurrentWeek.length > 0 ? this.getCurrentWeek : [];
				const mappedData = [];

				if(allDates && allDates.length > 0){

					//Mapping start and end date in the week array.
					allDates.forEach(date => {
						const formattedDate = moment(date, 'MMM DD, YYYY').format('YYYY-MM-DD');
        
						const bookingsForDate = allData.filter(item => {
							const startDateFormatted = moment(item.startDate).format('YYYY-MM-DD');
							const endDateFormatted = moment(item.endDate).format('YYYY-MM-DD');
							return startDateFormatted === formattedDate || endDateFormatted === formattedDate;
						}).map(item => {
							const startDateFormatted = moment(item.startDate).format('YYYY-MM-DD');
							const endDateFormatted = moment(item.endDate).format('YYYY-MM-DD');
							let type = "";
							if (startDateFormatted === formattedDate) {
								type = "Pickup: ";
							}
							if (endDateFormatted === formattedDate) {
								type = "Drop: ";
							}
							return {
								id: item.id,
								pickupReturnStationId: item.pickupReturnStationId,
								customerName: item.customerName,
								startDate: item.startDate,
								endDate: item.endDate,
								type: type
							};
						});

						mappedData.push({
							date: date,
							bookings: bookingsForDate
						});
					});
				}

				return mappedData;
			}
		},
		methods: {
			//Function to navigate between weeks
			handleNavigation(type){
				this.closeDetailView();
				if(type == 'left'){
					console.timeLog()
					this.weekBefore = moment(this.weekBefore).subtract(6, 'days')
					this.weekAfter = moment(this.weekAfter).subtract(6, 'days')
				} else if(type == 'right'){
					this.weekBefore = moment(this.weekBefore).add(6, 'days')
					this.weekAfter = moment(this.weekAfter).add(6, 'days')
				}
			},
			//Function to view further details of a particular booking
			async viewDetails(item){
				this.showDetailView = true
				let payload = {
					stationId: item.pickupReturnStationId,
					bookingId: item.id
				}
				let res = await this.$store.dispatch("api/GET_INDIVIDUAL_ACCOUNT_INFO", payload)
			},
			//Function to close the detail view section
			closeDetailView(){
				this.showDetailView = false
			}
		}
	}
</script>

<style scoped>
	.basic-grid {
		width: 170px;
		height: 170px;
		border: 1px solid black;
	}
	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
	  }
	  
	  td, th {
		border: 1px solid #dddddd;
		text-align: left;
		padding: 8px;
	  }
	  
	  tr:nth-child(even) {
		background-color: #dddddd;
	  }
</style>
  