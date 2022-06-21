import classes from './CheckoutFlyout.module.scss';
import { StateBasedCheckout } from '../Checkout/StateBasedCheckout';
import { useHeadlessCheckoutContext } from '@/context/HeadlessCheckoutContext';
import IconClose from '@/svgs/close.svg'

const CheckoutFlyout = () => {
  const {
    data,
    flyoutState,
    setFlyoutState
  } = useHeadlessCheckoutContext();

  const checkoutStateStyle = flyoutState ? classes['show'] : classes['hide'];

  return (
    <div className={`${classes.cart} ${checkoutStateStyle}`}>
      <header className={classes['cart-header']}>
        <h3 className={classes['cart-title']}>Flyout Checkout</h3>
        <button
          className={classes['close-button']}
          onClick={() => setFlyoutState(false)}>
            <IconClose />
        </button>
      </header>
      <section className={classes['cart-items']}>
        {data && <StateBasedCheckout data={data} />}
      </section>
      <footer className={classes['sub-total-footer']}>
        <h4 className={classes['sub-total']}>
          <span>Total:</span>
        </h4>
      </footer>
    </div>
  );
};

export default CheckoutFlyout;
