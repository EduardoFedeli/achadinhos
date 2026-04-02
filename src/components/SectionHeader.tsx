import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  href?: string
  linkLabel?: string
  id?: string
}

export default function SectionHeader({
  title,
  href,
  linkLabel = 'Ver mais →',
  id,
}: SectionHeaderProps) {
  return (
    <div id={id} className="flex items-center justify-between px-4 pb-3 pt-5">
      <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-white">
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-xs font-semibold text-brand">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
