import axios from 'axios';
import { pick } from 'lodash';
import { publicIpv4 } from 'public-ip';

import { type IPoint } from '~/map';

import { type IIpLocation, type IGeoapifyAddress } from './external.types';

export class ExternalApi {
    constructor(private geoApiGyKey: string) {}

    async getLocation(): Promise<IIpLocation> {
        const publicIpV4 = await publicIpv4();

        const res = await axios.get(`http://ip-api.com/json/${publicIpV4}`);
        return res?.data;
    }

    async getGeocode(value: IPoint): Promise<IGeoapifyAddress> {
        const requestOptions = {
            method: 'GET',
        };

        const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${value.lat}&lon=${value.lng}&format=json&lang=uk&apiKey=${this.geoApiGyKey}`,
            requestOptions,
        );
        const data = await res.json();

        return pick(data?.results[0], ['city', 'country', 'district', 'housenumber', 'postcode', 'state', 'street', 'municipality']);
    }
}
