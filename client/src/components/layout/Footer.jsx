import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi'

import { publicNavLinks } from '../../utils/navigationLinks'

function Footer({ personalInfo }) {
  const year = new Date().getFullYear()
  const socialLinks = [
    {
      href: personalInfo?.github_url,
      icon: FiGithub,
      label: 'GitHub',
    },
    {
      href: personalInfo?.linkedin_url,
      icon: FiLinkedin,
      label: 'LinkedIn',
    },
    {
      href: personalInfo?.twitter_url,
      icon: FiTwitter,
      label: 'Twitter',
    },
    {
      href: personalInfo?.email ? `mailto:${personalInfo.email}` : '',
      icon: FiMail,
      label: 'Email',
    },
  ].filter((link) => link.href)

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-10 dark:border-navy-lighter dark:bg-navy-light">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {year} {personalInfo?.full_name || 'Portfolio'}. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Built with React & ❤️</p>

          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold text-gold transition hover:bg-gold hover:text-navy"
                href={href}
                key={label}
                rel="noreferrer"
                target={href.startsWith('mailto:') ? undefined : '_blank'}
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 md:max-w-sm">
          {publicNavLinks.map((link) => (
            <a
              className="text-sm font-medium text-gray-500 transition hover:text-gold dark:text-gray-400 dark:hover:text-gold"
              href={`#${link.id}`}
              key={link.id}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
