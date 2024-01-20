import { MapView } from "~/components"

const mapContainerStyle = {
	width: '640px',
	height: '600px',
};

export function Map(){
	// const [canvas, setCanvas] = useState<string>();
	
	// const onStartCapture = async () => {
	// 	const url = await Image.takeMapImage("#capture");
	// 	setCanvas(url)
	// };

	// const handleSave = () => {
	// 	const downloadLink = document.createElement('a');
	// 	const fileName = 'react-screen-capture.png';

	// 	downloadLink.href = screenCapture;
	// 	downloadLink.download = fileName;
	// 	downloadLink.click();
	// };

	return (
		<div id="capture">
			<MapView mapContainerStyle={mapContainerStyle}/>
		</div>
	)
}