import { createContext, useContext, useState, useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import ArticleFiltersDrawer from '@/components/Layout/ArticleFiltersDrawer'
import FishermenInfoDrawer from '@/components/Layout/FishermenInfoDrawer/FishermenInfoDrawer'
import moment from 'moment'

const ArticleFiltersDrawerContext = createContext()

function drawerReducer(state, action) {
  switch (action.type) {
    case 'set_info_card': {
      return {
        ...state,
        infoCardFields: action.payload
      }
    }
    case 'is_fishermen': {
      return {
        ...state,
        isFishermen: true,
      }
    }
    case 'open_fish_info': {
      return {
        ...state,
        isFishInfoOpen: true
      }
    }
    case 'close_fish_info': {
      return {
        ...state,
        isFishInfoOpen: false
      }
    }
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true
      }
    }
    case 'close_drawer': {
      return {
        ...state,
        isOpen: false
      }
    }
    case 'add_tag_count': {
      return {
        ...state,
        tagCount: action.payload
      }
    }
    case 'add_tag_array': {
      return {
        ...state,
        tagArray: action.payload
      }
    }
    case 'add_original_listings': {
      return {
        ...state,
        originalListings: action.payload
      }
    }
    case 'add_listings': {
      return {
        ...state,
        listings: action.payload
      }
    }
    case 'add_filters': {
      return {
        ...state,
        filters: action.payload
      }
    }
    case 'add_select_value': {
      return {
        ...state,
        selectValue: action.payload
      }
    }
    case 'add_selected_filters': {
      return {
        ...state,
        selectedFilterList: [...state.selectedFilterList.filter(filter => filter !== action.payload), action.payload]
      }
    }
    case 'remove_selected_filters': {
      return {
        ...state,
        selectedFilterList: [...state.selectedFilterList.filter(filter => filter !== action.payload)]
      }
    }
    case 'toggle_checkbox': {
      if(action.payload.hasSubfilter) {
        return {
          ...state,
          filters: {
            ...state.filters,
            [action.payload.filterGroup]: {
              options: {
                ...state.filters[action.payload.filterGroup].options,
                [action.payload.option]: {
                  checked: state.filters[action.payload.filterGroup].options[action.payload.option].checked,
                  subFilters: {
                    ...state.filters[action.payload.filterGroup].options[action.payload.option].subFilters,
                    [action.payload.subFilter]: {
                      checked: !state.filters[action.payload.filterGroup].options[action.payload.option].subFilters[action.payload.subFilter].checked,
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        return {
          ...state,
          filters: {
            ...state.filters,
            [action.payload.filterGroup]: {
              options: {
                ...state.filters[action.payload.filterGroup].options,
                [action.payload.option]: {
                  checked: !state.filters[action.payload.filterGroup].options[action.payload.option].checked,
                  subFilters: action.payload.subFilters
                },
              }
            }
          }
        }
      }
    }
    default:
      return state
  }
}

const initialState = {
  isOpen: false,
  isFishermen: false,
  filters: {},
  selectedFilterList: [],
  listings: [],
  originalListings: [],
  tagCount: {},
  tagArray: [],
  selectValue: 'newest',
  infoCardFields: {},
  isFishInfoOpen: false
}

export function useArticleFiltersDrawerContext() {
  return useContext(ArticleFiltersDrawerContext)
}

export function ArticleFiltersDrawerProvider({ children }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(drawerReducer, initialState)

  const { isOpen, infoCardFields, isFishInfoOpen, filters, selectedFilterList, listings, originalListings, tagCount, tagArray, selectValue, isFishermen} = state

  const setIsFishermen = () => {
    dispatch({type: 'is_fishermen'})
  }

  const openDrawer = () => {
    dispatch({ type: 'open_drawer'})
  }

  const openFishInfo = () => {
    dispatch({ type: 'open_fish_info'})
  }

  const closeDrawer = () => {
    dispatch({ type: 'close_drawer'})
  }

  const addSelectValue = (value) => {
    dispatch({ type: 'add_select_value', payload: value})
  }

  const addFilters = (filters) => {
    dispatch({ type: 'add_filters', payload: filters})
  }

  const addTagCount = (tagCount) => {
    dispatch({ type: 'add_tag_count', payload: tagCount})
  }

  const addTagArray = (tags) => {
    dispatch({ type: 'add_tag_array', payload: tags})
  }

  const addListings = (listings) => {
    dispatch({ type: 'add_listings', payload: listings})
  }

  const addOriginalListings = (listings) => {
    dispatch({ type: 'add_original_listings', payload: listings})
  }
  
  const setInfoCard = (info) => {
    dispatch({ type: 'set_info_card', payload: info})
  }

  const filterListingsByTags = () => {
    let res = []

    const filteredArray = tagArray.filter((tag) => {
      return selectedFilterList.includes(tag)
    })

    if(selectedFilterList.length > 0) {
      if(isFishermen) {
        res = originalListings.filter((listing) => {
          return listing.species?.some(tag => filteredArray.includes(tag.header.toLowerCase()) && tagCount[tag.header.toLowerCase()] >= 2)
        })
      } else {
        res = originalListings.filter((listing) => {
          return listing.fields?.articleTags?.some(tag => filteredArray.includes(tag.value.toLowerCase()) && tagCount[tag.value.toLowerCase()] >= 3)
        })
      }
     
      selectedFilterList.filter((tag) => {
        return tagCount[tag] >= 3
      })
    } else {
      res = originalListings
    }

    dispatch({ type: 'add_listings', payload: res})
  }

  const sortListings = (listings, mostRecent) => {
    const sortedListings = listings.sort((a, b) => {
      let aPublishedDate = a.fields ? moment(a.fields.createdAt).unix() : moment(a.createdAt).unix()
      let bPublishedDate = b.fields ? moment(b.fields.createdAt).unix() : moment(b.createdAt).unix()
      if (a.fields?.publishedDate) {
        aPublishedDate = moment(a.fields.publishedDate).unix()
      }
      if (a.publishedDate) {
        aPublishedDate = moment(a.publishedDate).unix()
      }
      if (b.fields?.publishedDate) {
        bPublishedDate = moment(b.fields.publishedDate).unix()
      }
      if (b.publishedDate) {
        bPublishedDate = moment(b.publishedDate).unix()
      }
      return (mostRecent) ?  bPublishedDate - aPublishedDate : aPublishedDate - bPublishedDate
    })
    dispatch({ type: 'add_listings', payload: sortedListings})
  }

  const selectChangeHandler = (value) => {
    addSelectValue(value)

    if(selectedFilterList.length > 0 && value === 'newest') {
    sortListings(listings, true)
    }

    if(selectedFilterList.length > 0 && value === 'oldest') {
      sortListings(listings, false)
    }

    if(selectedFilterList.length === 0 && value === 'newest') {
      sortListings(originalListings, true)
    }

    if(selectedFilterList.length === 0 && value === 'oldest') {
      sortListings(originalListings, false)
    }
  }

  const subOptionHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    filters[filterGroup].options[filterOption].checked = false

    dispatch({ type: 'toggle_checkbox', payload: {
      hasSubfilter,
      filterGroup,
      option: filterOption,
      subFilter: subFilter
    }})

    if(filters[filterGroup].options[filterOption].subFilters[subFilter].checked) {
      dispatch({type: 'remove_selected_filters', payload: subFilter})
      filterListingsByTags()
    } else {
      dispatch({type: 'add_selected_filters', payload: subFilter})
      filterListingsByTags()
    }
  }

  const optionHandler = (hasSubfilter, filterGroup, filterOption) => {
    if(hasSubfilter) {
      filters[filterGroup].options[filterOption].checked = !filters[filterGroup].options[filterOption].checked
      dispatch({type: 'remove_selected_filters', payload: filters[filterGroup].options[filterOption]})

      const nestedSubFilters = filters[filterGroup].options[filterOption].subFilters

      if(nestedSubFilters) {
        Object.keys(nestedSubFilters).map((key) => {
          if(tagCount[key] >= 3) {
            filters[filterGroup].options[filterOption].subFilters[key].checked = !filters[filterGroup].options[filterOption].subFilters[key].checked
          }

          if(filters[filterGroup].options[filterOption].subFilters[key].checked) {
            dispatch({type: 'add_selected_filters', payload: key})
            filterListingsByTags()
          } else {
            dispatch({type: 'remove_selected_filters', payload: key})
            filterListingsByTags()
          }
        })
      }
    } else {
      const nestedSubFilters = filters[filterGroup].options[filterOption].subFilters

      Object.keys(nestedSubFilters).map((key) => {
        if(tagCount[key] >= 3) {
          filters[filterGroup].options[filterOption].subFilters[key].checked = true
        }

        if(filters[filterGroup].options[filterOption].subFilters[key].checked) {
          dispatch({type: 'add_selected_filters', payload: key})
          filterListingsByTags()
        } else {
          dispatch({type: 'remove_selected_filters', payload: key})
          filterListingsByTags()
        }
      })
      
      dispatch({ type: 'toggle_checkbox', payload: {
        hasSubfilter,
        filterGroup,
        option: filterOption,
        subFilters: nestedSubFilters
      }})

      if(filters[filterGroup].options[filterOption].checked) {
        dispatch({type: 'remove_selected_filters', payload: filterOption})
        filterListingsByTags()
      } else {
        dispatch({type: 'add_selected_filters', payload: filterOption})
        filterListingsByTags()
      }
    }
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')

    if (isFishInfoOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isFishInfoOpen) document.querySelector('html').classList.remove('disable-scroll')

    filterListingsByTags(listings)

    const handleResize = () => {
      if (window.innerWidth >= 1074) {
        dispatch({ type: 'close_drawer'})
        if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
      }
      if(window.innerWidth < 1074 && isOpen) {
        dispatch({ type: 'open_drawer'})
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, selectedFilterList, isFishInfoOpen])

  useEffect(() => {
    router.beforePopState(({ as }) => {
      dispatch({ type: 'close_drawer' })
      return true
    })
    return () => {
      router.beforePopState(() => true)
    }
  }, [router])

  return (
    <ArticleFiltersDrawerContext.Provider value={{isOpen, openFishInfo, isFishInfoOpen, setInfoCard, infoCardFields, setIsFishermen, isFishermen, selectChangeHandler, addTagCount, addTagArray, tagCount, filters, filterListingsByTags, openDrawer, closeDrawer, addFilters, optionHandler, subOptionHandler, dispatch, selectedFilterList, listings, originalListings, addListings, addOriginalListings, sortListings}}>
      {isOpen &&
        <ArticleFiltersDrawer />
      }
      {isFishInfoOpen &&
        <FishermenInfoDrawer />
      }
      {children}
    </ArticleFiltersDrawerContext.Provider>
  )
}