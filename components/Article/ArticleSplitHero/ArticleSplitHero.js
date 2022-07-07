import React, { useState, useEffect } from 'react'
import { useTimer } from 'react-timer-hook'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import classes from './ArticleSplitHero.module.scss'
import IconClock from '@/svgs/clock.svg'
import IconChefHat from '@/svgs/chef-hat.svg'
import IconCutlery from '@/svgs/cutlery.svg'
import IconScale from '@/svgs/scale.svg'
import IconBullet from '@/svgs/list-item.svg'
import IconPlayButton from '@/svgs/play-button.svg'
import ResponsiveImage from '@/components/ResponsiveImage'
import { useHeaderContext } from '@/context/HeaderContext'
import { useModalContext } from '@/context/ModalContext'
import ArticleVideo from '../ArticleVideo'

/*
  Split Hero can be used for Article or Blog Listing Pages
  - needs fields from sanity
  - if listing page, render blog-listing style -> renderType
  - if article
    - if article recipe, render recipe style -> renderType
    - if not, render default style  -> renderType
  - if content is either brand or culinary to render unique background color & image -> blogType

  renderTypes:
    - blog-listing -> colored background with illustration image
    - recipe -> recipe content inside floating panel/box
    - default -> white background
    - cooking-guide -> same as default, but with sticky hero image/video
    - live-cooking-class -> same as default, but with a countdown timer
*/

const ArticleSplitHero = ({fields, renderType = 'default', blogType = 'culinary', blogSettings }) => {
  const [mounted, setMounted] = useState(false)
  const [startVideo, setStartVideo] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )
  const { hide, headerRef } = useHeaderContext()
  const { setIsOpen, setModalType } = useModalContext()

  const {prepTime, ctaText, ctaUrl, desktopBackgroundImage, mobileBackgroundImage, difficulty, header, subheader, servings, tags, cookTime, youtubeVideoId, classStartDate } = fields

  const expiryTimestamp = new Date(classStartDate);

  // console.log("expiryTimestamp", expiryTimestamp)

  const {
    minutes,
    hours,
    days,
    isRunning
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  const getStickyPosition = () => {

  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!blogSettings) {
    return ''
  }

  const showVideo = () => {
    setStartVideo(true)
  }

  const backgroundColorClass = `article-hero--${blogSettings.fields[blogType].backgroundColor}-bg-color`
  const backgroundIllustrationImage = blogSettings.fields[blogType].illustrationImage
  const renderTypeClass = `article-hero--render-type-${renderType}`

  // TODO for Adrian: add navigation once all blogs and articles are added by getStaticPaths

  return (
    <div className={`${classes['article-hero']} ${classes[renderTypeClass]} ${classes[backgroundColorClass]}`}>
      <div className={classes['article-hero__content']}>

        {backgroundIllustrationImage && renderType === 'blog-listing' && isDesktop && mounted &&
          <div className={classes['article-hero__illustration-image']}>
            <ResponsiveImage
              src={backgroundIllustrationImage.asset.url}
              layout="fill"
              alt={backgroundIllustrationImage.asset.alt || ''}
            />
          </div>
        }

        <div className={classes['article-hero__content-inner']}>
          <div className={classes['article-hero__navigation']}>
            <Link href="">
              <a><IconBullet /> <span>Back to something something</span></a>
            </Link>
          </div>
          {renderType === 'live-cooking-class' ? (
            <h1 className={classes['article-hero__heading']}>Live Cooking Class</h1>
          ):(
            <h1 className={classes['article-hero__heading']}>{header}</h1>
          )}
          {subheader && <h2 className={classes['article-hero__subheading']}>{subheader}</h2>}

          {isRunning && classStartDate && <div className={classes['article-hero__countdown-timer']}>
            <h4>Next Class Starts In</h4>
            <ul>
              <li>Days: {days}</li>
              <li>Hours: {hours}</li>
              <li>Minutes: {minutes}</li>
            </ul>
            <button onClick={() => {
              setModalType('cooking_class_signup')
              setIsOpen(true)}
            }
            className={`${classes['article-hero__action-btn']} btn salmon`}>Sign Me Up</button>
          </div>}

          {tags && <ul className={classes['article-hero__tags']}>
            {tags.map((tag, index) => {
              return <li className={classes['article-hero__tag']} key={index}>{tag.value}</li>
            })}
          </ul>}

          <ul className={classes['recipe-meta-details']}>
            {prepTime &&
              <li>
                <IconClock />
                <div><b>Prep Time:</b><span>{prepTime}</span></div>
              </li>
            }
            {cookTime &&
              <li>
                <IconChefHat />
                <div><b>Cook Time:</b><span>{cookTime}</span></div>
              </li>
            }
            {servings &&
              <li>
                <IconCutlery />
                <div><b>Servings:</b><span>{servings}</span></div>
              </li>
            }
            {difficulty &&
              <li>
                <IconScale />
                <div><b>Difficulty:</b><span>{difficulty}</span></div>
              </li>
            }
          </ul>
          {ctaText && ctaUrl &&
            <Link href={ctaUrl}>
              <a className={`${classes['article-hero__cta']} btn-link-underline`}>{ctaText}</a>
            </Link>
          }
        </div>
      </div>

      <div className={classes['article-hero__image-wrapper']} style={{'top': `${ hide ? 0 : headerRef.current?.offsetHeight}px`}}>
        {!startVideo && <div className={classes['article-hero__image']}>
          {mobileBackgroundImage && isMobile && mounted &&
            <ResponsiveImage
              src={mobileBackgroundImage.asset.url}
              layout="fill"
              alt={mobileBackgroundImage.asset.alt || ''}
            />}
          {desktopBackgroundImage && isDesktop && mounted &&
            <Image
              src={desktopBackgroundImage.asset.url}
              layout="fill"
              alt={desktopBackgroundImage.asset.alt || ''}
            />
          }
          {youtubeVideoId &&
            <button
              className={classes['article-hero__play-btn']}
              onClick={() => showVideo()}><IconPlayButton /></button>
          }
        </div>}
        {youtubeVideoId && <ArticleVideo youtubeVideoId={youtubeVideoId} startVideo={startVideo} className={classes['article-hero__video']} />}
      </div>

    </div>
  )
}

export default ArticleSplitHero