import React, { useEffect } from 'react';
import './App.css';

function PasswordChecker() {
	useEffect(() => {
		const callPwnedPasswordsAPI = async () => {
			try {
				const response = await fetch('https://api.pwnedpasswords.com/range/ABCDE');
				const text = await response.text();
				console.log('API response snippet:', text.split('\n').slice(0, 5));
			}
			catch (error) {
				console.error('Error calling Pwned Passwords API:', error);
			}
		};
		callPwnedPasswordsAPI();
	}, []);
	
	return (
		<div>
			<h1>Pwned Passwords API Call</h1>
			<p>testing. Api response should be in console.</p>
		</div>
	);
}

export default PasswordChecker;
