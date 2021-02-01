const { google } = require('googleapis');
const key = require('./googlekey/arislab-08accf5b504b.json');

export class GoogleApi {

	private CLIENT_EMAIL: string = 'google-api-analytic@arislab.iam.gserviceaccount.com';
	private PRIVATE_KEY: string = 'AIzaSyD7z6LKScdCcP9zGMGfRiGbzCsiF36E7ZM';
	private jwt: any = {};

	// ANALYTICS CONFIG
	private ANALYTICS_SCOPES: Array<string> = ['https://www.googleapis.com/auth/analytics.readonly'];
	private ANALYTICS_API_V: string = 'v3';
	private ANALYTICS_VIEW_ID: string = '199306064';
	private ANALYTICS_END_DAY: string = 'yesterday';
	private analyticsDay: Number = 0;
	private analyticsDefaultsQuery: any = {};
	
	public constructor() {
		this.analyticsDay = 7;
    }
	
	public async connectToAnalytics() {
		
		this.jwt = new google.auth.JWT(this.CLIENT_EMAIL, null, key.private_key, this.ANALYTICS_SCOPES, null);
		this.analyticsDefaultsQuery = {
			'auth': this.jwt,
  			'ids': `ga:${this.ANALYTICS_VIEW_ID}`,
		};
		
		const response = await this.jwt.authorize((error:any, tokens:any) => {
			// if (error) {
			// 	console.error('Error connecting to GA:', error);
			// } else {
			// 	console.log('Authorized!', tokens);
			// }
		});
		// console.log('response ==> ', response);
		
	}

	public setAnalyticsDay(_analyticsDay: Number) {
		this.analyticsDay = _analyticsDay;
	}

	private async fetchAnalyticData(queryObj: any) {
		// console.log('queryObj ==> ', queryObj);
		const result = await google.analytics(this.ANALYTICS_API_V).data.ga.get(queryObj);
		// console.log('result ==> ', result);
		return result.data.rows;
	}

	public async getNewVisitorsOnHomepage() {
		var query: any = {
			...this.analyticsDefaultsQuery,
			'start-date': `${this.analyticsDay}daysAgo`,
  			'end-date': this.ANALYTICS_END_DAY,
			'metrics': 'ga:newUsers',
			'dimensions': 'ga:date',
  			'filters': "ga:eventCategory==Homepage;ga:eventAction==View;ga:eventLabel==Aris Homepage"
		};
		var resultData = this.fetchAnalyticData(query);
		return resultData;
	}

	public async getNewVisitorsClickOnHomepage() {
		var query: any = {
			...this.analyticsDefaultsQuery,
			'start-date': `${this.analyticsDay}daysAgo`,
  			'end-date': this.ANALYTICS_END_DAY,
			'metrics': 'ga:newUsers',
			'dimensions': 'ga:date',
  			'filters': "ga:eventCategory==Homepage;ga:eventAction==Click"
		};
		var resultData = this.fetchAnalyticData(query);
		return resultData;
	}

	public async getNewVisitorsOnLoginPage() {
		var query: any = {
			...this.analyticsDefaultsQuery,
			'start-date': `${this.analyticsDay}daysAgo`,
  			'end-date': this.ANALYTICS_END_DAY,
  			'metrics': 'ga:newUsers',
			'dimensions': 'ga:date',
  			'filters': "ga:eventCategory==Login Page;ga:eventAction==View;ga:eventLabel==Initial login page"
		};
		var resultData = this.fetchAnalyticData(query);
		return resultData;
	}

	public async getVisitorsOnOTPConfirmationPage() {
		var query: any = {
			...this.analyticsDefaultsQuery,
			'start-date': `${this.analyticsDay}daysAgo`,
  			'end-date': this.ANALYTICS_END_DAY,
  			'metrics': 'ga:users',
			'dimensions': 'ga:date',
  			'filters': "ga:eventCategory==Landing;ga:eventAction==View;ga:eventLabel==View OTP confirmation page"
		};
		var resultData = this.fetchAnalyticData(query);
		return resultData;
	}

	public async getVisitorsOnPINCodePage() {
		var query: any = {
			...this.analyticsDefaultsQuery,
			'start-date': `${this.analyticsDay}daysAgo`,
  			'end-date': this.ANALYTICS_END_DAY,
  			'metrics': 'ga:users',
			'dimensions': 'ga:date',
  			'filters': "ga:eventCategory==Landing;ga:eventAction==View;ga:eventLabel==View PIN code page"
		};
		var resultData = this.fetchAnalyticData(query);
		return resultData;
	}

	public async getVisitorsOnPINCode2Page() {
		var query: any = {
			...this.analyticsDefaultsQuery,
			'start-date': `${this.analyticsDay}daysAgo`,
  			'end-date': this.ANALYTICS_END_DAY,
  			'metrics': 'ga:users',
			'dimensions': 'ga:date',
  			'filters': "ga:eventCategory==Landing;ga:eventAction==Click;ga:eventLabel==Click Pin Code next button"
		};
		var resultData = this.fetchAnalyticData(query);
		return resultData;
	}
	
}