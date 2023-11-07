import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'cookies-js';
import { baseUrl } from '../../../../env.config';
import { useQueryString } from '../../../../shared/hooks/useQueryString';
import { useAccountStore } from '../../../store';
import toast from 'react-hot-toast';
import { decode } from 'jsonwebtoken';


const BillingContent = () => {
  const [stripeCheckout, setStripeCheckout] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [upsellSubscription, setUpsellSubscription] = useState(null);
  const [thankYou, setThankYou] = useState(null);
  const [billingFailed, setBillingFailed] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [chosenSeats, setChosenSeats] = useState(null);
  const [newPrice, setNewPrice] = useState(null);
  const [expiraionDate, setExpiraionDate] = useState(null);
  const [planExpired, setPlanExpired] = useState(null);
  const query = useQueryString();
  const store = useAccountStore();

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  var currentDate = `${month}/${day}/${year}`;

  const handleSeatsForm = (e) => {
    e.preventDefault();

    var date1 = new Date(expiraionDate);
    var date2 = new Date(currentDate);

    if (chosenSeats === null || chosenSeats === 0) {
      toast.error('Invalid number of seats');

    } else if (date2 > date1) {
      toast.error('Your plan is expired, so you cannot updates the seat.');

    } else {

      const token =
        query.get('access_token') ||
        store.state.bearer ||
        Cookies.get('videosupport-io-token');

      axios
        .post(
          'stripe/update-seats',
          {
            chosenSeats,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            toast.success(`Seats updated to ${chosenSeats}`);
            updateCurrentSubscription();
          } else {
            toast.error(`Error updating seats: ${res.data.msg}`);
          }
        })
        .catch((e) => {
          console.log('update-seats catch = ', e)
          toast.error(
            'Error updating number of seats. Contact us at hello@videosupport.io for support'
          );
        });
    }
  };

  useEffect(() => {

    if (currentSubscription && currentSubscription.expirationDate) {

      const date = new Date(currentSubscription.expirationDate);
      setExpiraionDate(date.toLocaleDateString('en-US'));

      var date1 = new Date(currentSubscription.expirationDate);
      var date2 = new Date(currentDate);

      if (date2 > date1) {
        console.log('planExpired')
        setPlanExpired(true);
      } else {
        console.log('not planExpired')
      }

      if (currentSubscription.name.toLowerCase() == 'trial') {

        console.log('trial plan, show upgrade plan link')
        setActivePlan(false);

      } else {

        if (date2 > date1) {
          setActivePlan(false);
        } else {
          setActivePlan(true);
        }
      }
    }

    if (currentSubscription && currentSubscription.pricePerSeat) {
      let calc_free_seats = currentSubscription.seats - currentSubscription.paidSeats;
      let chosen = isNaN(chosenSeats) ? '0' : chosenSeats;
      console.group('current subscription and seat update')
      console.log(currentSubscription);
      console.log('FREE SEATS IN BILLING CONTENT:', currentSubscription.freeSeats)
      console.warn('chosenSeats:', chosenSeats)
      console.warn('calc_free_seats:', calc_free_seats)
      console.warn('paidSeats:', currentSubscription.paidSeats)
      console.groupEnd();

      setNewPrice(currentSubscription.pricePerSeat * (chosen - calc_free_seats));
    }

  }, [currentSubscription, chosenSeats]);

  const updateCurrentSubscription = () => {

    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');
    axios
      .post(
        baseUrl('db/organization/subscription'),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((current) => {
        const data = current.data;
        setChosenSeats(data.seats);
        if (data.upsell) setUpsellSubscription(data.upsell);
        if (data.seats && typeof data.seats === 'number') {
          setCurrentSubscription(data);
        } else {
          setCurrentSubscription({
            ...data,
            seats: data.seats.amount,
          })
        }
      });
  };

  useEffect(() => {
    updateCurrentSubscription();
  }, []);

  useEffect(() => {
    setThankYou(query.get('success'));
  }, []);

  useEffect(() => {
    setBillingFailed(query.get('fail'));
  }, []);

  useEffect(() => {

    // console.log('BS: currentSubscription = ', currentSubscription)
    // console.log('BS: activePlan = ', activePlan)

    if (currentSubscription != null) {

      console.warn('BS: currentSubscription = ', currentSubscription);

      if (upsellSubscription || activePlan === false) {

        console.log('no active plan, get checkout link')

        var my_seats = 1;

        if (currentSubscription.seats.amount) {
          my_seats = currentSubscription.seats.amount;
        }

        var subscriptionKey = 'basic';

        if (upsellSubscription != null) {
          subscriptionKey = upsellSubscription.subscriptionKey;
        }

        const token =
          query.get('access_token') ||
          store.state.bearer ||
          Cookies.get('videosupport-io-token');
        axios
          .post(
            baseUrl('stripe/create-checkout'),
            {
              subscriptionKey: subscriptionKey,
              //seats: currentSubscription.seats,
              seats: my_seats,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log('res.data = ', res.data)
            setStripeCheckout(res.data);
          });
      }
    }
  }, [currentSubscription, upsellSubscription]);

  return (
    <div className="dpf cnw settings settings__form">
      {thankYou && (
        <header className="header">
          <h2 className="headline">Thank you for your purchase!</h2>
        </header>
      )}
      {billingFailed && (
        <header className="header">
          <h2 className="headline">Sorry, your purchase failed.</h2>
          <p className="description text">
            Try again later or contact us at hello@videosupport.io
          </p>
        </header>
      )}

      <header className="header">
        <h2 className="headline">Current plan</h2>
      </header>
      <div className="dpf cnw input__group">
        {currentSubscription && (
          <div className={`dpf cnw input__content`}>
            <label htmlFor="referrerUrl" className="input__label">
              {new Date(currentSubscription.expirationDate) < new Date() ? "No active plan" : currentSubscription.subscriptionDisplayName}
            </label>
            {currentSubscription.totalPrice > 0 && (
              <p className="description text">
                ${currentSubscription.totalPrice.toFixed(2)}/mo (
                {currentSubscription.paidSeats} seats)
              </p>
            )}
            {currentSubscription.totalPrice === 0 && (
              <p className="description text">Free</p>
            )}
            {(currentSubscription.totalPrice !== 0 || currentSubscription.name == 'Trial') && currentSubscription.expirationDate && (
              <p className="description text">
                {new Date(currentSubscription.expirationDate) < new Date() ? "Expired On:" : "Expires on:"}{" "}
                {expiraionDate}
              </p>
            )}
            {activePlan && (
              <form className="dpf cnw aic form" onSubmit={handleSeatsForm}>
                <div className="dpf cnw input__group">
                  <div className={`dpf cnw input__content`}>
                    <label htmlFor="referrerUrl" className="input__label">
                      Increase number of seats:
                    </label>
                    <input
                      type="number"
                      className="input__text"
                      id="referrerUrl"
                      autoComplete="off"
                      onChange={(e) => {
                        setChosenSeats(parseInt(e.target.value));
                      }}
                      defaultValue={currentSubscription.seats}
                      required
                    />
                    {newPrice !== null && (
                      <p className="description text">
                        New price: ${newPrice.toFixed(2)}/mo
                      </p>
                    )}
                  </div>
                </div>
                <button className={`dpif aic jcc button`} role="submit">
                  Apply
                </button>
              </form>
            )}
          </div>
        )}
        <hr></hr>

        {!activePlan && upsellSubscription && stripeCheckout && (
          <div className="dpf cnw settings settings__form">

            {planExpired === true && (
              <label htmlFor="referrerUrl" className="input__label cl_red">
                Your current plan is expired. Upgrade your plan to access all pages, features and to add additional seats.
              </label>
            )}

            <header className="header">
              <h2 className="headline">Upgrade your plan</h2>
            </header>
            <div className="dpf vnw input__group">
              <div className={`dpf cnw input__content`}>
                <label htmlFor="referrerUrl" className="input__label">
                  {upsellSubscription.name}
                </label>
                <p className="description text">
                  ${upsellSubscription.pricePerSeat}/mo (
                  {currentSubscription.seats} seats)
                </p>
                <p>
                  <a href={stripeCheckout}>Upgrade plan</a>
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
      <style jsx>{`
        .header {
          margin-bottom: 16px;
        }

        .input__label.cl_red{
          color:red;
          margin-bottom:15px;
        }

        .headline {
          font-size: 22px;
          font-weight: 500;
        }

        .form {
          width: 100%;
          position: relative;
        }

        .input__group {
          width: 100%;
        }

        .input__group + .input__group {
          margin-top: 32px;
        }

        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
          color: #0b0b0b;
        }

        .description {
          margin: 4px 0 8px;
        }
        .text {
          color: #a1a1a1;
          font-size: 14px;
          line-height: 22px;
        }
        .input__text {
          width: 100%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          background: transparent;
          border: 1px solid #e5e6e6;
          transition: all ease-in-out 0.15s;
        }

        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }

        .input__text:-webkit-autofill {
          box-shadow: 0 0 0 30px white inset;
          border: 1px solid #e5e6e6;
          -webkit-text-fill-color: #0b0b0b;
        }

        .input__text:-webkit-autofill:focus {
          border: 1px solid #a1a1a1;
        }

        .dropdown__wrapper {
          position: relative;
        }

        .dropdown__wrapper::after {
          content: '';
          position: absolute;
          top: calc(50% - 6px);
          right: 24px;
          display: inline-block;
          transform: rotate(45deg);
          border-style: solid;
          border-width: 6px 6px 0 0;
          border-color: transparent #8614f8 transparent transparent;
        }

        .dropdown {
          padding: 11px 16px 8px;
          border-radius: 5px;
          width: 100%;
          height: 47px;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          border: 1px solid #e5e6e6;
          font-family: inherit;
          appearance: none;
          cursor: pointer;
        }

        .dropdown:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .button {
          align-self: flex-start;
          padding: 16px 24px 14px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: white;
          background: #8614f8;
          background-image: linear-gradient(180deg, #8614f8 0%, #760be0 100%);
          box-shadow: inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
          cursor: pointer;
          user-select: none;
          margin: 8px 0 0;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
        }

        .button:hover {
          color: white;
          background: #6606c6;
        }

        .button:disabled {
          background: #009900;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default BillingContent;
