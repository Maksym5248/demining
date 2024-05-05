import { NavigateOptions, useNavigate as useNavigateLib } from 'react-router-dom';

import { Analytics } from '~/services';


export const useNavigate = () =>  {
	const navigate = useNavigateLib();

	return (route:string, options?:NavigateOptions | undefined)  => {
		Analytics.page(route)
		navigate(route, options);
	}
}