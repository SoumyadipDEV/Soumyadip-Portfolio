import Card from '../../components/common/Card'

function AdminPageShell({ title, description }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy dark:text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        ) : null}
      </div>

      <Card>
        <p className="text-sm text-slate-500 dark:text-slate-400">No records loaded.</p>
      </Card>
    </div>
  )
}

export default AdminPageShell
