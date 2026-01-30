type ErrorMessageProps = {
    children: React.ReactNode
}

export default function ErrorMessage({children} : ErrorMessageProps) {
  return (
    <div className="bg-red-50 text-red-600 p-3 uppercase text-sm font-bold rounded-lg text-center">{children}</div>
  )
}
