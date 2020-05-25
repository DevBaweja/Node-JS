/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Type is either password or data
export const updateSettings = async (data, type) => {
    try {
        const urllink = type === 'password' ? 'updateMyPassword' : 'updateMe';
        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/users/${urllink}`,
            data,
        });
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
        return 'success';
    } catch (err) {
        showAlert('error', err.response.data.message);
        return 'error';
    }
};
