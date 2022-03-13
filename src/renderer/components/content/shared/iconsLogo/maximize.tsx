const TitleBarMaximize = (props) => (
  <svg
    fill="none"
    stroke="#000"
    height={11}
    width={11}
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    className="m-auto stroke-current text-gray-800 dark:text-dark-white"
    {...props}
  >
    <path 
      strokeWidth={0.7} d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
  </svg>
)

export default TitleBarMaximize
