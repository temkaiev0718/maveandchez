import classes from './Footer.module.scss'

import EmailSignupBlock from '@/components/Sections/EmailSignupBlock'
import FooterNavigation from './FooterNavigation'
import FooterBottom from './FooterBottom'
import FooterProps from './FooterProps'

const Footer = ({ content }) => {

  if (!content) {
    return ''
  }

  return (
    <footer className={classes.footer}>
      <FooterProps props={content} />
      <div className="container">
        <EmailSignupBlock props={content} />
        <FooterNavigation props={content} classes={classes} />
        <FooterBottom props={content} classes={classes} />
      </div>
    </footer>
  )
}

export default Footer
