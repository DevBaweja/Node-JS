/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}
if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}
if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}
if (userDataForm) {
    userDataForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        document.querySelector('.btn--save-data').textContent = 'Updating...';
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        await updateSettings({ name, email }, 'data');
        document.querySelector('.btn--save-data').textContent = 'Save settings';
    });
}
if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        const passwordCurrent = document.getElementById('password-current')
            .value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm')
            .value;
        const status = await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );
        document.querySelector('.btn--save-password').textContent =
            'Save Password';

        if (status === 'success') {
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
        }
    });
}
