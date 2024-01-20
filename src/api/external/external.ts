import axios from 'axios';
import { publicIpv4 } from "public-ip";

import {
	IIpLocation,
} from './external.types';

class ExternalApiClass {
	async getLocation():Promise<IIpLocation> {
		const publicIpV4 = await publicIpv4();

		const res = await  axios.get(`http://ip-api.com/json/${publicIpV4}`);
		return res?.data;
	};
}

export const ExternalApi = new ExternalApiClass();
