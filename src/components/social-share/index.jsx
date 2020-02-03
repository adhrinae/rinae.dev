import React from 'react'
import { FacebookIcon } from './facebook-icon'
import { TwitterIcon } from './twitter-icon'
import { shareToTwitter, shareToFacebook } from '../../utils/share'

import './index.scss'

export const SocialShare = ({ title, authorName, twitter }) => {
  const generateText = name => `${name} 님이 쓴 글 "${title}" 을 추천합니다.`

  const onClickTwitterIcon = e => {
    e.preventDefault()

    return shareToTwitter(window.location.href, generateText('@' + twitter))
  }

  const onClickFacebookIcon = e => {
    e.preventDefault()
    return shareToFacebook(window.location.href, generateText(authorName))
  }

  return (
    <div className="social-share">
      <FacebookIcon onClick={onClickFacebookIcon} />
      <TwitterIcon onClick={onClickTwitterIcon} />
    </div>
  )
}
