import type { ReactNode, SVGProps } from "react"

type Props = SVGProps<SVGSVGElement>

function BaseIcon({ children, ...props }: Props & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export const AddIcon = (props: Props) => (
  <BaseIcon {...props}>
    <path d="M12 5v14M5 12h14" />
  </BaseIcon>
)

export const SearchIcon = (props: Props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </BaseIcon>
)

export const ArrowIcon = (props: Props) => (
  <BaseIcon {...props}>
    <path d="m9 18 6-6-6-6" />
  </BaseIcon>
)

export const CloseIcon = (props: Props) => (
  <BaseIcon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </BaseIcon>
)

export const BoxIcon = (props: Props) => (
  <BaseIcon {...props}>
    <path d="m4 7 8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10" />
  </BaseIcon>
)

export const CheckIcon = (props: Props) => (
  <BaseIcon {...props}>
    <path d="m5 12 4 4L19 6" />
  </BaseIcon>
)
