import React, { forwardRef } from 'react'
import propTypes from 'prop-types'
import { Button as AntButton } from 'antd'

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 **/

const Button = forwardRef(
  (
    {
      size,
      type,
      disabled,
      onClick,
      children,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <AntButton
        size={size}
        onClick={onClick}
        disabled={disabled}
        ref={ref}
        type={type}
        {...otherProps}
      >
        {children}
      </AntButton>
    )
  },
)

Button.defaultProps = {
  size: 'middle',
  type: 'primary',
  disabled: false,
  onClick: () => {},
}

Button.propTypes = {
  /** The size of the button. */
  size: propTypes.oneOf(['small', 'middle', 'large']),
  /** The type of the button. */
  type: propTypes.oneOf(['primary', 'dashed', 'outline', 'ghost']),
  /** If true, the button will be disabled. */
  disabled: propTypes.bool,
  /** Callback when click. */
  onClick: propTypes.func,
  /** For css custoization. */
  /** The component content. */
  children: propTypes.node.isRequired,
}

export default Button
