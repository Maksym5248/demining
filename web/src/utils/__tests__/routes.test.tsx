import { nav } from '../routes';

const { withAccess } = nav;

describe('nav', () => {
	describe('withAccess', () => {
		it('should return the route with the provided element', () => {
			const route = { path: '/home', element: <div>Home</div> };
			const element = <div>Access Element</div>;

			expect(withAccess(route, element)).toStrictEqual({
				element: <div>Access Element</div>,
				children: [route],
			});
		});

		it('should return the route with the provided elements in correct order', () => {
			const route = { path: '/home', element: <div>Home</div> };
			const elements = [
				<div key="1">Access Element 1</div>,
				<div key="2">Access Element 2</div>,
				<div key="3">Access Element 3</div>,
			];

			expect(withAccess(route, elements)).toStrictEqual({
				element: <div key="1">Access Element 1</div>,
				children: [
					{
						element: <div key="2">Access Element 2</div>,
						children: [
							{
								element: <div key="3">Access Element 3</div>,
								children: [route],
							},
						],
					},
				],
			});
		});
	});
});
