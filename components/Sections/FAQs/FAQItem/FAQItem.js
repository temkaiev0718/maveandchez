import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import Expand from 'react-expand-animated'
import IconMinus from '@/svgs/minus.svg'
import IconPlus from '@/svgs/plus.svg'
import classes from './FAQItem.module.scss'

const FAQItem = ({item}) => {

  const [height, setHeight] = useState(0)

  const toggleExpand = () => {
    height === 0 ? setHeight('auto') : setHeight(0)
  }

  if (!item.answer) {
    return ''
  }

  return (
    <li className={classes['faq__item']}>
        <h3 onClick={() => toggleExpand()}>
          {item.question}
          {height !== 0 ? (
            <IconMinus className={classes['minus']} />
          ):(
            <IconPlus className={classes['plus']} />
          )}
        </h3>
        <Expand open={height !== 0} duration={300}>
          <div className={`${classes['faq__item-description']} body`}>
            <PortableText value={item.answer} />
          </div>
        </Expand>
      </li>
  )
}

export default FAQItem