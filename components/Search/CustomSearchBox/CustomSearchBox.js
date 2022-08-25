import { useSearchBox } from 'react-instantsearch-hooks-web'
import classes from "./CustomSearchBox.module.scss"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Stats from '../Stats'
import IconSearch from '@/svgs/search.svg'

const CustomSearchBox = (props) => {
  const { query, refine } = useSearchBox(props)
  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter()

  useEffect(() => {
    console.log(router.asPath)
    if(router.asPath === 'pages/search' || router.asPath.includes("?query")) {
      router.replace({
        pathname: '/pages/search',
        query: { query: searchTerm }
      },
      undefined, { shallow: true }
      )
    }
  }, [searchTerm])

  useEffect(() => {
    const query = router.asPath.split('=')[1]

    if(query) {
      setSearchTerm(query)
      refine(query)
    }
  }, [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    refine(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && router.asPath !== '/pages/search') {
     router.push(`/pages/search?query=${searchTerm}`)
    }
  }

  return (
    <div className={classes['searchbox-wrap']}>
      {/* {query && <Stats />} */}
      <div className={classes['searchbox']}>
        <IconSearch />
        <input className="h6" type="text" placeholder="Search here" onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => handleChange(e)} value={searchTerm} />
      </div>
    </div>
  )
}

export default CustomSearchBox