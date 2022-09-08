import { ArticleProvider } from '@/context/ArticleContext'
import { ArticleFiltersDrawerProvider } from '@/context/ArticleFiltersDrawerContext'
import { TheCatchProvider } from '@/context/TheCatchContext'
import { ModalProvider } from '@/context/ModalContext'
import { PDPDrawerProvider } from '@/context/PDPDrawerContext'
import { CustomerProvider } from '@/context/CustomerContext'
import { PurchaseFlowProvider } from '@/context/PurchaseFlowContext'
import { HeadlessCheckoutProvider } from '@/context/HeadlessCheckoutContext'
import { HeaderProvider } from '@/context/HeaderContext'
import { KnowYourFishDrawerProvider } from '@/context/KnowYourFishDrawerContext'
import { SearchProvider } from '@/context/SearchModalContext'
import { EditScheduleDrawerProvider } from '@/context/EditScheduleDrawerContext'

import StructuredData from '../SEO/StructuredData'
import Footer from '@/components/Layout/Footer'

// This component utilizes `useCart` and `useCheckout` hooks from
// `@nacelle/react-hooks` to clear cart and checkout data if the
// checkout is completed.
// https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks

function Layout({ children, headerSettings, footerSettings, searchLinks }) {

  return (
    <CustomerProvider>
      <ModalProvider>
        <HeadlessCheckoutProvider pageHandle={children.props.handle}>
          <PurchaseFlowProvider>
            <PDPDrawerProvider>
            <SearchProvider searchLinks={searchLinks}>
              <KnowYourFishDrawerProvider>
                <EditScheduleDrawerProvider>
                  <ArticleFiltersDrawerProvider>
                    <ArticleProvider>
                      <TheCatchProvider>
                          <HeaderProvider content={headerSettings} pageHandle={children.props.handle} >
                            <StructuredData type="breadcrumb" />
                            <main className={`main--${children.props.handle}`}>{children}</main>
                            <Footer content={footerSettings} />
                          </HeaderProvider>
                      </TheCatchProvider>
                    </ArticleProvider>
                  </ArticleFiltersDrawerProvider>
                </EditScheduleDrawerProvider>
              </KnowYourFishDrawerProvider>
              </SearchProvider>
            </PDPDrawerProvider>
          </PurchaseFlowProvider>
        </HeadlessCheckoutProvider>
      </ModalProvider>
    </CustomerProvider>
  )
}

export default Layout
