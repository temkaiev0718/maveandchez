import {
  useInstantSearch,
} from 'react-instantsearch-hooks-web'

import classes from './IndexButton.module.scss'

const IndexButton = (props) => {
    const { indexId, hide, currentIndex, setCurrentIndex } = props
    const { scopedResults } = useInstantSearch(props)
    const foundScoped = scopedResults?.find(index => index.indexId === indexId)
   
    return (
      <button className={`${classes['tab-btn']} ${currentIndex === indexId ? classes['active'] : ''} ${hide ? 'display--none' : ''} h5 tab-btn`} onClick={() => setCurrentIndex(indexId)}>
         {indexId === 'all_results' && 'All Results'}
        {indexId === 'prod_shopify_products' && 'Products'}
        {indexId === 'culinary_articles' && 'Culinary Resources'}
        {indexId === 'brand_articles' && 'Articles'}
        
        {/* <span style={{ marginLeft: '4px' }}>
          ({foundScoped?.results?.nbHits})
        </span> */}
      </button>
    )
}

export default IndexButton
  