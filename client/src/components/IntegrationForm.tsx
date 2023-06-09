import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import { getSmartThingsDevices } from '../redux/slices/Session';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { Dispatch, AnyAction } from 'redux';

type DeviceOption = {
	id: string;
	name: string;
};

const IntegrationForm = () => {
	const [animationParent] = useAutoAnimate();

	const [userId, setUserId] = useState('');
	const [integrationName, setIntegrationName] = useState('');
	const [signal, setSignal] = useState('clap');
	const [devices, setDevices] = useState([
		{ deviceId: '', state: '' },
		{ deviceId: '', state: '' }
	]);
	const [deviceOptions, setDeviceOptions] = useState<DeviceOption[]>([]);

	useEffect(() => {
		async function getDevices() {
			const smartThingsDevices: any = await dispatch(
				getSmartThingsDevices(userId)
			);
			console.log(smartThingsDevices);

			const devices: DeviceOption[] = [];

			if (smartThingsDevices.payload) {
				smartThingsDevices.payload.devices.forEach((device: any) => {
					const newDevice: DeviceOption = {
						id: device.deviceId,
						name: device.label
					};
					devices.push(newDevice);
				});
				setDeviceOptions(devices);
			}
		}
		getDevices();
	}, []);

	const handleInputChange = (index: number, field: string, value: string) => {
		const updatedDevices = [...devices];
		updatedDevices[index][field] = value;
		setDevices(updatedDevices);
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		try {
			// for every item in devices
			devices.forEach((device) => {
				// if deviceId is empty, set to first one from deviceOptions.id
				if (device.deviceId === '') {
					device.deviceId = deviceOptions[0].id;
				}

				// if state is empty, set to toggle
				if (device.state === '') {
					device.state = 'toggle';
				}
			});

			const data = {
				userId,
				integrationName,
				signal,
				actions: {
					smartthings: {
						devices
					}
				}
			};
			console.log('data', data);

			// const response = await axios.post(
			// 	'https://us-central1-iconic-star-389300.cloudfunctions.net/soundconductor/smartthings/integrations',
			// 	{
			// 		userId,
			// 		integrationName,
			// 		signal,
			// 		actions: {
			// 			smartthings: {
			// 				devices
			// 			}
			// 		}
			// 	}
			// );

			// console.log('API response:', response.data);

			// setUserId('');
			// setIntegrationName('');
			// setSignal('');
			// setDevices([
			// 	{ deviceId: '', state: '' },
			// 	{ deviceId: '', state: '' }
			// ]);
		} catch (error) {
			console.error('API request error:', error);
		}
	};

	return (
		<div className="flex flex-col space-y-4 overflow-scroll h-full">
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
				<div className="flex flex-col space-y-2">
					<label htmlFor="userId" className="font-bold text-blue-500">
						User ID:
					</label>
					<input
						type="text"
						id="userId"
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
						className="border border-gray-300 rounded-md p-2"
					/>
				</div>
				<div className="flex flex-col space-y-2">
					<label
						htmlFor="integrationName"
						className="font-bold text-blue-500"
					>
						Integration Name:
					</label>
					<input
						type="text"
						id="integrationName"
						value={integrationName}
						onChange={(e) => setIntegrationName(e.target.value)}
						className="border border-gray-300 rounded-md p-2"
					/>
				</div>
				<div className="flex flex-col space-y-2">
					<label htmlFor="signal" className="font-bold text-blue-500">
						Signal:
					</label>
					{/* <input
						type="text"
						id="signal"
						value={signal}
						onChange={(e) => setSignal(e.target.value)}
						className="border border-gray-300 rounded-md p-2"
					/> */}
					<select
						id="signal"
						name="signal"
						value={signal}
						onChange={(e) => setSignal(e.target.value)}
						className="border border-gray-300 rounded-md"
					>
						<option value="clap">Clap</option>
					</select>
				</div>
				<div ref={animationParent} className="flex flex-col space-y-4">
					{devices.map((device, index) => (
						<div className="flex flex-col space-y-2" key={index}>
							<div
								key={index}
								className="flex flex-row justify-start gap-4"
							>
								<div className="flex flex-row justify-start gap-2">
									<label
										htmlFor={`deviceId${index}`}
										className="font-bold text-blue-500"
									>
										Device ID {index + 1}:
									</label>
									<button
										className="btn btn-circle btn-outline btn-xs"
										type="button"
										onClick={() =>
											setDevices(
												devices.filter(
													(_, i) => i !== index
												)
											)
										}
										aria-label="Remove Device"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>
							{/* <input
								type="text"
								id={`deviceId${index}`}
								aria-label={`Device ID ${index + 1}`}
								value={device.deviceId}
								onChange={(e) =>
									handleInputChange(
										index,
										'deviceId',
										e.target.value
									)
								}
								className="border border-gray-300 rounded-md p-2"
							/> */}
							<select
								id={`deviceId${index}`}
								aria-label={`Device ID ${index + 1}`}
								value={device.deviceId}
								onChange={(e) =>
									handleInputChange(
										index,
										'deviceId',
										e.target.value
									)
								}
								className="border border-gray-300 rounded-md p-2"
							>
								{deviceOptions.map((deviceOption) => (
									<option
										key={deviceOption.id}
										value={deviceOption.id}
									>
										{deviceOption.name}
									</option>
								))}
							</select>

							<label
								htmlFor={`state${index}`}
								className="font-bold text-blue-500"
							>
								State {index + 1}:
							</label>
							{/* <input
								type="text"
								id={`state${index}`}
								aria-label={`State ${index + 1}`}
								value={device.state}
								onChange={(e) =>
									handleInputChange(
										index,
										'state',
										e.target.value
									)
								}
								className="border border-gray-300 rounded-md p-2"
							/> */}
							<select
								id={`state${index}`}
								aria-label={`State ${index + 1}`}
								value={device.state}
								onChange={(e) =>
									handleInputChange(
										index,
										'state',
										e.target.value
									)
								}
								className="border border-gray-300 rounded-md p-2"
							>
								<option value="toggle">Toggle On/Off</option>
								<option value="on">Turn On</option>
								<option value="off">Turn Off</option>
							</select>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={() =>
						setDevices([...devices, { deviceId: '', state: '' }])
					}
					className="bg-blue-500 text-white rounded-md px-4 py-2"
				>
					Add Device
				</button>

				<button
					type="submit"
					className="bg-green-500 text-white rounded-md px-4 py-2"
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default IntegrationForm;
function dispatch(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_arg0: AsyncThunkAction<
		any,
		string,
		{
			state?: unknown;
			dispatch?: Dispatch<AnyAction> | undefined;
			extra?: unknown;
			rejectValue?: unknown;
			serializedErrorType?: unknown;
			pendingMeta?: unknown;
			fulfilledMeta?: unknown; // 	'https://us-central1-iconic-star-389300.cloudfunctions.net/soundconductor/smartthings/integrations',
			// 	'https://us-central1-iconic-star-389300.cloudfunctions.net/soundconductor/smartthings/integrations',
			// 	{
			// 		userId,
			// 		integrationName,
			// 		signal,
			// 		actions: {
			// 			smartthings: {
			// 				devices
			// 			}
			// 		}
			// 	}
			// );
			// console.log('API response:', response.data);
			// setUserId('');
			// setIntegrationName('');
			// setSignal('');
			// setDevices([
			// 	{ deviceId: '', state: '' },
			// 	{ deviceId: '', state: '' }
			// ]);
			rejectedMeta?: unknown;
		}
	>
) {
	throw new Error('Function not implemented.');
}
