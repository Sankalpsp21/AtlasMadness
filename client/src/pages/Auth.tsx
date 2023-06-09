import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewUser, setUserId } from '../redux/slices/Session';
import { AppDispatch, RootState } from '../redux/store/index';

const Auth = () => {
	const [token, setToken] = useState('');
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();
	const hasUserId = useSelector((state: RootState) => state.session.user.id);

	useEffect(() => {
		if (hasUserId) {
			navigate('/integrations');
			// trigger a page refresh so the useEffect on that page gets triggered
			window.location.reload();
		}
	}, [hasUserId, navigate]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!token) {
			return;
		}

		// trim token
		const tokenValue = token.trim();

		if (tokenValue.length === 0) {
			return;
		}

		console.log('1');

		const y = await dispatch(createNewUser(tokenValue));

		console.log('2');

		if (y.meta.requestStatus === 'rejected') {
			return;
		}

		console.log('3');

		if (y.payload) {
			// set to user id from y.payload
			dispatch(setUserId(y.payload._id));
		}

		console.log('4');

		navigate('/integrations');
		// trigger a page refresh so the useEffect on that page gets triggered
		window.location.reload();
	};

	return (
		<>
			<div className="hero min-h-screen">
				<div className="hero-content flex-col lg:flex-row-reverse p-48">
					<div className="text-center lg:text-left m-12">
						<h1 className="text-5xl font-bolds">
							Begin Your Journey with SoundConductor
						</h1>
						<p className="py-6">
							Please go to the{' '}
							<u>
								<a
									href="https://account.smartthings.com/tokens"
									target="_blank"
									style={{ color: 'blue' }}
								>
									SmartThings token page
								</a>
							</u>{' '}
							to get your personal access token to interact with
							SmartThings device. When you create a token, make
							sure to enable the checkbox for "Devices" for
							Authorized Scopes. Then copy and paste the token
							here.
						</p>
					</div>
					<div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
						<div className="card-body">
							<form onSubmit={handleSubmit}>
								<div className="form-control">
									<label className="label">
										<span className="label-text">
											Token
										</span>
									</label>
									<input
										type="text"
										placeholder="Enter Your Token Here"
										className="input input-bordered"
										onChange={(e) =>
											setToken(e.target.value)
										}
									/>
								</div>
								<div className="form-control mt-6">
									<button
										className="btn btn-primary"
										type="submit"
									>
										Enter SoundConductor
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Auth;
