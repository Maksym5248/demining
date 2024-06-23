const navigate = jest.fn();
export const useParams = jest.fn();
export const useLocation = jest.fn(() => ({
    pathname: 'test',
}));
export const useNavigate = jest.fn(() => navigate);

export function Outlet() {
    return <div />;
}
