import Button from '../common/Button'
import Card from '../common/Card'
import SectionShell from './SectionShell'

function ResumeSection() {
  return (
    <SectionShell badge="Resume" id="resume" title="Resume download">
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-500 dark:text-gray-400">Latest resume link appears here.</p>
        <Button type="button">Download Resume</Button>
      </Card>
    </SectionShell>
  )
}

export default ResumeSection
