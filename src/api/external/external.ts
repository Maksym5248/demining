import axios from 'axios';
import { publicIpv4 } from "public-ip";

import { ILatLng } from '~/types';

import {
	IIpLocation,
} from './external.types';

class ExternalApiClass {
	async getLocation():Promise<IIpLocation> {
		const publicIpV4 = await publicIpv4();

		const res = await  axios.get(`http://ip-api.com/json/${publicIpV4}`);
		return res?.data;
	};

	getGeocode(value: ILatLng):Promise<string> {
		return new Promise((resolve, reject) => {
			const geocoder = new google.maps.Geocoder();
			const latlng = new google.maps.LatLng(value.lat, value.lng);
		
			geocoder.geocode({ location: latlng, language: "uk" }, (results, status) => {
				const [response] = results?? [undefined];

				if (status === 'OK' && response) {
					const region = response.address_components.find(component => component.types.includes("administrative_area_level_1"))
					const town = response.address_components.find(component => component.types.includes("locality"))
					const street = response.address_components.find(component => component.types.includes("route"))
					const streetNumber = response.address_components.find(component => component.types.includes("street_number"))

					const address = [region, town, street, streetNumber]
					resolve(address.map(el => el?.long_name).join(", "));

				} else if(status === 'OK' && !response) {
					resolve('No address found');
				} else {
					reject(Error(`Geocoder failed due to: ${status}`));
				}
			})
		});
	};
}

export const ExternalApi = new ExternalApiClass();
