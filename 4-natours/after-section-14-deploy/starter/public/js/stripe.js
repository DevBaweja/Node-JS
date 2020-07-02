/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_KtdmGOpnmRXdWUk5DZ1sPl8h00TyLD4Xmx');
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
    try {
        // Get session from sever from endpoint of api
        const { data } = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`
        );
        // Create checkout form + charge credit card for tour
        await stripe.redirectToCheckout({
            sessionId: data.session.id,
        });
    } catch (err) {
        // console.log(err);
        showAlert('error', err);
    }
};
