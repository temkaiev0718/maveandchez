import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMediaQuery } from 'react-responsive'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

import { Navigation, Thumbs } from "swiper";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css"

import classes from './HarvestCard.module.scss'

const HarvestCard = ({ fish, cardStyle, filtered }) => {
  const [tabButtonTitle, setTabButtonTitle] = useState("species")
  const [tabInfo, setTabInfo] = useState({})
  const [mounted, setMounted] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  
  useEffect(() => {
    const getFish = async () => {
      const refinedFish = await getNacelleReferences(fish['species'])
      setTabInfo(refinedFish)
    }

    setMounted(true)
    setThumbsSwiper()
    getFish()
  }, [thumbsSwiper, filtered])

  const isMobile =  useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 768px)'})

  const findTabInfo = async (category) => {
    setTabButtonTitle(category)

    const refinedFish = await getNacelleReferences(fish[category])
    setTabInfo(refinedFish)
  }

  return (
    <div className={`${classes['harvest__card']} ${cardStyle === 'projected-card' ? classes['projected-card'] : ""}`}>
       {cardStyle === 'projected-card' && isMobile && mounted && tabInfo?.image?.asset?.url && tabInfo[0]?._type !== 'fishermen' &&
        <div className={classes['harvest__card-img']}>
          <Image
              src={tabInfo.image.asset.url}
              alt={tabInfo.title}
              width={858}
              height={572}
          />
        </div>}

        {cardStyle === 'projected-card' && isDesktop && mounted && tabInfo?.image?.asset?.url && tabInfo[0]?._type !== 'fishermen' &&
        <div className={classes['harvest__card-img']}>
          <Image
            src={tabInfo.image.asset.url}
            alt={tabInfo.title}
            objectFit="cover"
            layout='fill'
          />
        </div>}

        {cardStyle !== 'projected-card' && tabInfo?.image?.asset?.url && mounted && tabButtonTitle !== 'fishermen' &&
        <div className={classes['harvest__card-img']}>
          <Image
              src={tabInfo.image.asset.url}
              alt={tabInfo.title}
              width={858}
              height={572}
          />
        </div>}

        {tabButtonTitle === 'fishermen' &&
          <Swiper 
              navigation={true}
              slidesPerView={1}
              onSwiper={setThumbsSwiper} 
              modules={[Navigation, Thumbs]} 
              thumbs={{ swiper: thumbsSwiper }} 
              className="fishermen-swiper">
              {fish.fishermen.map((fishermen) => {
                return (
                  <SwiperSlide key={`${fishermen.type}--${fish._key}`}> 
                    <div className={classes['harvest__card-img']}>
                      <Image
                          src={fishermen.image?.asset.url}
                          alt={fishermen.title}
                          width={858}
                          height={572}
                      />
                    </div>
                  </SwiperSlide>
                )
              })}
          </Swiper>}

        <div className={classes['harvest__card-inner']}>
          <div className={classes['harvest__card-tabs']}>
            <Swiper
                  slidesPerView={"auto"}
                  spaceBetween={36}
                  breakpoints={{
                    1024: {
                      spaceBetween: cardStyle === 'projected-card' ? 36 : 60
                    }
                }}
                  className={classes['harvest__card-swiper']}
              >
                {Object.keys(fish).filter((key) => key === "species" || key === "locations" || key === "fishermen" || key === "culinary").reverse().map((fishCategory) => {
                  return (
                    <SwiperSlide key={`${fish._key}--${fishCategory}`} className={`${tabButtonTitle === fishCategory ? classes['active'] : ""} ${classes['harvest__card-tab']}`}> 
                      <button className={`${cardStyle === 'projected-card' ? 'heading--projected-tab' : 'heading--tab'}`} onClick={() => findTabInfo(fishCategory.toString())}>
                        {fishCategory === 'fishermen' ? 'Caught By' : fishCategory}
                      </button>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
          </div>

          {tabButtonTitle !== 'fishermen' && 
          <div className={classes['harvest__card-content']}>
              {tabInfo.header && <h4 className={`${cardStyle === 'projected-card' ? 'heading--projected-title' : ""}`}>{tabInfo.header}</h4>}
              {tabInfo.subheader && <h5>{tabInfo.subheader}</h5>}
              {tabInfo.content && <div className={classes['content-block']}><PortableText value={tabInfo.content} /></div>}
          </div>}

          {tabButtonTitle === 'fishermen' &&
            <Swiper 
              slidesPerView={1}
              onSwiper={setThumbsSwiper} 
              watchSlidesProgress={true}
              allowTouchMove={false}
              modules={[Navigation, Thumbs]} 
              className={classes['harvest__card-swiper']}>
                {fish.fishermen.map((fishermen) => {
                  return (
                    <SwiperSlide key={`${fish._key}--${fishermen.title}`}> 
                      <div className={classes['harvest__card-content']}>
                          {fishermen.header && <h4 className={`${cardStyle === 'projected-card' ? 'heading--projected-title' : ""}`}>{fishermen.header}</h4>}
                          {fishermen.subheader && <h5>{fishermen.subheader}</h5>}
                          {fishermen.content && <div className={classes['content-block']}><PortableText value={fishermen.content} /></div>}
                      </div> 
                    </SwiperSlide>
                  )
                })}
            </Swiper>}
        </div>
    </div>
  )
}

export default HarvestCard