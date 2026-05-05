import { useState } from 'react'
import toast from 'react-hot-toast'

import { downloadLatestResume } from '../../utils/resumeDownload'
import Button from '../common/Button'
import Card from '../common/Card'
import SectionShell from './SectionShell'

/** Public resume callout that downloads the latest published file. */
function ResumeSection() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)

    try {
      await downloadLatestResume()
    } catch (error) {
      toast.error(error.message || 'Unable to download resume')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <SectionShell badge="Resume" id="resume" title="Resume download">
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-500 dark:text-gray-400">Download the latest published resume.</p>
        <Button disabled={downloading} onClick={handleDownload} type="button">
          {downloading ? 'Preparing Resume' : 'Download Resume'}
        </Button>
      </Card>
    </SectionShell>
  )
}

export default ResumeSection
