enum Country {
	Ukraine = "Ukraine"
}

enum CountryCode {
	Ukraine = "Ukraine"
}

enum IIpStatus {
	Success = "success"
}

export interface IIpLocation {
	as: string;
	city: string;
	country: Country;
	countryCode: CountryCode;
	isp: string;
	lat: number;
	lon: number;
	org: string;
	query: string;
	region: string;
	regionName: string;
	status: IIpStatus;
	timezone: string;
	zip: string;
}