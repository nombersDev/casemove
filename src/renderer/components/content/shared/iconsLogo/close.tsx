const TitleBarClose = (props) => (
  <svg
    fill="none"
    stroke="#000"
    height={12}
    width={12}
    xmlns="http://www.w3.org/2000/svg"
    className="m-auto stroke-current text-current "
    {...props}
  >
    <path
      strokeWidth={1}
      shapeRendering="geometricPrecision"
      d="M0 10 10 0M0 0l10 10"
    />
  </svg>
)

export default TitleBarClose