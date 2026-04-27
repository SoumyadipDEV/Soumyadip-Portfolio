import SectionTitle from '../common/SectionTitle'
import SectionWrapper from '../common/SectionWrapper'

function SectionShell({ badge, children, className = '', id, title, tone = 'default' }) {
  return (
    <SectionWrapper className={className} id={id} tone={tone}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={badge} title={title} />
        {children}
      </div>
    </SectionWrapper>
  )
}

export default SectionShell
