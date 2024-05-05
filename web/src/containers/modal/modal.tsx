import React from 'react';

import { Modal, IModalsMapInternal, IModalsMap, IModalTypeInternal } from '~/services';

interface IModalProviderProps {
  modals: IModalsMap;
}

interface IModalProviderState {
  modals: IModalTypeInternal[];
  visibleModals: IModalsMapInternal;
}

export class ModalProvider extends React.PureComponent<IModalProviderProps, IModalProviderState> {
	_removeListener: () => void;

	constructor(props: IModalProviderProps) {
		super(props);
		this.state = {
			modals: Modal.registerModals(props.modals),
			visibleModals: {},
		};

		this._removeListener = () => undefined;
	}

	componentDidMount() {
		this._removeListener = Modal.onChange(async (nextState) => {
			this.setState(prev => ({
				...prev,
				visibleModals: nextState,
			}));
		});
	}

	componentWillUnmount() {
		this._removeListener();
	}

	onModalHide = (name: string) => {
		Modal.removeVisibleModal(name);
	};

	onModalShow = (name: string, propsForComponent = {}) => {
		Modal.show(name, propsForComponent);
	};

	render() {
		const { modals, visibleModals } = this.state;

		if (modals.length === 0) {
			return null;
		}

		return modals.map((modal: IModalTypeInternal) => {
			const visibleModal = visibleModals[modal.name];
			const propsForComponent = {
				...modal?.propsForComponent,
				...visibleModal?.propsForComponent,
			};

			return (
				<div key={modal.name} >
					{visibleModal?.isRendered && modal.renderComponent({
						...propsForComponent,
						isVisible: visibleModal?.isVisible,
						hide: () => this.onModalHide(modal.name),
						open: () => this.onModalShow(modal.name)
					})}
				</div>
			);
		});
	}
}
