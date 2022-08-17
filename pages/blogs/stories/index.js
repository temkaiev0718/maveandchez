import React from 'react'

import { nacelleClient } from 'services'
import ContentSections from '../../../components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

export default function BrandBlog({ page }) {
  return (
    <>
      <StructuredData type="blog" data={page} />
      <PageSEO seo={page.fields.seo} />
      <ContentSections sections={page.fields.content} />
    </>
  )
}

export async function getStaticProps({ previewData }) {

  const pages = await nacelleClient.content({
    handles: ['brand-blog'],
    entryDepth: 1
  })

  const fullRefPage = await getNacelleReferences(pages[0])

  return {
    props: { page: fullRefPage }
  }

}